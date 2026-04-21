"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LanRoundedIcon from "@mui/icons-material/LanRounded";

import { authService } from "@/src/services/auth/auth.service";

type Props = {
  onOpenMobile: () => void;
  drawerWidth?: number;
};

export default function AdminTopbar({
  onOpenMobile,
  drawerWidth = 292,
}: Props) {
  const router = useRouter();

  async function logout() {
    await authService.logout().catch(() => null);
    document.cookie = "rentflow_session=; path=/; max-age=0";
    document.cookie = "rf_admin_token=; path=/; max-age=0";
    router.replace("/login");
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.68)",
        color: "rgb(15 23 42)",
        backdropFilter: "blur(26px) saturate(1.35)",
        WebkitBackdropFilter: "blur(26px) saturate(1.35)",
        borderBottom: "1px solid rgba(148,163,184,0.22)",
        boxShadow: "0 16px 50px rgba(15,23,42,0.06)",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar className="gap-3" sx={{ minHeight: 68 }}>
        <IconButton
          onClick={onOpenMobile}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            bgcolor: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(148,163,184,0.22)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <Chip
            icon={<LanRoundedIcon />}
            label="admin.rentflow.com"
            className="ios-chip hidden sm:inline-flex"
            sx={{
              height: 36,
              px: 0.5,
              fontWeight: 700,
            }}
          />
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box className="hidden text-right sm:block">
            <Typography className="text-sm font-bold text-slate-900">
              Platform Admin
            </Typography>
            <Typography className="text-xs text-slate-500">
              fulltank-garage
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: "transparent",
              background:
                "linear-gradient(135deg, var(--rf-ios-blue), var(--rf-ios-indigo))",
              boxShadow: "0 10px 28px rgba(88,86,214,0.24)",
              border: "2px solid rgba(255,255,255,0.8)",
            }}
          >
            R
          </Avatar>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutRoundedIcon />}
            onClick={logout}
            sx={{
              borderColor: "rgba(148,163,184,0.28)",
              bgcolor: "rgba(255,255,255,0.58)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
              fontWeight: 800,
              px: 2,
              "&:hover": {
                borderColor: "rgba(100,116,139,0.36)",
                bgcolor: "rgba(255,255,255,0.86)",
              },
            }}
          >
            ออกจากระบบ
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
