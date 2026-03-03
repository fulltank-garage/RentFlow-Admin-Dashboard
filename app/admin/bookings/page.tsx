"use client";

import * as React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    TextField,
    MenuItem,
    Chip,
    Divider,
    Button,
} from "@mui/material";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

type BookingRow = {
    id: string;
    carName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    customerName: string;
    phone: string;
    totalPrice: number;
    status: BookingStatus;
};

const SEED: BookingRow[] = [
    {
        id: "BK-1001",
        carName: "BMW 320d M Sport",
        pickupDate: "2026-03-01",
        returnDate: "2026-03-03",
        pickupLocation: "สนามบินสุวรรณภูมิ",
        returnLocation: "สนามบินสุวรรณภูมิ",
        customerName: "Pachara",
        phone: "09x-xxx-xxxx",
        totalPrice: 1290 * 2,
        status: "confirmed",
    },
    {
        id: "BK-1002",
        carName: "BMW 330e M Sport",
        pickupDate: "2026-03-02",
        returnDate: "2026-03-04",
        pickupLocation: "เซ็นทรัลลาดพร้าว",
        returnLocation: "เซ็นทรัลลาดพร้าว",
        customerName: "Pachara",
        phone: "09x-xxx-xxxx",
        totalPrice: 1490 * 2,
        status: "pending",
    },
    {
        id: "BK-1003",
        carName: "BMW M3 CS",
        pickupDate: "2026-03-03",
        returnDate: "2026-03-05",
        pickupLocation: "สถานีขนส่งหมอชิต",
        returnLocation: "สถานีขนส่งหมอชิต",
        customerName: "Pachara",
        phone: "09x-xxx-xxxx",
        totalPrice: 1990 * 2,
        status: "confirmed",
    },
    {
        id: "BK-1004",
        carName: "BMW i5 eDrive40 M Sport",
        pickupDate: "2026-03-04",
        returnDate: "2026-03-06",
        pickupLocation: "เซ็นทรัลเวิลด์",
        returnLocation: "เซ็นทรัลเวิลด์",
        customerName: "Pachara",
        phone: "09x-xxx-xxxx",
        totalPrice: 1590 * 2,
        status: "pending",
    },
];

function formatTHB(n: number) {
    const value = Number.isFinite(n) ? n : 0;
    const num = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
    return `${num} บาท`;
}

function StatusChip({ s }: { s: BookingStatus }) {
    const map: Record<BookingStatus, { label: string; color: "default" | "success" | "warning" | "error" }> = {
        pending: { label: "รอดำเนินการ", color: "warning" },
        confirmed: { label: "ยืนยันแล้ว", color: "success" },
        cancelled: { label: "ยกเลิก", color: "error" },
        completed: { label: "เสร็จสิ้น", color: "default" },
    };
    const m = map[s];
    return <Chip size="small" label={m.label} color={m.color} variant="outlined" />;
}

export default function AdminBookingsPage() {
    const [q, setQ] = React.useState("");
    const [status, setStatus] = React.useState<BookingStatus | "all">("all");

    const rows = React.useMemo(() => {
        return SEED.filter((r) => {
            const okQ =
                !q ||
                r.id.toLowerCase().includes(q.toLowerCase()) ||
                r.carName.toLowerCase().includes(q.toLowerCase()) ||
                r.customerName.toLowerCase().includes(q.toLowerCase());
            const okS = status === "all" ? true : r.status === status;
            return okQ && okS;
        });
    }, [q, status]);

    return (
        <Box className="grid gap-4">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                <Box>
                    <Typography variant="h6" className="text-xl font-extrabold text-slate-900">การจอง</Typography>
                    <Typography className="text-sm text-slate-600">ค้นหา / กรอง และจัดการสถานะการจอง</Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} className="w-full md:w-auto">
                    <TextField
                        size="small"
                        label="ค้นหา (รหัส/รถ/ลูกค้า)"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full sm:w-70"
                    />
                    <TextField
                        size="small"
                        select
                        label="สถานะ"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full sm:w-45"
                    >
                        <MenuItem value="all">ทั้งหมด</MenuItem>
                        <MenuItem value="pending">รอดำเนินการ</MenuItem>
                        <MenuItem value="confirmed">ยืนยันแล้ว</MenuItem>
                        <MenuItem value="cancelled">ยกเลิก</MenuItem>
                        <MenuItem value="completed">เสร็จสิ้น</MenuItem>
                    </TextField>
                </Stack>
            </Stack>

            <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                <CardContent className="p-0">
                    <Box className="grid">
                        {rows.map((b, idx) => (
                            <Box key={b.id}>
                                <Box className="p-4 sm:p-5">
                                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                                        <Box>
                                            <Stack direction="row" spacing={1} className="items-center">
                                                <Typography className="text-sm font-bold text-slate-900">{b.id}</Typography>
                                                <StatusChip s={b.status} />
                                            </Stack>
                                            <Typography className="mt-1 text-sm text-slate-700">{b.carName}</Typography>
                                            <Typography className="mt-1 text-xs text-slate-500">
                                                รับรถ: {b.pickupDate} • คืนรถ: {b.returnDate}
                                            </Typography>
                                            <Typography className="mt-1 text-xs text-slate-500">
                                                จุดรับ: {b.pickupLocation} • จุดคืน: {b.returnLocation}
                                            </Typography>
                                            <Typography className="mt-1 text-xs text-slate-500">
                                                ผู้จอง: {b.customerName} • {b.phone}
                                            </Typography>
                                        </Box>

                                        <Stack spacing={1} className="w-full md:w-auto">
                                            <Box className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:w-55">
                                                <Typography className="text-xs text-slate-500">ยอดรวม</Typography>
                                                <Typography className="text-sm font-semibold text-slate-900">{formatTHB(b.totalPrice)}</Typography>
                                            </Box>

                                            <Stack direction="row" spacing={1} className="justify-end">
                                                <Button size="small" variant="outlined" sx={{ textTransform: "none", borderColor: "rgb(226 232 240)" }}>
                                                    รายละเอียด
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{
                                                        textTransform: "none",
                                                        bgcolor: "rgb(15 23 42)",
                                                        boxShadow: "none",
                                                        "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" },
                                                    }}
                                                >
                                                    เปลี่ยนสถานะ
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {idx !== rows.length - 1 ? <Divider className="border-slate-200!" /> : null}
                            </Box>
                        ))}

                        {!rows.length ? (
                            <Box className="p-8 text-center">
                                <Typography className="text-sm text-slate-600">ไม่พบรายการที่ตรงกับเงื่อนไข</Typography>
                            </Box>
                        ) : null}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}