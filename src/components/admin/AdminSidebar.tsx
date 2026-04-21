"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { ADMIN_NAV } from "./adminNav";

type Props = {
  mobileOpen: boolean;
  onMobileClose: () => void;
  drawerWidth?: number;
};

export default function AdminSidebar({
  mobileOpen,
  onMobileClose,
  drawerWidth = 292,
}: Props) {
  const pathname = usePathname();

  const content = (
    <Box className="ios-glass flex h-full flex-col border-0">
      <Box className="p-4">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box className="grid h-11 w-11 place-items-center rounded-[18px] bg-linear-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_14px_34px_rgba(59,130,246,0.28)]">
            <AdminPanelSettingsRoundedIcon />
          </Box>
          <Box>
            <Typography className="text-sm font-black tracking-tight text-slate-950">
              RentFlow Admin
            </Typography>
            <Typography className="text-xs text-slate-500">
              ศูนย์จัดการระบบ
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider className="border-white/60!" />

      <Box className="ios-scrollbar flex-1 overflow-auto px-2 py-3">
        <List disablePadding className="grid gap-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                onClick={onMobileClose}
                className="rounded-2xl!"
                sx={{
                  px: 2,
                  py: 1.35,
                  border: "1px solid",
                  borderColor: active
                    ? "rgba(255,255,255,0.78)"
                    : "transparent",
                  bgcolor: active
                    ? "rgba(255,255,255,0.82)"
                    : "transparent",
                  boxShadow: active
                    ? "0 12px 34px rgba(15,23,42,0.08)"
                    : "none",
                  backdropFilter: active ? "blur(18px)" : "none",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.68)",
                    borderColor: "rgba(255,255,255,0.78)",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.07)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: active ? "var(--rf-ios-blue)" : "rgb(15 23 42)",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography className="text-sm font-bold text-slate-900">
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography className="text-xs text-slate-500">
                      {item.caption}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box className="ios-panel m-3 rounded-[28px] p-4">
        <Typography className="text-xs font-bold tracking-[0.2em] text-slate-400">
          ภาพรวมระบบ
        </Typography>
        <Typography className="mt-2 text-sm font-semibold text-slate-900">
          admin / partner / shop
        </Typography>
        <Typography className="mt-1 text-xs leading-5 text-slate-500">
          จัดการร้านค้า หน้าสาธารณะ และการดูแลระบบกลางจากจุดเดียว
        </Typography>
      </Box>
    </Box>
  );

  const paperSx = {
    width: drawerWidth,
    borderRight: "1px solid rgba(148,163,184,0.22)",
    bgcolor: "rgba(255,255,255,0.58)",
    boxShadow: "18px 0 56px rgba(15,23,42,0.08)",
    backdropFilter: "blur(28px) saturate(1.35)",
    WebkitBackdropFilter: "blur(28px) saturate(1.35)",
  } as const;

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
