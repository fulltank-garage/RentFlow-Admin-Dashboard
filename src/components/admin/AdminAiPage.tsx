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
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { aiService } from "@/src/services/ai/ai.service";
import type {
  PlatformAiAction,
  PlatformAiAlert,
  PlatformAiAssistant,
  PlatformAiMetric,
} from "@/src/services/ai/ai.types";

function toneBg(tone: PlatformAiMetric["tone"] | PlatformAiAlert["tone"]) {
  if (tone === "success") return "bg-emerald-50 text-emerald-900 border-emerald-200";
  if (tone === "warning") return "bg-amber-50 text-amber-900 border-amber-200";
  if (tone === "danger") return "bg-rose-50 text-rose-900 border-rose-200";
  if (tone === "info") return "bg-sky-50 text-sky-900 border-sky-200";
  return "bg-slate-50 text-slate-900 border-slate-200";
}

function priorityLabel(priority: PlatformAiAction["priority"]) {
  if (priority === "high") return "ต้องทำก่อน";
  if (priority === "medium") return "ควรตามต่อ";
  return "เฝ้าดู";
}

function formatTHB(value: number) {
  return `${new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)} บาท`;
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminAiPage() {
  const [assistant, setAssistant] = React.useState<PlatformAiAssistant | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await aiService.getAssistant();
        if (active) setAssistant(data);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลด AI insights ได้");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Box className="grid min-h-[50vh] place-items-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="admin-page">
      <Box className="admin-page-header">
        <Typography className="admin-page-title">ผู้ช่วย AI</Typography>
        <Typography className="admin-page-subtitle">
          สรุปสัญญาณที่ควรจับตาทั้งระบบจาก tenant, domain และรายได้จริง
          เพื่อช่วยให้ทีม platform ตัดสินใจได้เร็วขึ้น
        </Typography>
      </Box>

      <Box className="admin-card rounded-[32px]! p-5 md:p-6">
        <Typography className="admin-section-title">
          สถานะการวิเคราะห์
        </Typography>
        <Typography className="admin-section-subtitle mt-2">
          อัปเดตล่าสุด {formatDate(assistant?.generatedAt)} • แหล่งข้อมูล{" "}
          {assistant?.provider || "database-rules"}
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {assistant ? (
        <>
          <Card elevation={0} className="rounded-3xl! border border-slate-200 bg-white">
            <CardContent className="p-6!">
              <Stack direction="row" spacing={2} className="items-start">
                <Box className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700">
                  <InsightsRoundedIcon />
                </Box>
                <Box>
                  <Typography className="text-lg font-black text-slate-950">สรุปภาพรวมจาก AI</Typography>
                  <Typography className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
                    {assistant.summary}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assistant.metrics.map((metric) => (
              <Card key={metric.label} elevation={0} className="rounded-3xl! border border-slate-200 bg-white">
                <CardContent className="p-5!">
                  <Typography className="text-sm text-slate-500">{metric.label}</Typography>
                  <Typography className="mt-2 text-3xl font-black text-slate-950">
                    {metric.displayValue}
                  </Typography>
                  <Typography className="mt-2 text-xs leading-6 text-slate-500">{metric.detail}</Typography>
                  <Box className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneBg(metric.tone)}`}>
                    {metric.tone === "success"
                      ? "แข็งแรง"
                      : metric.tone === "warning"
                        ? "ต้องติดตาม"
                        : metric.tone === "info"
                          ? "มี insight"
                          : metric.tone === "danger"
                            ? "มีความเสี่ยง"
                            : "ภาพรวม"}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <Card elevation={0} className="rounded-3xl! border border-slate-200 bg-white">
              <CardContent className="p-5!">
                <Stack direction="row" spacing={2} className="items-center">
                  <Box className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                    <WarningAmberRoundedIcon />
                  </Box>
                  <Box>
                    <Typography className="text-lg font-black text-slate-950">สัญญาณที่ควรจับตา</Typography>
                    <Typography className="text-sm text-slate-500">AI ย่อยให้ว่าตอนนี้ platform ควรหันไปดูเรื่องไหนก่อน</Typography>
                  </Box>
                </Stack>
                <Stack spacing={2} className="mt-5">
                  {assistant.alerts.map((alert) => (
                    <Box key={`${alert.title}-${alert.detail}`} className={`rounded-3xl border px-4 py-4 ${toneBg(alert.tone)}`}>
                      <Typography className="font-black">{alert.title}</Typography>
                      <Typography className="mt-1 text-sm leading-6">{alert.detail}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} className="rounded-3xl! border border-slate-200 bg-white">
              <CardContent className="p-5!">
                <Stack direction="row" spacing={2} className="items-center">
                  <Box className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-sky-700">
                    <AutoAwesomeRoundedIcon />
                  </Box>
                  <Box>
                    <Typography className="text-lg font-black text-slate-950">Action list สำหรับทีม platform</Typography>
                    <Typography className="text-sm text-slate-500">งานที่ควรหยิบไปทำต่อจากภาพรวมล่าสุด</Typography>
                  </Box>
                </Stack>
                <Stack spacing={2} className="mt-5">
                  {assistant.actions.map((action) => (
                    <Box key={`${action.title}-${action.detail}`} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography className="font-black text-slate-950">{action.title}</Typography>
                        <Chip size="small" label={priorityLabel(action.priority)} className="bg-slate-900! text-white!" />
                      </Stack>
                      <Typography className="mt-2 text-sm leading-6 text-slate-600">{action.detail}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card elevation={0} className="rounded-3xl! border border-slate-200 bg-white">
              <CardContent className="p-5!">
                <Stack direction="row" spacing={2} className="items-center">
                  <Box className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <StorefrontRoundedIcon />
                  </Box>
                  <Box>
                    <Typography className="text-lg font-black text-slate-950">ร้านที่กำลังโต</Typography>
                    <Typography className="text-sm text-slate-500">เรียงจากรายได้และ booking เดือนนี้เพื่อดู momentum ของระบบ</Typography>
                  </Box>
                </Stack>
                <Divider className="my-5! border-slate-200!" />
                <Stack spacing={2}>
                  {assistant.growthTenants.map((tenant) => (
                    <Box key={tenant.id} className="grid gap-3 rounded-3xl border border-slate-200 p-4 md:grid-cols-[1fr_auto] md:items-center">
                      <Box>
                        <Typography className="font-black text-slate-950">{tenant.shopName}</Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          {tenant.publicDomain} • {tenant.bookingsThisMonth} booking เดือนนี้
                        </Typography>
                      </Box>
                      <Box className="text-left md:text-right">
                        <Typography className="font-black text-slate-950">{formatTHB(tenant.revenueThisMonth)}</Typography>
                        <Typography className="text-xs text-slate-500">{tenant.cars} คัน • แผน {tenant.plan}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} className="rounded-3xl! border border-slate-200 bg-white">
              <CardContent className="p-5!">
                <Typography className="text-lg font-black text-slate-950">ร้านที่ควรตามต่อ</Typography>
                <Typography className="mt-1 text-sm text-slate-500">AI รวมเหตุผลให้แล้วว่าร้านไหนควรถูกหยิบขึ้นมาดูก่อน</Typography>
                <Stack spacing={2} className="mt-5">
                  {assistant.riskTenants.length === 0 ? (
                    <Box className="grid min-h-48 place-items-center text-center">
                      <Typography className="text-sm text-slate-500">ตอนนี้ยังไม่พบ tenant ที่มีสัญญาณเสี่ยงเด่นชัด</Typography>
                    </Box>
                  ) : (
                    assistant.riskTenants.map((tenant) => (
                      <Box key={`${tenant.tenantId}-${tenant.shopName}`} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <Typography className="font-black text-slate-950">{tenant.shopName}</Typography>
                        <Typography className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{tenant.publicDomain}</Typography>
                        <Typography className="mt-3 text-sm leading-6 text-slate-600">{tenant.reason}</Typography>
                      </Box>
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
