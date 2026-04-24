"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { settingsService } from "@/src/services/settings/settings.service";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("รองรับเฉพาะไฟล์รูปภาพ"));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
    reader.readAsDataURL(file);
  });
}

export default function AdminSettingsPage() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [promoImageUrl, setPromoImageUrl] = React.useState("");
  const [changed, setChanged] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    settingsService
      .getPlatformSettings()
      .then((settings) => {
        if (!cancelled) setPromoImageUrl(settings.promoImageUrl || "");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setMessage(
            error instanceof Error
              ? error.message
              : "ไม่สามารถดึงการตั้งค่าหน้ารวมได้"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await readImageFile(file);
      setPromoImageUrl(dataUrl);
      setChanged(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "ไม่สามารถอ่านไฟล์รูปภาพได้"
      );
    }
  }

  async function saveSettings() {
    if (!changed) return;

    setSaving(true);
    try {
      const settings = await settingsService.updatePlatformSettings({
        promoImageUrl: promoImageUrl || "",
      });
      setPromoImageUrl(settings.promoImageUrl || "");
      setChanged(false);
      setMessage("บันทึกรูปโปรโมชันหน้ารวมสำเร็จ");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "ไม่สามารถบันทึกรูปโปรโมชันหน้ารวมได้"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          ตั้งค่าหน้ารวม
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          จัดการรูปโปรโมชันที่แสดงบนหน้า rentflow.com สำหรับลูกค้าทุกร้าน
        </Typography>
      </Box>

      <Card elevation={0} className="rounded-[34px]! border border-slate-200 bg-white!">
        <CardContent className="grid gap-6 p-6! lg:grid-cols-[1.2fr_0.8fr]">
          <Box className="overflow-hidden rounded-[30px] bg-slate-100">
            {promoImageUrl ? (
              <Box
                component="img"
                src={promoImageUrl}
                alt="รูปโปรโมชันหน้ารวม"
                className="h-[340px] w-full object-cover"
              />
            ) : (
              <Box className="grid h-[340px] place-items-center px-8 text-center">
                <Typography className="text-base font-semibold text-slate-500">
                  ยังไม่มีรูปโปรโมชันหน้ารวม
                </Typography>
              </Box>
            )}
          </Box>

          <Stack spacing={2.5} className="justify-center">
            <Box>
              <Typography className="text-xl font-black text-slate-950">
                รูปโปรโมชันสำหรับ URL รวม
              </Typography>
              <Typography className="mt-2 text-sm leading-6 text-slate-500">
                ใช้สำหรับหน้าแรกแบบ marketplace รวมทุกร้าน เช่น โปรโมชันแพลตฟอร์ม แคมเปญกลาง หรือภาพประชาสัมพันธ์
              </Typography>
            </Box>

            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <Button
              variant="outlined"
              className="rounded-full! py-3! font-semibold!"
              onClick={() => inputRef.current?.click()}
            >
              เลือกรูปภาพ
            </Button>
            {promoImageUrl ? (
              <Button
                variant="outlined"
                color="error"
                className="rounded-full! py-3! font-semibold!"
                onClick={() => {
                  setPromoImageUrl("");
                  setChanged(true);
                }}
              >
                ลบรูปภาพ
              </Button>
            ) : null}
            <Button
              variant="contained"
              className="rounded-full! py-3! font-semibold!"
              disabled={loading || saving || !changed}
              onClick={saveSettings}
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info" variant="filled" className="rounded-2xl!">
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
