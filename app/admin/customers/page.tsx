"use client";

import { Box, Card, CardContent, Typography, Stack, TextField, Divider, Chip, Button } from "@mui/material";
import * as React from "react";

type CustomerRow = {
    id: string;
    name: string;
    phone: string;
    email: string;
    totalBookings: number;
    lastBookingId?: string;
};

const SEED: CustomerRow[] = [
    { id: "u1", name: "Pachara", phone: "09x-xxx-xxxx", email: "pachara@email.com", totalBookings: 3, lastBookingId: "BK-1003" },
    { id: "u2", name: "Somchai", phone: "08x-xxx-xxxx", email: "somchai@email.com", totalBookings: 1, lastBookingId: "BK-1002" },
];

export default function AdminCustomersPage() {
    const [q, setQ] = React.useState("");

    const rows = React.useMemo(() => {
        return SEED.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.phone.includes(q) || r.email.toLowerCase().includes(q.toLowerCase()));
    }, [q]);

    return (
        <Box className="grid gap-4">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                <Box>
                    <Typography variant="h6" className="text-xl font-extrabold text-slate-900">ลูกค้า</Typography>
                    <Typography className="text-sm text-slate-600">ดูข้อมูลลูกค้าและประวัติการจอง</Typography>
                </Box>
                <TextField size="small" label="ค้นหา (ชื่อ/โทร/อีเมล)" value={q} onChange={(e) => setQ(e.target.value)} className="w-full md:w-[320px]" />
            </Stack>

            <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                <CardContent className="p-0">
                    {rows.map((c, idx) => (
                        <Box key={c.id}>
                            <Box className="p-4 sm:p-5">
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="items-start md:items-center justify-between">
                                    <Box>
                                        <Typography className="text-sm font-bold text-slate-900">{c.name}</Typography>
                                        <Typography className="mt-1 text-xs text-slate-500">{c.phone} • {c.email}</Typography>
                                        <Stack direction="row" spacing={1} className="mt-2 items-center">
                                            <Chip size="small" label={`การจองทั้งหมด: ${c.totalBookings}`} variant="outlined" />
                                            {c.lastBookingId ? <Chip size="small" label={`ล่าสุด: ${c.lastBookingId}`} variant="outlined" /> : null}
                                        </Stack>
                                    </Box>

                                    <Stack direction="row" spacing={1} className="justify-end w-full md:w-auto">
                                        <Button size="small" variant="outlined" sx={{ textTransform: "none", borderColor: "rgb(226 232 240)" }}>
                                            ดูรายละเอียด
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ textTransform: "none", bgcolor: "rgb(15 23 42)", boxShadow: "none", "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" } }}
                                        >
                                            ประวัติการจอง
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                            {idx !== rows.length - 1 ? <Divider className="border-slate-200!" /> : null}
                        </Box>
                    ))}

                    {!rows.length ? (
                        <Box className="p-8 text-center">
                            <Typography className="text-sm text-slate-600">ไม่พบข้อมูลลูกค้า</Typography>
                        </Box>
                    ) : null}
                </CardContent>
            </Card>
        </Box>
    );
}