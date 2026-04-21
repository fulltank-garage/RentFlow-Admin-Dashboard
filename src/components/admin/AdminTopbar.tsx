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
        bgcolor: "rgba(255,255,255,0.88)",
        color: "rgb(15 23 42)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgb(226 232 240)",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar className="gap-3">
        <IconButton
          onClick={onOpenMobile}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <Chip
            icon={<LanRoundedIcon />}
            label="admin.rentflow.com"
            className="hidden sm:inline-flex"
            sx={{
              borderRadius: 3,
              bgcolor: "rgb(241 245 249)",
              border: "1px solid rgb(226 232 240)",
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
          <Avatar sx={{ bgcolor: "rgb(15 23 42)" }}>R</Avatar>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutRoundedIcon />}
            onClick={logout}
            className="rounded-xl!"
            sx={{ borderColor: "rgb(203 213 225)" }}
          >
            ออกจากระบบ
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
