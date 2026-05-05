"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { overviewService } from "@/src/services/overview/overview.service";
import type { PlatformOverview } from "@/src/services/overview/overview.types";
import type { PlatformTenant } from "@/src/services/partners/partners.types";

function formatTHB(value?: number) {
  return `${new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? Number(value) : 0)} บาท`;
}

function tenantStatusLabel(status: PlatformTenant["status"]) {
  const map: Record<PlatformTenant["status"], string> = {
    active: "ใช้งานอยู่",
    pending: "รอตรวจสอบ",
    suspended: "ระงับชั่วคราว",
    rejected: "ไม่อนุมัติ",
  };
  return map[status] || status;
}

function domainStatusLabel(status: string) {
  const map: Record<string, string> = {
    verified: "ยืนยันแล้ว",
    pending_dns: "รอ DNS",
    pending: "รอตรวจสอบ",
    conflict: "มีปัญหา",
  };
  return map[status] || status;
}

function toneForStatus(status: string) {
  if (status === "active" || status === "verified") return "success";
  if (status === "pending" || status === "pending_dns") return "warning";
  return "error";
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = React.useState<PlatformOverview | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadOverview = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      setOverview(await overviewService.getOverview());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดภาพรวมระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOverview();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOverview]);

  useAdminRealtimeRefresh({
    events: [
      "tenant.updated",
      "booking.created",
      "booking.updated",
      "booking.cancelled",
      "branch.changed",
      "car.status.changed",
      "review.created",
      "addon.changed",
      "promotion.changed",
      "lead.changed",
      "member.changed",
      "support.changed",
      "payment.created",
      "payment.updated",
    ],
    onRefresh: loadOverview,
  });

  const stats = overview
    ? [
        {
          label: "ร้านทั้งหมด",
          value: overview.summary.totalTenants.toString(),
          caption: `${overview.summary.activeTenants} ร้านเปิดใช้งาน`,
        },
        {
          label: "โดเมนพร้อมใช้งาน",
          value: overview.summary.verifiedDomains.toString(),
          caption: `${overview.summary.domainsNeedingCare} รายการต้องดูแล`,
        },
        {
          label: "เจ้าของร้านรอตรวจ",
          value: overview.summary.pendingTenants.toString(),
          caption: "รออนุมัติร้านและ subdomain",
        },
        {
          label: "รายได้เดือนนี้",
          value: formatTHB(overview.summary.revenueThisMonth),
          caption: "รวมทุกร้านจากรายการชำระเงิน",
        },
      ]
    : [];

  return (
    <Box className="admin-page">
      <Box className="admin-page-header">
        <Typography className="admin-page-title">ภาพรวมระบบ</Typography>
        <Typography className="admin-page-subtitle">
          ควบคุม RentFlow ทุก tenant ในที่เดียว ตรวจสอบร้านใหม่ โดเมน รายได้
          และสถานะการใช้งานของแต่ละร้านจากข้อมูลล่าสุด
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box className="admin-card grid min-h-72 place-items-center rounded-[32px]">
          <CircularProgress />
        </Box>
      ) : overview ? (
        <>
          <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} elevation={0} className="admin-card rounded-3xl!">
                <CardContent className="p-5!">
                  <Typography className="text-sm text-slate-500">
                    {stat.label}
                  </Typography>
                  <Typography className="mt-2 text-2xl font-black text-slate-950">
                    {stat.value}
                  </Typography>
                  <Typography className="mt-1 text-xs text-slate-500">
                    {stat.caption}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card elevation={0} className="admin-card rounded-3xl!">
              <CardContent className="p-5!">
                <Typography className="text-lg font-black text-slate-950">
                  ร้านล่าสุดในระบบ
                </Typography>
                <Typography className="text-sm text-slate-500">
                  tenant ที่ผูกกับหน้าร้านสาธารณะ
                </Typography>

                <Divider className="my-4! border-slate-200!" />

                <Stack spacing={1.5}>
                  {overview.recentTenants.length === 0 ? (
                    <Typography className="text-sm text-slate-500">
                      ยังไม่มีร้านในระบบ
                    </Typography>
                  ) : (
                    overview.recentTenants.map((tenant) => (
                      <Box
                        key={tenant.id}
                        className="grid gap-3 rounded-2xl border border-[var(--rf-admin-line)] bg-slate-50 p-4 md:grid-cols-[1fr_auto]"
                      >
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography className="font-black text-slate-950">
                              {tenant.shopName}
                            </Typography>
                            <Chip
                              size="small"
                              color={toneForStatus(tenant.status)}
                              label={tenantStatusLabel(tenant.status)}
                            />
                          </Stack>
                          <Typography className="mt-1 text-sm text-slate-500">
                            {tenant.publicDomain} • เจ้าของ{" "}
                            {tenant.ownerName || tenant.ownerEmail}
                          </Typography>
                        </Box>
                        <Box className="text-left md:text-right">
                          <Typography className="text-sm font-bold text-slate-900">
                            {formatTHB(tenant.revenueThisMonth)}
                          </Typography>
                          <Typography className="text-xs text-slate-500">
                            {tenant.bookingsThisMonth ?? 0} รายการเดือนนี้
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} className="admin-card rounded-3xl!">
              <CardContent className="p-5!">
                <Typography className="text-lg font-black text-slate-950">
                  ความพร้อมของระบบร้าน
                </Typography>
                <Typography className="mt-1 text-sm text-slate-500">
                  สรุปจากสถานะร้านและโดเมนล่าสุด
                </Typography>

                <Stack spacing={3} className="mt-5">
                  {[
                    ["ร้านเปิดใช้งาน", overview.summary.activeTenants, overview.summary.totalTenants],
                    ["ร้านรอตรวจสอบ", overview.summary.pendingTenants, overview.summary.totalTenants],
                    ["โดเมนพร้อมใช้งาน", overview.summary.verifiedDomains, overview.summary.verifiedDomains + overview.summary.domainsNeedingCare],
                  ].map(([label, value, total]) => {
                    const percent = total ? (Number(value) / Number(total)) * 100 : 0;
                    return (
                      <Box key={String(label)}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography className="text-sm font-bold text-slate-800">
                            {label}
                          </Typography>
                          <Typography className="text-sm text-slate-500">
                            {value}/{total}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          className="mt-2 rounded-full!"
                          sx={{ height: 8, bgcolor: "rgb(226 232 240)" }}
                        />
                      </Box>
                    );
                  })}
                </Stack>

                <Divider className="my-5! border-slate-200!" />

                <Stack spacing={1.25}>
                  {overview.recentDomains.length === 0 ? (
                    <Typography className="text-sm text-slate-500">
                      ยังไม่มีโดเมนในระบบ
                    </Typography>
                  ) : (
                    overview.recentDomains.map((domain) => (
                      <Stack
                        key={domain.id}
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                        className="rounded-2xl border border-[var(--rf-admin-line)] bg-slate-50 px-3 py-2"
                      >
                        <Typography className="text-sm font-semibold text-slate-900">
                          {domain.domain}
                        </Typography>
                        <Chip
                          size="small"
                          color={toneForStatus(domain.status)}
                          label={domainStatusLabel(domain.status)}
                        />
                      </Stack>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </>
      ) : null}
    </Box>
  );
}
