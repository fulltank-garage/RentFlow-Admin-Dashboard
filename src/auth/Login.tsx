"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { authService } from "@/src/services/auth/auth.service";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canSubmit = username.trim().length >= 3 && password.length >= 6 && !loading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง");
      return;
    }

    try {
      setLoading(true);
      document.cookie = "rf_admin_token=; path=/; max-age=0";
      await authService.login({
        username: username.trim(),
        password,
      });
      await authService.getMe();

      const params = new URLSearchParams(window.location.search);
      router.replace(params.get("next") || "/admin/dashboard");
    } catch (err: unknown) {
      await authService.logout().catch(() => null);
      setError(
        err instanceof Error
          ? err.message
          : "เข้าสู่ระบบผู้ดูแลไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff_45%,#ecfeff)] px-4 py-10">
      <Box className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Box>
          <Box className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <Box className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white">
              <AdminPanelSettingsRoundedIcon />
            </Box>
            <Box>
              <Typography className="text-sm font-black text-slate-950">
                RentFlow Platform Admin
              </Typography>
              <Typography className="text-xs text-slate-500">
                admin.rentflow.com
              </Typography>
            </Box>
          </Box>

          <Typography className="mt-8 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            ศูนย์ควบคุมระบบหลายร้านสำหรับ RentFlow
          </Typography>
          <Typography className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            ดูแลเจ้าของร้านทั้งหมดจากหลังบ้านรวม ตรวจสอบร้านใหม่ จัดการ subdomain
            และควบคุมเส้นทางของเว็บเช่ารถแต่ละร้านในที่เดียว
          </Typography>

          <Box className="mt-8 grid gap-3 sm:grid-cols-3">
            {["partner.rentflow.com", "admin.rentflow.com", "*.rentflow.com"].map(
              (host) => (
                <Box
                  key={host}
                  className="rounded-2xl border border-slate-200 bg-white/75 p-4 backdrop-blur"
                >
                  <Typography className="text-xs text-slate-500">Host</Typography>
                  <Typography className="mt-1 text-sm font-bold text-slate-900">
                    {host}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Box>

        <Card
          elevation={0}
          className="rounded-[28px]! border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur"
        >
          <CardContent className="p-6! md:p-8!">
            <Stack spacing={1} className="text-center">
              <Typography className="text-2xl font-black text-slate-950">
                เข้าสู่ระบบผู้ดูแล
              </Typography>
              <Typography className="text-sm text-slate-500">
                ใช้บัญชี platform admin เพื่อจัดการระบบรวม
              </Typography>
            </Stack>

            <Divider className="my-6! border-slate-200!" />

            {error ? (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                className="mb-4 rounded-2xl!"
              >
                {error}
              </Alert>
            ) : null}

            <Box component="form" onSubmit={handleSubmit} className="grid gap-4">
              <TextField
                label="ชื่อผู้ใช้หรืออีเมลผู้ดูแล"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="รหัสผ่าน"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                className="rounded-2xl! py-3! font-bold!"
                sx={{ bgcolor: "rgb(15 23 42)" }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} color="inherit" />
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </Stack>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
