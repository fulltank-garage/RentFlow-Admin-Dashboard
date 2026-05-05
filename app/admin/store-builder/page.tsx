"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { storefrontService } from "@/src/services/storefront/storefront.service";
import type {
  StorefrontBlock,
  StorefrontPage,
} from "@/src/services/storefront/storefront.types";

const emptyBlock: StorefrontBlock = {
  type: "announcement",
  title: "",
  subtitle: "",
  description: "",
  buttonLabel: "",
  href: "",
  tone: "default",
  align: "left",
};

const emptyTheme: NonNullable<StorefrontPage["theme"]> = {
  primaryColor: "#2563eb",
  accentColor: "#0f172a",
  surfaceColor: "#f8fafc",
};

function toneLabel(tone?: StorefrontBlock["tone"]) {
  if (tone === "highlight") return "เน้นโปรโมชัน";
  if (tone === "dark") return "พื้นเข้ม";
  if (tone === "success") return "เชิงความมั่นใจ";
  return "มาตรฐาน";
}

export default function StoreBuilderPage() {
  const [blocks, setBlocks] = React.useState<StorefrontBlock[]>([]);
  const [theme, setTheme] =
    React.useState<NonNullable<StorefrontPage["theme"]>>(emptyTheme);
  const [isPublished, setIsPublished] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    storefrontService
      .getMarketplaceHomePage()
      .then((page) => {
        if (cancelled) return;
        setBlocks(page.blocks?.length ? page.blocks : []);
        setTheme({
          ...emptyTheme,
          ...(page.theme || {}),
        });
        setIsPublished(page.isPublished ?? true);
      })
      .catch(() => {
        if (!cancelled) {
          setBlocks([]);
          setTheme(emptyTheme);
          setIsPublished(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateBlock(index: number, patch: Partial<StorefrontBlock>) {
    setBlocks((current) =>
      current.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block
      )
    );
  }

  async function save() {
    setSaving(true);
    try {
      await storefrontService.saveMarketplaceHomePage({
        blocks: blocks.map((block, index) => ({
          ...block,
          id: block.id || `marketplace-block-${index + 1}`,
        })),
        theme,
        isPublished,
      });
      setMessage("บันทึกหน้าเว็บรวมเรียบร้อยแล้ว");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "บันทึกหน้าเว็บรวมไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box className="admin-page">
      <Box className="admin-page-header admin-page-header-with-action">
        <Box>
          <Typography className="admin-page-title">จัดหน้าเว็บรวม</Typography>
          <Typography className="admin-page-subtitle">
            จัด section หน้า rentflow.com แบบศูนย์กลาง ทั้งข้อความ โปรโมชัน ปุ่ม และโทนสีของ marketplace
          </Typography>
        </Box>
        <Box className="admin-header-action">
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? "กำลังบันทึก" : "บันทึก"}
          </Button>
        </Box>
      </Box>

      <Card elevation={0} className="admin-card rounded-3xl!">
        <CardContent className="grid gap-5">
          {loading ? (
            <Box className="grid min-h-72 place-items-center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Box className="admin-surface-soft grid gap-4 rounded-[28px] p-5">
                  <Box>
                    <Typography className="text-xl font-black text-slate-950">
                      ธีมของหน้า marketplace
                    </Typography>
                    <Typography className="mt-1 text-sm text-slate-500">
                      ใช้กำหนดสีปุ่มหลัก สีหัวข้อเข้ม และสีพื้นของบล็อกเด่นบนหน้าเว็บรวม
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      label="สีปุ่มหลัก"
                      value={theme.primaryColor || ""}
                      onChange={(event) =>
                        setTheme((current) => ({
                          ...current,
                          primaryColor: event.target.value,
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="สีข้อความเข้ม"
                      value={theme.accentColor || ""}
                      onChange={(event) =>
                        setTheme((current) => ({
                          ...current,
                          accentColor: event.target.value,
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="สีพื้นบล็อกเด่น"
                      value={theme.surfaceColor || ""}
                      onChange={(event) =>
                        setTheme((current) => ({
                          ...current,
                          surfaceColor: event.target.value,
                        }))
                      }
                      fullWidth
                    />
                  </Stack>
                </Box>

                <Box className="admin-surface grid gap-4 rounded-[28px] p-5">
                  <Box className="flex items-center justify-between gap-3">
                    <Box>
                      <Typography className="text-lg font-black text-slate-950">
                        สถานะหน้าเว็บรวม
                      </Typography>
                      <Typography className="mt-1 text-sm text-slate-500">
                        ปิดการเผยแพร่ได้ชั่วคราวหากกำลังจัด campaign ใหม่
                      </Typography>
                    </Box>
                    <Switch
                      checked={isPublished}
                      onChange={(event) => setIsPublished(event.target.checked)}
                    />
                  </Box>
                  <Box
                    className="rounded-[24px] p-4"
                    sx={{
                      backgroundColor: isPublished ? "#ecfdf5" : "#fff7ed",
                    }}
                  >
                    <Typography className="text-sm font-bold text-slate-950">
                      {isPublished ? "หน้าเว็บรวมกำลังแสดงผลอยู่" : "หน้าเว็บรวมถูกปิดการเผยแพร่ชั่วคราว"}
                    </Typography>
                    <Typography className="mt-1 text-sm text-slate-500">
                      {isPublished
                        ? "ผู้ใช้จะเห็น section ที่บันทึกล่าสุดทันทีหลังอัปเดต"
                        : "บล็อกที่จัดไว้จะถูกซ่อนไว้ก่อนจนกว่าจะเปิดใช้งานอีกครั้ง"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {blocks.length === 0 ? (
                <Box className="admin-surface-soft rounded-[28px] p-8 text-center">
                  <Typography className="font-bold text-slate-950">ยังไม่มีบล็อกหน้าเว็บรวม</Typography>
                  <Typography className="mt-1 text-sm text-slate-500">
                    เพิ่ม block เพื่อสร้าง marketplace banner, จุดขาย หรือ CTA กลางของระบบ
                  </Typography>
                </Box>
              ) : (
                blocks.map((block, index) => (
                  <Box key={block.id || index} className="admin-surface grid gap-4 rounded-[28px] p-5">
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        select
                        label="รูปแบบ"
                        value={block.type || "announcement"}
                        onChange={(event) =>
                          updateBlock(index, { type: event.target.value as StorefrontBlock["type"] })
                        }
                        fullWidth
                      >
                        <MenuItem value="announcement">ประกาศ</MenuItem>
                        <MenuItem value="feature">ข้อมูลเด่น</MenuItem>
                        <MenuItem value="cta">ปุ่มนำทาง</MenuItem>
                        <MenuItem value="text">ข้อความ</MenuItem>
                      </TextField>
                      <TextField
                        select
                        label="โทน"
                        value={block.tone || "default"}
                        onChange={(event) =>
                          updateBlock(index, { tone: event.target.value as StorefrontBlock["tone"] })
                        }
                        fullWidth
                      >
                        <MenuItem value="default">มาตรฐาน</MenuItem>
                        <MenuItem value="highlight">เน้นโปรโมชัน</MenuItem>
                        <MenuItem value="dark">พื้นเข้ม</MenuItem>
                        <MenuItem value="success">เชิงความมั่นใจ</MenuItem>
                      </TextField>
                      <TextField
                        select
                        label="การจัดวาง"
                        value={block.align || "left"}
                        onChange={(event) =>
                          updateBlock(index, { align: event.target.value as StorefrontBlock["align"] })
                        }
                        fullWidth
                      >
                        <MenuItem value="left">ชิดซ้าย</MenuItem>
                        <MenuItem value="center">กึ่งกลาง</MenuItem>
                      </TextField>
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        label="หัวข้อรอง"
                        value={block.subtitle || ""}
                        onChange={(event) => updateBlock(index, { subtitle: event.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="หัวข้อหลัก"
                        value={block.title || ""}
                        onChange={(event) => updateBlock(index, { title: event.target.value })}
                        fullWidth
                      />
                    </Stack>

                    <TextField
                      label="คำอธิบาย"
                      value={block.description || ""}
                      onChange={(event) => updateBlock(index, { description: event.target.value })}
                      fullWidth
                      multiline
                      minRows={3}
                    />

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        label="ข้อความปุ่ม"
                        value={block.buttonLabel || ""}
                        onChange={(event) => updateBlock(index, { buttonLabel: event.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="ลิงก์ปุ่ม"
                        value={block.href || ""}
                        onChange={(event) => updateBlock(index, { href: event.target.value })}
                        fullWidth
                      />
                    </Stack>

                    <Box
                      className="rounded-[24px] p-4"
                      sx={{
                        backgroundColor:
                          block.tone === "highlight"
                            ? theme.surfaceColor || "#f8fafc"
                            : block.tone === "dark"
                              ? theme.accentColor || "#0f172a"
                              : block.tone === "success"
                                ? "#ecfdf5"
                                : "#ffffff",
                        color: block.tone === "dark" ? "#ffffff" : theme.accentColor || "#0f172a",
                        border:
                          block.tone === "default"
                            ? "1px solid rgba(15, 23, 42, 0.08)"
                            : "1px solid transparent",
                        textAlign: block.align === "center" ? "center" : "left",
                      }}
                    >
                      <Typography className="text-sm font-bold">
                        ตัวอย่างบล็อก: {toneLabel(block.tone)}
                      </Typography>
                      <Typography className="mt-2 text-xl font-black">
                        {block.title || "หัวข้อหลักของบล็อก"}
                      </Typography>
                      <Typography className="mt-2 text-sm opacity-80">
                        {block.description || "ใช้ส่วนนี้สำหรับสรุปแคมเปญหรือเนื้อหาหลักที่จะโชว์ในหน้าเว็บรวม"}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      onClick={() =>
                        setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index))
                      }
                    >
                      ลบบล็อก
                    </Button>
                    {index < blocks.length - 1 ? <Divider /> : null}
                  </Box>
                ))
              )}

              <Button
                variant="outlined"
                onClick={() => setBlocks((current) => [...current, { ...emptyBlock }])}
              >
                เพิ่มบล็อก
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={2400}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={message.includes("ไม่สำเร็จ") ? "error" : "success"}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}
