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
    Button,
    Divider,
} from "@mui/material";

type CarStatus = "available" | "rented" | "maintenance" | "hidden";
type CarRow = {
    id: string;
    name: string;
    type: "Economy" | "Sedan" | "SUV" | "Van";
    seats: number;
    transmission: "Auto" | "Manual";
    fuel: "Gasoline" | "Hybrid" | "EV";
    pricePerDay: number;
    badge?: string;
    status: CarStatus;
};

const SEED: CarRow[] = [
    { id: "c1", name: "BMW 320d M Sport", type: "Sedan", seats: 5, transmission: "Auto", fuel: "Gasoline", pricePerDay: 1290, badge: "Best value", status: "available" },
    { id: "c2", name: "BMW 330e M Sport", type: "Sedan", seats: 5, transmission: "Auto", fuel: "Hybrid", pricePerDay: 1490, badge: "Popular", status: "available" },
    { id: "c3", name: "BMW M3 CS", type: "SUV", seats: 5, transmission: "Auto", fuel: "Gasoline", pricePerDay: 1990, badge: "Popular", status: "rented" },
    { id: "c4", name: "BMW i5 eDrive40 M Sport", type: "Sedan", seats: 5, transmission: "Auto", fuel: "EV", pricePerDay: 1590, badge: "New", status: "maintenance" },
    { id: "c5", name: "BMW i5 M60 xDrive", type: "Van", seats: 5, transmission: "Auto", fuel: "EV", pricePerDay: 1790, badge: "Popular", status: "available" },
];

function formatTHB(n: number) {
    const value = Number.isFinite(n) ? n : 0;
    const num = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
    return `${num} บาท`;
}

function StatusChip({ s }: { s: CarStatus }) {
    const map: Record<CarStatus, { label: string; variant: "filled" | "outlined" }> = {
        available: { label: "พร้อมให้เช่า", variant: "outlined" },
        rented: { label: "ถูกเช่าอยู่", variant: "filled" },
        maintenance: { label: "ซ่อมบำรุง", variant: "outlined" },
        hidden: { label: "ซ่อน", variant: "outlined" },
    };
    const m = map[s];
    return <Chip size="small" label={m.label} variant={m.variant} />;
}

export default function AdminCarsPage() {
    const [q, setQ] = React.useState("");
    const [status, setStatus] = React.useState<CarStatus | "all">("all");

    const rows = React.useMemo(() => {
        return SEED.filter((r) => {
            const okQ = !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase());
            const okS = status === "all" ? true : r.status === status;
            return okQ && okS;
        });
    }, [q, status]);

    return (
        <Box className="grid gap-4">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                <Box>
                    <Typography variant="h6" className="text-xl font-extrabold text-slate-900">รถ</Typography>
                    <Typography className="text-sm text-slate-600">จัดการข้อมูลรถ ราคา และสถานะการใช้งาน</Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} className="w-full md:w-auto">
                    <TextField size="small" label="ค้นหา (รหัส/ชื่อรถ)" value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-65" />
                    <TextField size="small" select label="สถานะ" value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full sm:w-45">
                        <MenuItem value="all">ทั้งหมด</MenuItem>
                        <MenuItem value="available">พร้อมให้เช่า</MenuItem>
                        <MenuItem value="rented">ถูกเช่าอยู่</MenuItem>
                        <MenuItem value="maintenance">ซ่อมบำรุง</MenuItem>
                        <MenuItem value="hidden">ซ่อน</MenuItem>
                    </TextField>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ textTransform: "none", bgcolor: "rgb(15 23 42)", boxShadow: "none", "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" } }}
                    >
                        + เพิ่มรถ
                    </Button>
                </Stack>
            </Stack>

            <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                <CardContent className="p-0">
                    {rows.map((c, idx) => (
                        <Box key={c.id}>
                            <Box className="p-4 sm:p-5">
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                                    <Box>
                                        <Stack direction="row" spacing={1} className="items-center">
                                            <Typography className="text-sm font-bold text-slate-900">{c.name}</Typography>
                                            {c.badge ? <Chip size="small" label={c.badge} variant="outlined" /> : null}
                                            <StatusChip s={c.status} />
                                        </Stack>
                                        <Typography className="mt-1 text-xs text-slate-500">
                                            {c.type} • {c.seats} ที่นั่ง • {c.transmission} • {c.fuel}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1} className="items-center justify-end w-full md:w-auto">
                                        <Box className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                            <Typography className="text-xs text-slate-500">ราคา/วัน</Typography>
                                            <Typography className="text-sm font-semibold text-slate-900">{formatTHB(c.pricePerDay)}</Typography>
                                        </Box>
                                        <Button size="small" variant="outlined" sx={{ textTransform: "none", borderColor: "rgb(226 232 240)" }}>
                                            แก้ไข
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ textTransform: "none", bgcolor: "rgb(15 23 42)", boxShadow: "none", "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" } }}
                                        >
                                            จัดการสถานะ
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>

                            {idx !== rows.length - 1 ? <Divider className="border-slate-200!" /> : null}
                        </Box>
                    ))}

                    {!rows.length ? (
                        <Box className="p-8 text-center">
                            <Typography className="text-sm text-slate-600">ไม่พบรายการรถ</Typography>
                        </Box>
                    ) : null}
                </CardContent>
            </Card>
        </Box>
    );
}