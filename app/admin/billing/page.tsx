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
  Stack,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { billingService } from "@/src/services/billing/billing.service";
import type { PlatformBilling } from "@/src/services/billing/billing.types";

function formatTHB(value?: number) {
  return `${new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? Number(value) : 0)} บาท`;
}

function planLabel(plan: string) {
  const normalized = plan.trim().toLowerCase();
  if (normalized === "starter") return "Starter";
  if (normalized === "growth") return "Growth";
  if (normalized === "enterprise") return "Enterprise";
  return plan || "ไม่ระบุแผน";
}

function invoiceStatusLabel(status: string) {
  const labels: Record<string, string> = {
    open: "รอชำระ",
    paid: "ชำระแล้ว",
    overdue: "เกินกำหนด",
    void: "ยกเลิก",
    draft: "แบบร่าง",
  };
  return labels[status] || status;
}

function invoiceStatusClass(status: string) {
  if (status === "paid") return "admin-chip admin-chip-green";
  if (status === "overdue" || status === "void") return "admin-chip admin-chip-rose";
  return "admin-chip admin-chip-orange";
}

export default function BillingPage() {
  const [billing, setBilling] = React.useState<PlatformBilling | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [busyInvoiceId, setBusyInvoiceId] = React.useState("");

  const loadBilling = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      setBilling(await billingService.getBilling());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลรายได้ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  async function updateInvoice(
    invoiceId: string,
    status: "open" | "paid" | "overdue" | "void",
    amount?: number
  ) {
    setBusyInvoiceId(invoiceId);
    try {
      await billingService.updateInvoiceStatus(invoiceId, {
        status,
        paidAmount: status === "paid" ? amount : 0,
        paymentMethod: status === "paid" ? "manual" : "",
      });
      await loadBilling();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "อัปเดตใบแจ้งหนี้ไม่สำเร็จ");
    } finally {
      setBusyInvoiceId("");
    }
  }

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadBilling();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadBilling]);

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
    onRefresh: loadBilling,
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          แผนและรายได้
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          ภาพรวมรายได้และจำนวนร้านตามแผนบริการจากข้อมูลจริง
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box className="grid min-h-72 place-items-center rounded-[32px] bg-white">
          <CircularProgress />
        </Box>
      ) : billing ? (
        <>
          <Box className="grid gap-4 md:grid-cols-3">
            <Card elevation={0} className="rounded-3xl! bg-white">
              <CardContent className="p-5!">
                <Typography className="text-sm text-slate-500">
                  ร้านทั้งหมด
                </Typography>
                <Typography className="mt-3 text-3xl font-black text-slate-950">
                  {billing.summary.totalTenants}
                </Typography>
                <Typography className="mt-1 text-sm text-slate-500">
                  {billing.summary.activeTenantCount} ร้านเปิดใช้งาน
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={0} className="rounded-3xl! bg-white">
              <CardContent className="p-5!">
                <Typography className="text-sm text-slate-500">
                  รายได้เดือนนี้
                </Typography>
                <Typography className="mt-3 text-3xl font-black text-slate-950">
                  {formatTHB(billing.summary.revenueThisMonth)}
                </Typography>
                <Typography className="mt-1 text-sm text-slate-500">
                  รวมรายการที่ชำระแล้วในเดือนนี้
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={0} className="rounded-3xl! bg-white">
              <CardContent className="p-5!">
                <Typography className="text-sm text-slate-500">
                  แผนที่ใช้งาน
                </Typography>
                <Typography className="mt-3 text-3xl font-black text-slate-950">
                  {billing.plans.filter((plan) => plan.count > 0).length}
                </Typography>
                <Typography className="mt-1 text-sm text-slate-500">
                  จาก {billing.plans.length} แผนทั้งหมด
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box className="grid gap-4 md:grid-cols-3">
            {billing.plans.map((plan) => (
              <Card
                key={plan.plan}
                elevation={0}
                className="rounded-3xl! bg-white"
              >
                <CardContent className="p-5!">
                  <Typography className="text-sm font-bold text-slate-500">
                    {planLabel(plan.plan)}
                  </Typography>
                  <Typography className="mt-3 text-3xl font-black text-slate-950">
                    {plan.count}
                  </Typography>
                  <Typography className="mt-1 text-sm text-slate-500">
                    ร้านในแผนนี้
                  </Typography>
                  <Typography className="mt-4 text-sm font-bold text-slate-900">
                    {formatTHB(plan.revenueThisMonth)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Card elevation={0} className="rounded-3xl! bg-white">
            <CardContent className="p-5!">
              <Typography className="text-lg font-black text-slate-950">
                รายได้ตามร้าน
              </Typography>
              <Stack spacing={1.5} className="mt-4">
                {billing.items.length === 0 ? (
                  <Typography className="text-sm text-slate-500">
                    ยังไม่มีร้านในระบบ
                  </Typography>
                ) : (
                  billing.items.map((tenant) => (
                    <Box
                      key={tenant.id}
                      className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-center"
                    >
                      <Box>
                        <Typography className="font-black text-slate-950">
                          {tenant.shopName}
                        </Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          {tenant.publicDomain} • {planLabel(tenant.plan)}
                        </Typography>
                      </Box>
                      <Box className="md:text-right">
                        <Typography className="text-sm font-black text-slate-950">
                          {formatTHB(tenant.revenueThisMonth)}
                        </Typography>
                        <Typography className="mt-1 text-xs text-slate-500">
                          {tenant.bookingsThisMonth ?? 0} รายการเดือนนี้
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} className="rounded-3xl! bg-white">
            <CardContent className="p-5!">
              <Typography className="text-lg font-black text-slate-950">
                ใบแจ้งหนี้แพลตฟอร์ม
              </Typography>
              <Stack spacing={1.5} className="mt-4">
                {(billing.invoices || []).length === 0 ? (
                  <Typography className="text-sm text-slate-500">
                    ยังไม่มีใบแจ้งหนี้
                  </Typography>
                ) : (
                  (billing.invoices || []).slice(0, 8).map((invoice) => (
                    <Box
                      key={invoice.id}
                      className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-center"
                    >
                      <Box>
                        <Typography className="font-black text-slate-950">
                          รอบ {invoice.period} • {planLabel(invoice.plan)}
                        </Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          ร้าน {invoice.tenantId}
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" className="mt-2">
                          <Chip
                            label={invoiceStatusLabel(invoice.status)}
                            className={invoiceStatusClass(invoice.status)}
                          />
                          {invoice.dueAt ? (
                            <Chip
                              label={`ครบกำหนด ${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(invoice.dueAt))}`}
                              className="admin-chip"
                            />
                          ) : null}
                        </Stack>
                      </Box>
                      <Stack spacing={1} className="md:items-end">
                        <Typography className="font-black text-slate-950">
                          {formatTHB(invoice.amount)}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={busyInvoiceId === invoice.id || invoice.status === "paid"}
                            onClick={() => updateInvoice(invoice.id, "paid", invoice.amount)}
                          >
                            ชำระแล้ว
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={busyInvoiceId === invoice.id || invoice.status === "void"}
                            onClick={() => updateInvoice(invoice.id, "void")}
                          >
                            ยกเลิก
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
