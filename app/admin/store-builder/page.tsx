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
  TextField,
  Typography,
} from "@mui/material";
import { storefrontService } from "@/src/services/storefront/storefront.service";
import type { StorefrontBlock } from "@/src/services/storefront/storefront.types";

const emptyBlock: StorefrontBlock = {
  type: "announcement",
  title: "",
  description: "",
  buttonLabel: "",
  href: "",
};

export default function StoreBuilderPage() {
  const [blocks, setBlocks] = React.useState<StorefrontBlock[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    storefrontService
      .getMarketplaceHomePage()
      .then((page) => setBlocks(page.blocks || []))
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false));
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
      await storefrontService.saveMarketplaceHomePage(
        blocks.map((block, index) => ({
          ...block,
          id: block.id || `marketplace-block-${index + 1}`,
        }))
      );
      setMessage("บันทึกหน้าเว็บรวมเรียบร้อยแล้ว");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "บันทึกหน้าเว็บรวมไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start justify-between">
        <Box>
          <Typography className="text-3xl font-black tracking-tight text-slate-950">
            จัดหน้าเว็บรวม
          </Typography>
          <Typography className="mt-2 text-sm text-slate-500">
            ควบคุมบล็อกข้อความและโปรโมชันที่แสดงบน rentflow.com
          </Typography>
        </Box>
        <Button variant="contained" onClick={save} disabled={saving}>
          {saving ? "กำลังบันทึก" : "บันทึก"}
        </Button>
      </Stack>

      <Card elevation={0} className="rounded-3xl! bg-white">
        <CardContent className="grid gap-5">
          {loading ? (
            <Box className="grid min-h-72 place-items-center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {blocks.map((block, index) => (
                <Box key={block.id || index} className="grid gap-4">
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
                      label="หัวข้อ"
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
              ))}
              <Button variant="outlined" onClick={() => setBlocks((current) => [...current, { ...emptyBlock }])}>
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
    </Stack>
  );
}
