"use client";

import * as React from "react";
import { Box, Card, CardContent, Typography, Stack, TextField, MenuItem, Chip, Divider, Button } from "@mui/material";

type PayStatus = "pending" | "success" | "failed" | "refund";
type PaymentRow = {
    id: string;
    bookingId: string;
    method: "card" | "transfer" | "cash";
    amount: number;
    status: PayStatus;
    createdAt: string;
};

const SEED: PaymentRow[] = [
    { id: "PAY-9001", bookingId: "BK-1001", method: "card", amount: 2580, status: "success", createdAt: "2026-02-28" },
    { id: "PAY-9002", bookingId: "BK-1002", method: "transfer", amount: 2980, status: "pending", createdAt: "2026-03-01" },
    { id: "PAY-9003", bookingId: "BK-1004", method: "card", amount: 3180, status: "failed", createdAt: "2026-03-02" },
];

function formatTHB(n: number) {
    const value = Number.isFinite(n) ? n : 0;
    const num = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
    return `${num} บาท`;
}

function StatusChip({ s }: { s: PayStatus }) {
    const map: Record<PayStatus, { label: string; color: "default" | "success" | "warning" | "error" }> = {
        pending: { label: "รอตรวจสอบ", color: "warning" },
        success: { label: "สำเร็จ", color: "success" },
        failed: { label: "ล้มเหลว", color: "error" },
        refund: { label: "คืนเงิน", color: "default" },
    };
    const m = map[s];
    return <Chip size="small" label={m.label} color={m.color} variant="outlined" />;
}

export default function AdminPaymentsPage() {
    const [status, setStatus] = React.useState<PayStatus | "all">("all");

    const rows = React.useMemo(() => {
        return SEED.filter((r) => (status === "all" ? true : r.status === status));
    }, [status]);

    return (
        <Box className="grid gap-4">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                <Box>
                    <Typography variant="h6" className="text-xl font-extrabold text-slate-900">การชำระเงิน</Typography>
                    <Typography className="text-sm text-slate-600">ติดตามสถานะธุรกรรมและตรวจสอบการชำระเงิน</Typography>
                </Box>

                <TextField size="small" select label="สถานะ" value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full md:w-55">
                    <MenuItem value="all">ทั้งหมด</MenuItem>
                    <MenuItem value="pending">รอตรวจสอบ</MenuItem>
                    <MenuItem value="success">สำเร็จ</MenuItem>
                    <MenuItem value="failed">ล้มเหลว</MenuItem>
                    <MenuItem value="refund">คืนเงิน</MenuItem>
                </TextField>
            </Stack>

            <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                <CardContent className="p-0">
                    {rows.map((p, idx) => (
                        <Box key={p.id}>
                            <Box className="p-4 sm:p-5">
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                                    <Box>
                                        <Stack direction="row" spacing={1} className="items-center">
                                            <Typography className="text-sm font-bold text-slate-900">{p.id}</Typography>
                                            <StatusChip s={p.status} />
                                        </Stack>
                                        <Typography className="mt-1 text-xs text-slate-500">
                                            Booking: {p.bookingId} • วิธีชำระ: {p.method} • วันที่: {p.createdAt}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1} className="items-center justify-end w-full md:w-auto">
                                        <Box className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                            <Typography className="text-xs text-slate-500">ยอดชำระ</Typography>
                                            <Typography className="text-sm font-semibold text-slate-900">{formatTHB(p.amount)}</Typography>
                                        </Box>
                                        <Button size="small" variant="outlined" sx={{ textTransform: "none", borderColor: "rgb(226 232 240)" }}>
                                            รายละเอียด
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ textTransform: "none", bgcolor: "rgb(15 23 42)", boxShadow: "none", "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" } }}
                                        >
                                            อัปเดตสถานะ
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                            {idx !== rows.length - 1 ? <Divider className="border-slate-200!" /> : null}
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}