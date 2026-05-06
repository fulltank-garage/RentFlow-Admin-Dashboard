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
  Drawer,
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
  return mode === "payment" ? "จองและชำระในระบบ" : "จองผ่านแชทก่อน";
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

function tenantLogoUrl(tenant: PlatformTenant) {
  return tenant.logoUrl || "";
}

function tenantPrimaryDomain(tenant: PlatformTenant) {
  return tenant.publicDomain || `${tenant.domainSlug}.rentflow.com`;
}

function TenantLogo({ tenant, size = "large" }: { tenant: PlatformTenant; size?: "large" | "small" }) {
  const logoUrl = tenantLogoUrl(tenant);
  const sizeClass = size === "large" ? "h-24 w-24 rounded-[30px]" : "h-14 w-14 rounded-2xl";

  return (
    <Box
      className={`${sizeClass} grid shrink-0 place-items-center overflow-hidden bg-slate-950 text-white shadow-[0_16px_38px_rgba(15,23,42,0.16)]`}
    >
      {logoUrl ? (
        <Box
          component="img"
          src={logoUrl}
          alt={`โลโก้ ${tenant.shopName}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <Typography className={size === "large" ? "text-3xl font-black" : "text-lg font-black"}>
          {tenant.shopName.trim().charAt(0) || "ร"}
        </Typography>
      )}
    </Box>
  );
}

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState<PlatformTenant[]>([]);
  const [domains, setDomains] = React.useState<PlatformDomain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});
  const [chatThresholds, setChatThresholds] = React.useState<Record<string, string>>({});
  const [selectedTenantId, setSelectedTenantId] = React.useState<string | null>(null);

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
        bookingMode: tenant.bookingMode || "chat",
        chatThresholdTHB,
        plan: tenant.plan,
        reason: reasons[tenant.id] || tenant.lifecycleReason || "",
      });
      patchTenant(tenant.id, {
        status,
        bookingMode: tenant.bookingMode || "chat",
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
        bookingMode: tenant.bookingMode || "chat",
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

  const selectedTenant = React.useMemo(
    () => tenants.find((tenant) => tenant.id === selectedTenantId) || null,
    [selectedTenantId, tenants]
  );

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

          <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tenants.map((tenant) => {
              const tenantDomains = domainsByTenant.get(tenant.id) || [];
              const primaryDomain = tenantPrimaryDomain(tenant);

              return (
                <Card
                  key={tenant.id}
                  elevation={0}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTenantId(tenant.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTenantId(tenant.id);
                    }
                  }}
                  className="admin-card cursor-pointer rounded-[32px]! transition-transform duration-300 hover:scale-[1.01]"
                >
                  <CardContent className="grid h-full gap-5 p-5!">
                    <Box className="flex items-start gap-4">
                      <TenantLogo tenant={tenant} />
                      <Box className="min-w-0 flex-1">
                        <Typography className="line-clamp-2 text-xl font-black tracking-[-0.04em] text-slate-950">
                          {tenant.shopName}
                        </Typography>
                        <Typography className="mt-1 break-all text-sm leading-6 text-slate-500">
                          {primaryDomain}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      <Chip
                        color={statusColor(tenant.status)}
                        label={tenantStatusLabel(tenant.status)}
                      />
                      <Chip
                        label={bookingModeLabel(tenant.bookingMode)}
                        className="admin-chip admin-chip-blue"
                      />
                    </Stack>

                    <Box className="admin-surface-soft grid gap-3 rounded-[26px] p-4">
                      <Box className="grid grid-cols-2 gap-3">
                        <Box>
                          <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            โดเมน
                          </Typography>
                          <Typography className="mt-1 text-sm font-semibold text-slate-950">
                            {tenantDomains.length || 1} รายการ
                          </Typography>
                        </Box>
                        <Box>
                          <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            แผนบริการ
                          </Typography>
                          <Typography className="mt-1 text-sm font-semibold text-slate-950">
                            {tenant.plan || "ไม่ระบุ"}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography className="text-sm leading-6 text-slate-500">
                        เจ้าของร้าน: {tenant.ownerEmail || "ไม่ระบุ"}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      className="rounded-full!"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTenantId(tenant.id);
                      }}
                    >
                      ดูข้อมูลร้าน
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      )}

      <Drawer
        anchor="right"
        open={!!selectedTenant}
        onClose={() => setSelectedTenantId(null)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 520, lg: 620 },
            borderTopLeftRadius: { xs: 0, sm: 34 },
            borderBottomLeftRadius: { xs: 0, sm: 34 },
            overflow: "hidden",
          },
        }}
      >
        {selectedTenant ? (
          <Box className="flex h-full flex-col bg-white">
            <Box className="flex items-start justify-between gap-4 p-5 md:p-6">
              <Stack direction="row" spacing={2} className="min-w-0 items-center">
                <TenantLogo tenant={selectedTenant} size="small" />
                <Box className="min-w-0">
                  <Typography className="truncate text-2xl font-black tracking-[-0.05em] text-slate-950">
                    {selectedTenant.shopName}
                  </Typography>
                  <Typography className="mt-1 break-all text-sm leading-6 text-slate-500">
                    {tenantPrimaryDomain(selectedTenant)}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                className="min-w-0! rounded-full!"
                onClick={() => setSelectedTenantId(null)}
              >
                ปิด
              </Button>
            </Box>

            <Divider />

            <Box className="flex-1 overflow-y-auto p-5 md:p-6">
              <Stack spacing={4}>
                <Box className="grid gap-3 sm:grid-cols-2">
                  <Box className="admin-surface-soft rounded-[24px] p-4">
                    <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      สถานะร้าน
                    </Typography>
                    <Chip
                      className="mt-3"
                      color={statusColor(selectedTenant.status)}
                      label={tenantStatusLabel(selectedTenant.status)}
                    />
                  </Box>
                  <Box className="admin-surface-soft rounded-[24px] p-4">
                    <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      โหมดการจอง
                    </Typography>
                    <Chip
                      className="admin-chip admin-chip-blue mt-3"
                      label={bookingModeLabel(selectedTenant.bookingMode)}
                    />
                  </Box>
                  <Box className="admin-surface-soft rounded-[24px] p-4">
                    <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      แผนบริการ
                    </Typography>
                    <Typography className="mt-2 text-sm font-semibold text-slate-950">
                      {selectedTenant.plan || "ไม่ระบุ"}
                    </Typography>
                  </Box>
                  <Box className="admin-surface-soft rounded-[24px] p-4">
                    <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      เกณฑ์แนะนำแชท
                    </Typography>
                    <Typography className="mt-2 text-sm font-semibold text-slate-950">
                      {(selectedTenant.chatThresholdTHB ?? 0).toLocaleString("th-TH")} บาท
                    </Typography>
                  </Box>
                </Box>

                <Box className="admin-surface grid gap-3 rounded-[28px] p-4">
                  <Box>
                    <Typography className="admin-section-title text-[1.05rem]!">
                      ข้อมูลร้าน
                    </Typography>
                    <Typography className="admin-section-subtitle mt-1">
                      ข้อมูลหลักของร้านและเจ้าของร้าน
                    </Typography>
                  </Box>
                  {[
                    ["ชื่อร้าน", selectedTenant.shopName],
                    ["เจ้าของร้าน", selectedTenant.ownerEmail || "ไม่ระบุ"],
                    ["Subdomain", tenantPrimaryDomain(selectedTenant)],
                    ["รหัสร้าน", selectedTenant.id],
                  ].map(([label, value]) => (
                    <Box key={label} className="admin-surface-soft rounded-[22px] px-4 py-3">
                      <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </Typography>
                      <Typography className="mt-1 break-all text-sm font-semibold text-slate-950">
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box className="admin-surface grid gap-3 rounded-[28px] p-4">
                  <Box>
                    <Typography className="admin-section-title text-[1.05rem]!">
                      โดเมนหน้าร้าน
                    </Typography>
                    <Typography className="admin-section-subtitle mt-1">
                      Subdomain และ custom domain ของร้านนี้
                    </Typography>
                  </Box>

                  {(domainsByTenant.get(selectedTenant.id) || []).length === 0 ? (
                    <Box className="admin-surface-soft rounded-[22px] px-4 py-3">
                      <Typography className="text-sm font-semibold text-slate-950">
                        {tenantPrimaryDomain(selectedTenant)}
                      </Typography>
                      <Typography className="mt-1 text-sm text-slate-500">
                        ยังไม่มีข้อมูลตรวจโดเมนล่าสุด
                      </Typography>
                    </Box>
                  ) : (
                    <Box className="grid gap-3">
                      {(domainsByTenant.get(selectedTenant.id) || []).map((domain) => (
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
                      เปลี่ยนสถานะร้าน รูปแบบการจอง และเหตุผลภายในทีม
                    </Typography>
                  </Box>

                  <Box className="grid gap-3">
                    <TextField
                      select
                      label="สถานะ"
                      value={selectedTenant.status}
                      onChange={(event) =>
                        updateStatus(
                          selectedTenant,
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
                      value={selectedTenant.bookingMode || "chat"}
                      onChange={(event) =>
                        updateBookingMode(
                          selectedTenant,
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
                      value={reasons[selectedTenant.id] ?? selectedTenant.lifecycleReason ?? ""}
                      onChange={(event) =>
                        setReasons((current) => ({
                          ...current,
                          [selectedTenant.id]: event.target.value,
                        }))
                      }
                      fullWidth
                    />

                    <TextField
                      type="number"
                      label="ยอดแนะนำแชท"
                      value={
                        chatThresholds[selectedTenant.id] ??
                        String(selectedTenant.chatThresholdTHB ?? 0)
                      }
                      onChange={(event) =>
                        setChatThresholds((current) => ({
                          ...current,
                          [selectedTenant.id]: event.target.value,
                        }))
                      }
                      onBlur={() => updateChatThreshold(selectedTenant)}
                      inputProps={{ min: 0, step: 500 }}
                      helperText="0 = ปิดการแนะนำ"
                      fullWidth
                    />
                  </Box>
                </Box>

                <Button
                  href={`https://${tenantPrimaryDomain(selectedTenant)}`}
                  target="_blank"
                  variant="contained"
                  className="rounded-full!"
                >
                  เปิดหน้าร้าน
                </Button>
              </Stack>
            </Box>
          </Box>
        ) : null}
      </Drawer>

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
