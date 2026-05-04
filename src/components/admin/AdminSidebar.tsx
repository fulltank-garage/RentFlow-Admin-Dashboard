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
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { ADMIN_NAV, type AdminNavGroup } from "./adminNav";

type Props = {
  mobileOpen: boolean;
  onMobileClose: () => void;
  drawerWidth?: number;
};

const GROUP_LABEL: Record<AdminNavGroup, string> = {
  Operations: "งานปฏิบัติการ",
  Partners: "ร้านและเจ้าของ",
  Finance: "การเงิน",
  Security: "ความปลอดภัย",
  Settings: "ตั้งค่าและช่วยเหลือ",
};

const GROUPS: AdminNavGroup[] = [
  "Operations",
  "Partners",
  "Finance",
  "Security",
  "Settings",
];

export default function AdminSidebar({
  mobileOpen,
  onMobileClose,
  drawerWidth = 296,
}: Props) {
  const pathname = usePathname();

  const content = (
    <Box
      className="admin-shell h-full border-0"
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          flex: "0 0 auto",
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 3 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" className="min-w-0">
          <Box className="grid h-[42px] w-[42px] shrink-0 place-items-center overflow-hidden rounded-[18px] bg-[var(--rf-admin-blue-deep)] text-sm font-black tracking-[-0.05em] text-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
            RF
          </Box>
          <Box className="min-w-0">
            <Typography className="truncate text-[1.02rem] font-extrabold tracking-[-0.03em] text-slate-950">
              ศูนย์จัดการระบบ
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider className="border-white/60!" />

      <Box
        className="admin-scrollbar px-3 py-3"
        sx={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overscrollBehaviorY: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {GROUPS.map((group, index) => {
          const items = ADMIN_NAV.filter((x) => x.group === group);
          if (!items.length) return null;

          return (
            <Box
              key={group}
              sx={{
                mb: 1.25,
                ...(index !== 0 && { borderTop: 0 }),
              }}
            >
              <Typography
                className="px-2 pb-2 pt-3 text-[13px] tracking-[-0.035em] text-slate-600"
                sx={{ fontWeight: "900 !important" }}
              >
                {GROUP_LABEL[group]}
              </Typography>

              <List
                dense={false}
                disablePadding
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.75,
                }}
              >
                {items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname?.startsWith(`${item.href}/`);

                  return (
                    <ListItemButton
                      key={item.href}
                      component={Link}
                      href={item.href}
                      onClick={onMobileClose}
                      className="mx-1 rounded-[22px]"
                      sx={{
                        borderRadius: "22px",
                        minHeight: { xs: 52, md: 48 },
                        px: 2.25,
                        py: 1.35,
                        bgcolor: active ? "#eef1f5" : "transparent",
                        border: 0,
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#eef1f5",
                          border: 0,
                          boxShadow: "none",
                        },
                        transition:
                          "background-color 180ms ease, box-shadow 180ms ease",
                      }}
                      selected={active}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: { xs: 16.5, md: 15.2 },
                              fontWeight: "400 !important",
                              lineHeight: 1.3,
                              letterSpacing: "-0.02em",
                              color: "rgb(30 41 59)",
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const paperSx = {
    width: drawerWidth,
    height: "100dvh",
    borderRight: 0,
    bgcolor: "#ffffff",
    boxShadow: "none",
    overflow: "hidden",
    overscrollBehavior: "contain",
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
          "& .MuiDrawer-paper": {
            ...paperSx,
          },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            ...paperSx,
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
