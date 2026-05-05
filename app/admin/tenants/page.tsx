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
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { domainsService } from "@/src/services/domains/domains.service";
import type { PlatformDomain } from "@/src/services/domains/domains.types";
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

function domainStatusColor(status?: string) {
  if (status === "verified") return "success";
  if (status === "pending_dns" || status === "pending") return "warning";
  return "error";
}

function domainStatusLabel(status?: string) {
  const map: Record<string, string> = {
    verified: "พร้อมใช้งาน",
    pending_dns: "รอตั้งค่า DNS",
    pending: "รอตรวจสอบ",
    conflict: "มีปัญหา",
  };
  return status ? map[status] || status : "ยังไม่มีข้อมูล";
}

function bookingModeLabel(mode?: PlatformTenant["bookingMode"]) {
  return mode === "chat" ? "จองผ่านแชทก่อน" : "จองและชำระในระบบ";
}

function formatCheckedAt(value?: string) {
  if (!value) return "ยังไม่ได้ตรวจ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState<PlatformTenant[]>([]);
  const [domains, setDomains] = React.useState<PlatformDomain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});
  const [chatThresholds, setChatThresholds] = React.useState<Record<string, string>>({});

  const loadTenants = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const [tenantsResponse, domainsResponse] = await Promise.all([
        tenantsService.listTenants(),
        domainsService.listDomains(),
      ]);
      setTenants(tenantsResponse.items);
      setDomains(domainsResponse.items);
      setChatThresholds(
        Object.fromEntries(
          tenantsResponse.items.map((tenant) => [
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

  const tenantSummary = React.useMemo(
    () => ({
      total: tenants.length,
      active: tenants.filter((tenant) => tenant.status === "active").length,
      pending: tenants.filter((tenant) => tenant.status === "pending").length,
      suspended: tenants.filter((tenant) =>
        ["suspended", "rejected"].includes(tenant.status)
      ).length,
    }),
    [tenants]
  );

  const domainsByTenant = React.useMemo(() => {
    const grouped = new Map<string, PlatformDomain[]>();
    domains.forEach((domain) => {
      const current = grouped.get(domain.tenantId) || [];
      current.push(domain);
      grouped.set(domain.tenantId, current);
    });
    return grouped;
  }, [domains]);

  return (
    <Box className="admin-page">
      <Box className="admin-page-header">
        <Typography className="admin-page-title">ร้านและโดเมนของร้าน</Typography>
        <Typography className="admin-page-subtitle">
          ดูแลร้านเช่ารถทั้งหมด สถานะร้าน โหมดการจอง และโดเมนหน้าร้านในที่เดียว
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box className="admin-surface grid min-h-72 place-items-center rounded-[32px]">
          <CircularProgress />
        </Box>
      ) : tenants.length === 0 ? (
        <Box className="admin-empty">
          <Typography className="text-sm text-slate-500">
            ยังไม่มีร้านในระบบ
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["ร้านทั้งหมด", tenantSummary.total, "จำนวนร้านทั้งหมดในระบบ"],
              ["เปิดใช้งาน", tenantSummary.active, "ร้านที่ลูกค้าเข้าชมได้"],
              ["รอตรวจสอบ", tenantSummary.pending, "ร้านที่ยังต้องตรวจข้อมูล"],
              ["ถูกระงับ", tenantSummary.suspended, "ร้านที่ยังไม่เปิดให้บริการ"],
            ].map(([label, value, detail]) => (
              <Card key={label} elevation={0} className="admin-card rounded-[28px]!">
                <CardContent className="p-5!">
                  <Typography className="text-sm font-semibold text-slate-500">
                    {label}
                  </Typography>
                  <Typography className="admin-stat-value mt-3 text-slate-950">
                    {value}
                  </Typography>
                  <Typography className="mt-2 text-sm leading-6 text-slate-500">
                    {detail}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box className="grid gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} elevation={0} className="admin-card rounded-[32px]!">
                <CardContent className="grid gap-5 p-5! md:p-6!">
                  <Box className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                    <Box className="min-w-0">
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                        alignItems="center"
                      >
                        <Typography className="text-xl font-black tracking-[-0.04em] text-slate-950 md:text-2xl">
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

                      <Typography className="mt-2 break-all text-sm leading-6 text-slate-500">
                        {tenant.publicDomain}
                      </Typography>
                      <Typography className="mt-1 text-sm leading-6 text-slate-500">
                        เจ้าของร้าน: {tenant.ownerEmail || "ไม่ระบุ"}
                      </Typography>
                    </Box>

                    <Button
                      href={`https://${tenant.publicDomain}`}
                      target="_blank"
                      variant="outlined"
                      className="rounded-full!"
                    >
                      เปิดหน้าร้าน
                    </Button>
                  </Box>

                  <Box className="admin-surface-soft grid gap-3 rounded-[26px] p-4 md:grid-cols-3">
                    <Box>
                      <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        แผนบริการ
                      </Typography>
                      <Typography className="mt-1 text-sm font-semibold text-slate-950">
                        {tenant.plan || "ไม่ระบุ"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Subdomain
                      </Typography>
                      <Typography className="mt-1 break-all text-sm font-semibold text-slate-950">
                        {tenant.publicDomain || `${tenant.domainSlug}.rentflow.com`}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        เกณฑ์แนะนำแชท
                      </Typography>
                      <Typography className="mt-1 text-sm font-semibold text-slate-950">
                        {(tenant.chatThresholdTHB ?? 0).toLocaleString("th-TH")} บาท
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="admin-surface grid gap-3 rounded-[28px] p-4">
                    <Box>
                      <Typography className="admin-section-title text-[1.05rem]!">
                        โดเมนหน้าร้าน
                      </Typography>
                      <Typography className="admin-section-subtitle mt-1">
                        ตรวจสอบ Subdomain และ custom domain ที่ลูกค้าใช้เข้าหน้าร้านนี้
                      </Typography>
                    </Box>

                    {(domainsByTenant.get(tenant.id) || []).length === 0 ? (
                      <Box className="admin-surface-soft rounded-[22px] px-4 py-3">
                        <Typography className="text-sm font-semibold text-slate-950">
                          {tenant.publicDomain || `${tenant.domainSlug}.rentflow.com`}
                        </Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          ยังไม่มีข้อมูลตรวจโดเมนล่าสุด
                        </Typography>
                      </Box>
                    ) : (
                      <Box className="grid gap-3 md:grid-cols-2">
                        {(domainsByTenant.get(tenant.id) || []).map((domain) => (
                          <Box
                            key={domain.id}
                            className="admin-surface-soft grid gap-3 rounded-[22px] px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                          >
                            <Box className="min-w-0">
                              <Typography className="break-all text-sm font-semibold text-slate-950">
                                {domain.domain}
                              </Typography>
                              <Typography className="mt-1 break-all text-xs leading-5 text-slate-500">
                                ปลายทาง: {domain.target || "-"}
                              </Typography>
                              <Typography className="mt-1 text-xs leading-5 text-slate-500">
                                ตรวจล่าสุด {formatCheckedAt(domain.lastCheckedAt)}
                              </Typography>
                            </Box>
                            <Chip
                              color={domainStatusColor(domain.status)}
                              label={domainStatusLabel(domain.status)}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box className="admin-surface grid gap-4 rounded-[28px] p-4">
                    <Box>
                      <Typography className="admin-section-title text-[1.05rem]!">
                        ตั้งค่าร้าน
                      </Typography>
                      <Typography className="admin-section-subtitle mt-1">
                        เปลี่ยนสถานะร้าน รูปแบบการจอง และเหตุผลที่ใช้สื่อสารภายในทีม
                      </Typography>
                    </Box>

                    <Box className="grid gap-3 md:grid-cols-2 xl:grid-cols-[0.85fr_1fr_1fr_0.85fr]">
                      <TextField
                        select
                        label="สถานะ"
                        value={tenant.status}
                        onChange={(event) =>
                          updateStatus(
                            tenant,
                            event.target.value as PlatformTenant["status"]
                          )
                        }
                        fullWidth
                      >
                        <MenuItem value="active">ใช้งานอยู่</MenuItem>
                        <MenuItem value="pending">รอตรวจสอบ</MenuItem>
                        <MenuItem value="suspended">ระงับชั่วคราว</MenuItem>
                        <MenuItem value="rejected">ไม่อนุมัติ</MenuItem>
                      </TextField>

                      <TextField
                        select
                        label="โหมดการจอง"
                        value={tenant.bookingMode || "payment"}
                        onChange={(event) =>
                          updateBookingMode(
                            tenant,
                            event.target.value as NonNullable<PlatformTenant["bookingMode"]>
                          )
                        }
                        fullWidth
                      >
                        <MenuItem value="payment">จองและชำระในระบบ</MenuItem>
                        <MenuItem value="chat">จองผ่านแชทก่อน</MenuItem>
                      </TextField>

                      <TextField
                        label="เหตุผล"
                        value={reasons[tenant.id] ?? tenant.lifecycleReason ?? ""}
                        onChange={(event) =>
                          setReasons((current) => ({
                            ...current,
                            [tenant.id]: event.target.value,
                          }))
                        }
                        fullWidth
                      />

                      <TextField
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
                        inputProps={{ min: 0, step: 500 }}
                        helperText="0 = ปิดการแนะนำ"
                        fullWidth
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

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
