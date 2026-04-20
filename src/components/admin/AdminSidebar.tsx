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
    <Box className="flex h-full flex-col bg-white">
      <Box className="p-4">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
            <AdminPanelSettingsRoundedIcon />
          </Box>
          <Box>
            <Typography className="text-sm font-black tracking-tight text-slate-950">
              RentFlow Admin
            </Typography>
            <Typography className="text-xs text-slate-500">
              Platform control center
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider className="border-slate-200!" />

      <Box className="flex-1 overflow-auto px-2 py-3">
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
                  borderColor: active ? "rgb(203 213 225)" : "transparent",
                  bgcolor: active ? "rgb(248 250 252)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgb(248 250 252)",
                    borderColor: "rgb(226 232 240)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44, color: "rgb(15 23 42)" }}>
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

      <Box className="m-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Routing model
        </Typography>
        <Typography className="mt-2 text-sm font-semibold text-slate-900">
          admin / partner / shop
        </Typography>
        <Typography className="mt-1 text-xs leading-5 text-slate-500">
          หน้านี้ใช้สำหรับดูแลระบบรวม ส่วนร้านค้าใช้ subdomain แยกตาม tenant
        </Typography>
      </Box>
    </Box>
  );

  const paperSx = {
    width: drawerWidth,
    borderRight: "1px solid rgb(226 232 240)",
    bgcolor: "#fff",
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
