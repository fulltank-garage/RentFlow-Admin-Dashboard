"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { authService } from "@/src/services/auth/auth.service";
import { deleteClientCookie } from "@/src/lib/client-cookie";

type Props = {
  onOpenMobile: () => void;
  drawerWidth?: number;
};

function MobileMenuGlyph({ open }: { open: boolean }) {
  return (
    <Box className="relative block h-4 w-5" aria-hidden="true">
      <Box
        className="absolute left-0 top-[4px] h-[1.5px] w-5 rounded-full bg-[var(--rf-admin-ink)]/75"
        sx={{
          transform: open
            ? "translateY(3px) rotate(45deg)"
            : "translateY(0) rotate(0deg)",
          transition:
            "transform .42s cubic-bezier(0.22, 1, 0.36, 1), background-color .28s ease",
        }}
      />
      <Box
        className="absolute left-0 top-[10px] h-[1.5px] w-5 rounded-full bg-[var(--rf-admin-ink)]/75"
        sx={{
          transform: open
            ? "translateY(-3px) rotate(-45deg)"
            : "translateY(0) rotate(0deg)",
          transition:
            "transform .42s cubic-bezier(0.22, 1, 0.36, 1), background-color .28s ease",
        }}
      />
    </Box>
  );
}

export default function AdminTopbar({
  onOpenMobile,
  drawerWidth = 296,
}: Props) {
  const router = useRouter();
  const [openProfile, setOpenProfile] = React.useState(false);

  async function logout() {
    await authService.logout().catch(() => null);
    deleteClientCookie("rentflow_admin_session");
    deleteClientCookie("rentflow_session");
    deleteClientCookie("rf_admin_token");
    router.replace("/login");
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          color: "rgb(15 23 42)",
          borderBottom: 0,
          boxShadow: "none",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
          <Button
            onClick={onOpenMobile}
            aria-label="เปิดเมนู"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              minWidth: 0,
              bgcolor: "#ffffff",
              border: 0,
              "&:hover": { bgcolor: "#ffffff" },
            }}
          >
            <MobileMenuGlyph open={false} />
          </Button>

          <Box sx={{ ml: "auto" }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button
                onClick={() => setOpenProfile(true)}
                className="rounded-full! px-1.5! py-1!"
                sx={{
                  minWidth: 0,
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    alt="โปรไฟล์ผู้ดูแลระบบ"
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "var(--rf-admin-blue-deep)",
                      border: "2px solid rgba(255,255,255,0.82)",
                      boxShadow: "0 10px 28px rgba(15,23,42,0.14)",
                      fontWeight: 900,
                    }}
                  >
                    RF
                  </Avatar>

                  <Box className="hidden text-left md:block">
                    <Typography className="text-sm font-bold text-slate-950">
                      บัญชีผู้ดูแลระบบ
                    </Typography>
                    <Typography className="text-xs text-slate-500">
                      จัดการระบบกลาง
                    </Typography>
                  </Box>
                </Stack>
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        PaperProps={{
          sx: {
            width: { xs: "78vw", sm: 320 },
            bgcolor: "#ffffff",
            borderLeft: "1px solid rgba(148,163,184,0.16)",
            boxShadow: "none",
          },
        }}
      >
        <Box
          sx={{
            px: 2.25,
            py: 1,
            m: { xs: 0, md: 0.5 },
            position: "relative",
            height: 60,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-0.03em",
              color: "rgb(15 23 42)",
            }}
          >
            โปรไฟล์
          </Box>

          <Box sx={{ marginLeft: "auto" }}>
            <Button
              sx={{
                minWidth: 0,
                px: 2,
                bgcolor: "#ffffff",
                border: "1px solid rgba(148,163,184,0.16)",
                "&:hover": { bgcolor: "#ffffff" },
              }}
              onClick={() => setOpenProfile(false)}
            >
              ปิด
            </Button>
          </Box>
        </Box>

        <Divider className="border-white/60!" />

        <Box sx={{ px: 2, py: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              alt="โปรไฟล์ผู้ดูแลระบบ"
              sx={{
                width: 46,
                height: 46,
                bgcolor: "var(--rf-admin-blue-deep)",
                border: "2px solid rgba(255,255,255,0.82)",
                boxShadow: "0 10px 28px rgba(15,23,42,0.14)",
                fontWeight: 900,
              }}
            >
              RF
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "rgb(15 23 42)",
                }}
              >
                Platform Admin
              </Box>

              <Box
                sx={{
                  fontSize: 12,
                  color: "rgb(100 116 139)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 220,
                }}
              >
                บัญชีดูแลระบบกลาง
              </Box>

              <Stack
                direction="row"
                spacing={0.75}
                sx={{ mt: 1 }}
                useFlexGap
                flexWrap="wrap"
              >
                <Chip
                  size="small"
                  label="ผู้ดูแลระบบ"
                  className="admin-status-pill"
                  sx={{
                    height: 24,
                    fontSize: 12,
                  }}
                />
                <Chip
                  size="small"
                  label="ออนไลน์"
                  className="admin-status-pill"
                  sx={{
                    height: 24,
                    fontSize: 12,
                    bgcolor: "var(--rf-admin-chip) !important",
                    color: "rgb(6 95 70) !important",
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider className="border-white/60!" />

        <List disablePadding sx={{ px: 1.5, py: 1.5 }}>
          <ListItemButton
            onClick={() => {
              router.push("/admin/settings");
              setOpenProfile(false);
            }}
            sx={{
              borderRadius: 3,
              border: "1px solid transparent",
              minHeight: 52,
              px: 1.75,
              py: 1.5,
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "#ffffff",
                borderColor: "rgba(255,255,255,0.82)",
                boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
              },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontWeight: 700, color: "rgb(15 23 42)", lineHeight: 1.2 }}>
                ตั้งค่าระบบ
              </Box>
              <Box sx={{ fontSize: 12, color: "rgb(100 116 139)", mt: 0.25 }}>
                จัดการเนื้อหาและค่าการแสดงผล
              </Box>
            </Box>
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              router.push("/admin/security");
              setOpenProfile(false);
            }}
            sx={{
              borderRadius: 3,
              border: "1px solid transparent",
              minHeight: 52,
              px: 1.75,
              py: 1.5,
              mt: 1,
              "&:hover": {
                bgcolor: "#ffffff",
                borderColor: "rgba(255,255,255,0.82)",
                boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ fontWeight: 700, color: "rgb(15 23 42)" }}>
                ความปลอดภัย
              </Box>
              <Box sx={{ fontSize: 12, color: "rgb(100 116 139)" }}>
                ตรวจสอบสิทธิ์และนโยบายการใช้งาน
              </Box>
            </Box>
          </ListItemButton>
        </List>

        <Box sx={{ flex: 1 }} />

        <Divider className="border-white/60!" />

        <Box sx={{ p: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              p: 1.5,
              borderRadius: 999,
              bgcolor: "rgb(244 63 94)",
              boxShadow: "0 14px 34px rgba(244,63,94,0.18)",
              "&:hover": {
                bgcolor: "rgb(225 29 72)",
              },
            }}
            onClick={() => {
              logout();
              setOpenProfile(false);
            }}
          >
            ออกจากระบบ
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
