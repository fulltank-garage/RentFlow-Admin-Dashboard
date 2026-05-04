"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { tenantsService } from "@/src/services/tenants/tenants.service";
import type { PlatformTenant } from "@/src/services/tenants/tenants.types";

function tenantStatusLabel(status: PlatformTenant["status"]) {
  const map: Record<PlatformTenant["status"], string> = {
    active: "ใช้งานอยู่",
    pending: "รอตรวจสอบ",
    suspended: "ระงับชั่วคราว",
    rejected: "ไม่อนุมัติ",
  };
  return map[status] || status;
}

function statusColor(status: PlatformTenant["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  return "error";
}

function bookingModeLabel(mode?: PlatformTenant["bookingMode"]) {
  return mode === "chat" ? "จองผ่านแชทก่อน" : "จองและชำระในระบบ";
}

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState<PlatformTenant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});
  const [chatThresholds, setChatThresholds] = React.useState<Record<string, string>>({});

  const loadTenants = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const response = await tenantsService.listTenants();
      setTenants(response.items);
      setChatThresholds(
        Object.fromEntries(
          response.items.map((tenant) => [
            tenant.id,
            String(Math.max(tenant.chatThresholdTHB ?? 0, 0)),
          ])
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลร้านไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTenants();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadTenants]);

  useAdminRealtimeRefresh({
    events: [
      "tenant.updated",
      "booking.created",
      "booking.updated",
      "booking.cancelled",
      "car.status.changed",
      "payment.created",
      "payment.updated",
    ],
    onRefresh: loadTenants,
  });

  function patchTenant(
    tenantId: string,
    patch: Partial<PlatformTenant>
  ) {
    setTenants((current) =>
      current.map((item) =>
        item.id === tenantId ? { ...item, ...patch } : item
      )
    );
  }

  async function updateStatus(
    tenant: PlatformTenant,
    status: PlatformTenant["status"]
  ) {
    const chatThresholdTHB = Math.max(
      Number(chatThresholds[tenant.id] || tenant.chatThresholdTHB || 0) || 0,
      0
    );

    try {
      const response = await tenantsService.updateTenantSettings(tenant.id, {
        status,
        bookingMode: tenant.bookingMode || "payment",
        chatThresholdTHB,
        plan: tenant.plan,
        reason: reasons[tenant.id] || tenant.lifecycleReason || "",
      });
      patchTenant(tenant.id, {
        status,
        bookingMode: tenant.bookingMode || "payment",
        chatThresholdTHB,
        lifecycleReason: reasons[tenant.id] || tenant.lifecycleReason,
        ...response?.tenant,
      });
      setSnackOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "อัปเดตร้านไม่สำเร็จ");
    }
  }

  async function updateBookingMode(
    tenant: PlatformTenant,
    bookingMode: NonNullable<PlatformTenant["bookingMode"]>
  ) {
    const chatThresholdTHB = Math.max(
      Number(chatThresholds[tenant.id] || tenant.chatThresholdTHB || 0) || 0,
      0
    );

    try {
      const response = await tenantsService.updateTenantSettings(tenant.id, {
        status: tenant.status,
        bookingMode,
        chatThresholdTHB,
        plan: tenant.plan,
        reason: reasons[tenant.id] || tenant.lifecycleReason || "",
      });
      patchTenant(tenant.id, {
        status: tenant.status,
        bookingMode,
        chatThresholdTHB,
        ...response?.tenant,
      });
      setSnackOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "อัปเดตร้านไม่สำเร็จ");
    }
  }

  async function updateChatThreshold(tenant: PlatformTenant) {
    const chatThresholdTHB = Math.max(
      Number(chatThresholds[tenant.id] || tenant.chatThresholdTHB || 0) || 0,
      0
    );

    try {
      const response = await tenantsService.updateTenantSettings(tenant.id, {
        status: tenant.status,
        bookingMode: tenant.bookingMode || "payment",
        chatThresholdTHB,
        plan: tenant.plan,
        reason: reasons[tenant.id] || tenant.lifecycleReason || "",
      });
      patchTenant(tenant.id, {
        chatThresholdTHB,
        ...response?.tenant,
      });
      setChatThresholds((current) => ({
        ...current,
        [tenant.id]: String(chatThresholdTHB),
      }));
      setSnackOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "อัปเดตร้านไม่สำเร็จ");
    }
  }

  return (
    <Box className="admin-page">
      <Box className="admin-page-header">
        <Typography className="admin-page-title">ร้านเช่ารถทั้งหมด</Typography>
        <Typography className="admin-page-subtitle">
          จัดการ tenant กลางจาก API จริง ระงับหรือเปิดร้านได้ทันที
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card
        elevation={0}
        className="rounded-3xl! border border-slate-200 bg-white"
      >
        <CardContent className="p-0!">
          {loading ? (
            <Box className="grid min-h-72 place-items-center">
              <CircularProgress />
            </Box>
          ) : tenants.length === 0 ? (
            <Box className="grid min-h-72 place-items-center text-center">
              <Typography className="text-sm text-slate-500">
                ยังไม่มีร้านในระบบ
              </Typography>
            </Box>
          ) : (
            tenants.map((tenant, index) => (
              <Box key={tenant.id}>
                <Box className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.8fr_auto] lg:items-center">
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="text-lg font-black text-slate-950">
                        {tenant.shopName}
                      </Typography>
                      <Chip
                        size="small"
                        color={statusColor(tenant.status)}
                        label={tenantStatusLabel(tenant.status)}
                      />
                      <Chip
                        size="small"
                        label={bookingModeLabel(tenant.bookingMode)}
                        className="admin-chip admin-chip-blue"
                      />
                    </Stack>
                    <Typography className="mt-1 text-sm text-slate-500">
                      {tenant.ownerEmail} • {tenant.publicDomain}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      แผน / โหมดจอง
                    </Typography>
                    <Typography className="mt-1 text-sm font-semibold text-slate-900">
                      {tenant.plan} • {bookingModeLabel(tenant.bookingMode)}
                    </Typography>
                    <Typography className="mt-1 text-xs text-slate-500">
                      slug: {tenant.domainSlug}
                    </Typography>
                    <Typography className="mt-1 text-xs text-slate-500">
                      เกณฑ์แนะนำแชท: {(tenant.chatThresholdTHB ?? 0).toLocaleString("th-TH")} บาท
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                      select
                      size="small"
                      label="สถานะ"
                      value={tenant.status}
                      onChange={(event) =>
                        updateStatus(
                          tenant,
                          event.target.value as PlatformTenant["status"]
                        )
                      }
                      className="w-full sm:w-44"
                    >
                      <MenuItem value="active">ใช้งานอยู่</MenuItem>
                      <MenuItem value="pending">รอตรวจสอบ</MenuItem>
                      <MenuItem value="suspended">ระงับชั่วคราว</MenuItem>
                      <MenuItem value="rejected">ไม่อนุมัติ</MenuItem>
                    </TextField>
                    <TextField
                      size="small"
                      label="เหตุผล"
                      value={reasons[tenant.id] ?? tenant.lifecycleReason ?? ""}
                      onChange={(event) =>
                        setReasons((current) => ({
                          ...current,
                          [tenant.id]: event.target.value,
                        }))
                      }
                      className="w-full sm:w-48"
                    />
                    <TextField
                      select
                      size="small"
                      label="โหมดการจอง"
                      value={tenant.bookingMode || "payment"}
                      onChange={(event) =>
                        updateBookingMode(
                          tenant,
                          event.target.value as NonNullable<PlatformTenant["bookingMode"]>
                        )
                      }
                      className="w-full sm:w-56"
                    >
                      <MenuItem value="payment">จองและชำระในระบบ</MenuItem>
                      <MenuItem value="chat">จองผ่านแชทก่อน</MenuItem>
                    </TextField>
                    <TextField
                      size="small"
                      type="number"
                      label="ยอดแนะนำแชท"
                      value={chatThresholds[tenant.id] ?? String(tenant.chatThresholdTHB ?? 0)}
                      onChange={(event) =>
                        setChatThresholds((current) => ({
                          ...current,
                          [tenant.id]: event.target.value,
                        }))
                      }
                      onBlur={() => updateChatThreshold(tenant)}
                      className="w-full sm:w-44"
                      inputProps={{ min: 0, step: 500 }}
                      helperText="0 = ปิดการแนะนำ"
                    />
                    <Button
                      href={`https://${tenant.publicDomain}`}
                      target="_blank"
                      variant="outlined"
                    >
                      เปิดหน้าร้าน
                    </Button>
                  </Stack>
                </Box>
                {index < tenants.length - 1 ? (
                  <Divider className="border-slate-200!" />
                ) : null}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          อัปเดตสถานะร้านสำเร็จ
        </Alert>
      </Snackbar>
    </Box>
  );
}
