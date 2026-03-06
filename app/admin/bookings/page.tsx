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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
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
    adminNote?: string;
    customerNote?: string;
    createdAt: string;
    updatedAt: string;
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
        adminNote: "ลูกค้ายืนยันรับรถตามเวลา 09:00 น.",
        customerNote: "การจองของคุณได้รับการยืนยันแล้ว",
        createdAt: "2026-02-25 14:20",
        updatedAt: "2026-02-26 10:45",
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
        adminNote: "",
        customerNote: "",
        createdAt: "2026-02-26 09:15",
        updatedAt: "2026-02-26 09:15",
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
        adminNote: "ลูกค้าขอเตรียมรถล่วงหน้า 30 นาที",
        customerNote: "โปรดมาถึงก่อนเวลานัด 10 นาที",
        createdAt: "2026-02-26 16:00",
        updatedAt: "2026-02-27 08:30",
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
        adminNote: "",
        customerNote: "",
        createdAt: "2026-02-27 11:10",
        updatedAt: "2026-02-27 11:10",
    },
];

function formatTHB(n: number) {
    const value = Number.isFinite(n) ? n : 0;
    const num = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
    return `${num} บาท`;
}

function getNowString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}`;
}

function getStatusMeta(status: BookingStatus) {
    const map: Record<
        BookingStatus,
        {
            label: string;
            color: "default" | "success" | "warning" | "error";
        }
    > = {
        pending: { label: "รอดำเนินการ", color: "warning" },
        confirmed: { label: "ยืนยันแล้ว", color: "success" },
        cancelled: { label: "ยกเลิก", color: "error" },
        completed: { label: "เสร็จสิ้น", color: "default" },
    };

    return map[status];
}

function StatusChip({ s }: { s: BookingStatus }) {
    const m = getStatusMeta(s);
    return <Chip size="small" label={m.label} color={m.color} variant="outlined" />;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Box className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr]">
            <Typography className="text-sm font-medium text-slate-500">{label}</Typography>
            <Box className="text-sm font-semibold text-slate-900">{value}</Box>
        </Box>
    );
}

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Box className="rounded-2xl border border-slate-200 bg-white p-4">
            <Typography className="mb-3 text-sm font-extrabold tracking-wide text-slate-900">
                {title}
            </Typography>
            <Stack spacing={2}>{children}</Stack>
        </Box>
    );
}

export default function AdminBookingsPage() {
    const [rowsData, setRowsData] = React.useState<BookingRow[]>(SEED);
    const [q, setQ] = React.useState("");
    const [status, setStatus] = React.useState<BookingStatus | "all">("all");

    const [detailOpen, setDetailOpen] = React.useState(false);
    const [statusOpen, setStatusOpen] = React.useState(false);
    const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);

    const [selectedBooking, setSelectedBooking] = React.useState<BookingRow | null>(null);

    const [nextStatus, setNextStatus] = React.useState<BookingStatus>("pending");
    const [adminNote, setAdminNote] = React.useState("");
    const [customerNote, setCustomerNote] = React.useState("");

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackText, setSnackText] = React.useState("อัปเดตสถานะสำเร็จ");

    const rows = React.useMemo(() => {
        return rowsData.filter((r) => {
            const keyword = q.toLowerCase();
            const okQ =
                !q ||
                r.id.toLowerCase().includes(keyword) ||
                r.carName.toLowerCase().includes(keyword) ||
                r.customerName.toLowerCase().includes(keyword);
            const okS = status === "all" ? true : r.status === status;
            return okQ && okS;
        });
    }, [q, status, rowsData]);

    const refreshSelectedBooking = React.useCallback(
        (bookingId: string) => {
            const fresh = rowsData.find((item) => item.id === bookingId) ?? null;
            setSelectedBooking(fresh);
        },
        [rowsData]
    );

    const handleOpenDetail = (booking: BookingRow) => {
        setSelectedBooking(booking);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedBooking(null);
    };

    const handleOpenStatus = (booking: BookingRow) => {
        setSelectedBooking(booking);
        setNextStatus(booking.status);
        setAdminNote(booking.adminNote ?? "");
        setCustomerNote(booking.customerNote ?? "");
        setStatusOpen(true);
    };

    const handleCloseStatus = () => {
        setStatusOpen(false);
        setCancelConfirmOpen(false);
        setSelectedBooking(null);
        setAdminNote("");
        setCustomerNote("");
    };

    const applyStatusUpdate = (
        newStatus: BookingStatus,
        customAdminNote?: string,
        customCustomerNote?: string
    ) => {
        if (!selectedBooking) return;

        const now = getNowString();
        const nextAdminNote = customAdminNote !== undefined ? customAdminNote : adminNote;
        const nextCustomerNote =
            customCustomerNote !== undefined ? customCustomerNote : customerNote;

        setRowsData((prev) =>
            prev.map((item) =>
                item.id === selectedBooking.id
                    ? {
                        ...item,
                        status: newStatus,
                        adminNote: nextAdminNote,
                        customerNote: nextCustomerNote,
                        updatedAt: now,
                    }
                    : item
            )
        );

        setNextStatus(newStatus);
        setSnackText(`อัปเดตสถานะเป็น "${getStatusMeta(newStatus).label}" สำเร็จ`);
        setSnackOpen(true);
        setStatusOpen(false);
        setCancelConfirmOpen(false);
    };

    React.useEffect(() => {
        if (detailOpen && selectedBooking) {
            refreshSelectedBooking(selectedBooking.id);
        }
    }, [rowsData, detailOpen, selectedBooking, refreshSelectedBooking]);

    const quickActions: Array<{
        label: string;
        status: BookingStatus;
        variant: "contained" | "outlined";
        sx: object;
        confirmBefore?: boolean;
    }> = [
            {
                label: "ยืนยัน",
                status: "confirmed",
                variant: "contained",
                sx: {
                    textTransform: "none",
                    bgcolor: "rgb(22 163 74)",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "rgb(21 128 61)", boxShadow: "none" },
                },
            },
            {
                label: "ยกเลิก",
                status: "cancelled",
                variant: "outlined",
                confirmBefore: true,
                sx: {
                    textTransform: "none",
                    borderColor: "rgb(239 68 68)",
                    color: "rgb(220 38 38)",
                    "&:hover": {
                        borderColor: "rgb(220 38 38)",
                        bgcolor: "rgb(254 242 242)",
                    },
                },
            },
            {
                label: "เสร็จสิ้น",
                status: "completed",
                variant: "outlined",
                sx: {
                    textTransform: "none",
                    borderColor: "rgb(100 116 139)",
                    color: "rgb(15 23 42)",
                    "&:hover": {
                        borderColor: "rgb(71 85 105)",
                        bgcolor: "rgb(248 250 252)",
                    },
                },
            },
        ];

    return (
        <>
            <Box className="grid gap-4">
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    className="items-start md:items-center justify-between"
                >
                    <Box>
                        <Typography variant="h6" className="text-xl font-extrabold text-slate-900">
                            การจอง
                        </Typography>
                        <Typography className="text-sm text-slate-600">
                            ค้นหา / กรอง และจัดการสถานะการจอง
                        </Typography>
                    </Box>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        className="w-full md:w-auto"
                    >
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
                            onChange={(e) => setStatus(e.target.value as BookingStatus | "all")}
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
                                        <Stack
                                            direction={{ xs: "column", md: "row" }}
                                            spacing={2}
                                            className="items-start md:items-center justify-between"
                                        >
                                            <Box>
                                                <Stack direction="row" spacing={1} className="items-center">
                                                    <Typography className="text-sm font-bold text-slate-900">
                                                        {b.id}
                                                    </Typography>
                                                    <StatusChip s={b.status} />
                                                </Stack>

                                                <Typography className="mt-1 text-sm text-slate-700">
                                                    {b.carName}
                                                </Typography>

                                                <Typography className="mt-1 text-xs text-slate-500">
                                                    รับรถ: {b.pickupDate} • คืนรถ: {b.returnDate}
                                                </Typography>

                                                <Typography className="mt-1 text-xs text-slate-500">
                                                    จุดรับ: {b.pickupLocation} • จุดคืน: {b.returnLocation}
                                                </Typography>

                                                <Typography className="mt-1 text-xs text-slate-500">
                                                    ผู้จอง: {b.customerName} • {b.phone}
                                                </Typography>

                                                <Typography className="mt-1 text-xs text-slate-400">
                                                    สร้างเมื่อ: {b.createdAt} • อัปเดตล่าสุด: {b.updatedAt}
                                                </Typography>
                                            </Box>

                                            <Stack spacing={1} className="w-full md:w-auto">
                                                <Box className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:w-55">
                                                    <Typography className="text-xs text-slate-500">
                                                        ยอดรวม
                                                    </Typography>
                                                    <Typography className="text-sm font-semibold text-slate-900">
                                                        {formatTHB(b.totalPrice)}
                                                    </Typography>
                                                </Box>

                                                <Stack direction="row" spacing={1} className="justify-end">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleOpenDetail(b)}
                                                        sx={{
                                                            textTransform: "none",
                                                            borderColor: "rgb(226 232 240)",
                                                        }}
                                                    >
                                                        รายละเอียด
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() => handleOpenStatus(b)}
                                                        sx={{
                                                            textTransform: "none",
                                                            bgcolor: "rgb(15 23 42)",
                                                            boxShadow: "none",
                                                            "&:hover": {
                                                                bgcolor: "rgb(2 6 23)",
                                                                boxShadow: "none",
                                                            },
                                                        }}
                                                    >
                                                        เปลี่ยนสถานะ
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    {idx !== rows.length - 1 ? (
                                        <Divider className="border-slate-200!" />
                                    ) : null}
                                </Box>
                            ))}

                            {!rows.length ? (
                                <Box className="p-8 text-center">
                                    <Typography className="text-sm text-slate-600">
                                        ไม่พบรายการที่ตรงกับเงื่อนไข
                                    </Typography>
                                </Box>
                            ) : null}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Dialog
                open={detailOpen}
                onClose={handleCloseDetail}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 5,
                        overflow: "hidden",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        px: 3,
                        py: 2.5,
                        borderBottom: "1px solid rgb(226 232 240)",
                    }}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        className="items-start sm:items-center justify-between"
                    >
                        <Box>
                            <Typography className="text-lg font-extrabold text-slate-900">
                                รายละเอียดการจอง
                            </Typography>
                            {selectedBooking ? (
                                <Typography className="mt-1 text-sm text-slate-500">
                                    เลขที่การจอง {selectedBooking.id}
                                </Typography>
                            ) : null}
                        </Box>

                        {selectedBooking ? <StatusChip s={selectedBooking.status} /> : null}
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ p: 3, bgcolor: "rgb(248 250 252)" }}>
                    {selectedBooking && (
                        <Stack spacing={2}>
                            <Box className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-700 p-5 text-white">
                                <Typography className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                    Booking Overview
                                </Typography>
                                <Typography className="mt-2 text-xl font-extrabold">
                                    {selectedBooking.carName}
                                </Typography>
                                <Typography className="mt-2 text-sm text-slate-200">
                                    {selectedBooking.pickupDate} → {selectedBooking.returnDate}
                                </Typography>
                                <Typography className="mt-4 text-sm text-slate-300">ยอดรวม</Typography>
                                <Typography className="text-2xl font-extrabold">
                                    {formatTHB(selectedBooking.totalPrice)}
                                </Typography>
                            </Box>

                            <Box className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <SectionCard title="ข้อมูลรถ">
                                    <InfoRow label="รหัสการจอง" value={selectedBooking.id} />
                                    <InfoRow label="รุ่นรถ" value={selectedBooking.carName} />
                                    <InfoRow label="ยอดรวม" value={formatTHB(selectedBooking.totalPrice)} />
                                    <InfoRow label="สถานะ" value={<StatusChip s={selectedBooking.status} />} />
                                </SectionCard>

                                <SectionCard title="ข้อมูลลูกค้า">
                                    <InfoRow label="ชื่อผู้จอง" value={selectedBooking.customerName} />
                                    <InfoRow label="เบอร์โทร" value={selectedBooking.phone} />
                                </SectionCard>

                                <SectionCard title="ข้อมูลการรับรถ">
                                    <InfoRow label="วันรับรถ" value={selectedBooking.pickupDate} />
                                    <InfoRow label="จุดรับรถ" value={selectedBooking.pickupLocation} />
                                </SectionCard>

                                <SectionCard title="ข้อมูลการคืนรถ">
                                    <InfoRow label="วันคืนรถ" value={selectedBooking.returnDate} />
                                    <InfoRow label="จุดคืนรถ" value={selectedBooking.returnLocation} />
                                </SectionCard>

                                <SectionCard title="ข้อมูลระบบ">
                                    <InfoRow label="วันที่สร้าง" value={selectedBooking.createdAt} />
                                    <InfoRow label="อัปเดตล่าสุด" value={selectedBooking.updatedAt} />
                                </SectionCard>

                                <SectionCard title="หมายเหตุภายในแอดมิน">
                                    <Typography className="text-sm leading-6 text-slate-700">
                                        {selectedBooking.adminNote?.trim()
                                            ? selectedBooking.adminNote
                                            : "ยังไม่มีหมายเหตุภายใน"}
                                    </Typography>
                                </SectionCard>

                                <SectionCard title="หมายเหตุที่ลูกค้าเห็น">
                                    <Typography className="text-sm leading-6 text-slate-700">
                                        {selectedBooking.customerNote?.trim()
                                            ? selectedBooking.customerNote
                                            : "ยังไม่มีหมายเหตุสำหรับลูกค้า"}
                                    </Typography>
                                </SectionCard>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: "1px solid rgb(226 232 240)",
                    }}
                >
                    <Button
                        onClick={handleCloseDetail}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderColor: "rgb(226 232 240)",
                            color: "rgb(15 23 42)",
                        }}
                    >
                        ปิดหน้าต่าง
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={statusOpen}
                onClose={handleCloseStatus}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 5,
                        overflow: "hidden",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        px: 3,
                        py: 2.5,
                        borderBottom: "1px solid rgb(226 232 240)",
                    }}
                >
                    <Typography className="text-lg font-extrabold text-slate-900">
                        เปลี่ยนสถานะการจอง
                    </Typography>
                    {selectedBooking ? (
                        <Typography className="mt-1 text-sm text-slate-500">
                            {selectedBooking.id} • {selectedBooking.carName}
                        </Typography>
                    ) : null}
                </DialogTitle>

                <DialogContent sx={{ p: 3, bgcolor: "rgb(248 250 252)" }}>
                    {selectedBooking && (
                        <Stack spacing={2}>
                            <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                                <Typography className="text-xs font-medium text-slate-500">
                                    สถานะปัจจุบัน
                                </Typography>
                                <Box className="mt-2">
                                    <StatusChip s={selectedBooking.status} />
                                </Box>
                            </Box>

                            <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                                <Typography className="mb-3 text-sm font-bold text-slate-900">
                                    Quick Actions
                                </Typography>

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                                    {quickActions.map((action) => (
                                        <Button
                                            key={action.status}
                                            variant={action.variant}
                                            onClick={() => {
                                                if (action.confirmBefore) {
                                                    setCancelConfirmOpen(true);
                                                    return;
                                                }
                                                applyStatusUpdate(action.status);
                                            }}
                                            sx={{
                                                flex: 1,
                                                ...action.sx,
                                            }}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>

                            <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="สถานะใหม่"
                                    value={nextStatus}
                                    onChange={(e) => setNextStatus(e.target.value as BookingStatus)}
                                >
                                    <MenuItem value="pending">รอดำเนินการ</MenuItem>
                                    <MenuItem value="confirmed">ยืนยันแล้ว</MenuItem>
                                    <MenuItem value="cancelled">ยกเลิก</MenuItem>
                                    <MenuItem value="completed">เสร็จสิ้น</MenuItem>
                                </TextField>

                                <Box className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                                    <Typography className="text-xs font-medium text-slate-500">
                                        ตัวอย่างสถานะใหม่
                                    </Typography>
                                    <Box className="mt-2">
                                        <StatusChip s={nextStatus} />
                                    </Box>
                                </Box>

                                <TextField
                                    multiline
                                    minRows={4}
                                    fullWidth
                                    label="หมายเหตุภายในแอดมิน"
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="เช่น ติดต่อแล้ว / รอเอกสาร / ลูกค้าขอเลื่อนเวลา"
                                    className="mt-4"
                                />

                                <TextField
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    label="หมายเหตุที่ลูกค้าเห็น"
                                    value={customerNote}
                                    onChange={(e) => setCustomerNote(e.target.value)}
                                    placeholder="เช่น การจองของคุณได้รับการยืนยันแล้ว / กรุณามาถึงก่อนเวลานัด"
                                    className="mt-4"
                                />

                                <Box className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <Stack spacing={1}>
                                        <Typography className="text-xs font-medium text-slate-500">
                                            ข้อมูลที่จะถูกอัปเดต
                                        </Typography>
                                        <InfoRow label="สร้างเมื่อ" value={selectedBooking.createdAt} />
                                        <InfoRow label="อัปเดตล่าสุด" value={selectedBooking.updatedAt} />
                                    </Stack>
                                </Box>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: "1px solid rgb(226 232 240)",
                    }}
                >
                    <Button
                        onClick={handleCloseStatus}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderColor: "rgb(226 232 240)",
                            color: "rgb(15 23 42)",
                        }}
                    >
                        ยกเลิก
                    </Button>

                    <Button
                        onClick={() => {
                            if (nextStatus === "cancelled") {
                                setCancelConfirmOpen(true);
                                return;
                            }
                            applyStatusUpdate(nextStatus);
                        }}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            bgcolor: "rgb(15 23 42)",
                            boxShadow: "none",
                            px: 2,
                            "&:hover": {
                                bgcolor: "rgb(2 6 23)",
                                boxShadow: "none",
                            },
                        }}
                    >
                        บันทึกสถานะ
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={cancelConfirmOpen}
                onClose={() => setCancelConfirmOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: "rgb(15 23 42)" }}>
                    ยืนยันการยกเลิกการจอง
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={1.5}>
                        <Typography className="text-sm text-slate-700">
                            คุณต้องการยกเลิก booking นี้ใช่หรือไม่
                        </Typography>
                        {selectedBooking ? (
                            <Box className="rounded-2xl border border-red-200 bg-red-50 p-3">
                                <Typography className="text-sm font-bold text-slate-900">
                                    {selectedBooking.id}
                                </Typography>
                                <Typography className="text-sm text-slate-700">
                                    {selectedBooking.carName}
                                </Typography>
                                <Typography className="mt-1 text-xs text-slate-500">
                                    ผู้จอง: {selectedBooking.customerName}
                                </Typography>
                            </Box>
                        ) : null}
                        <Typography className="text-xs text-red-600">
                            หลังยืนยันแล้ว สถานะจะถูกเปลี่ยนเป็น “ยกเลิก”
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={() => setCancelConfirmOpen(false)}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderColor: "rgb(226 232 240)",
                            color: "rgb(15 23 42)",
                        }}
                    >
                        กลับไปแก้ไข
                    </Button>

                    <Button
                        onClick={() => applyStatusUpdate("cancelled")}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            bgcolor: "rgb(220 38 38)",
                            boxShadow: "none",
                            "&:hover": {
                                bgcolor: "rgb(185 28 28)",
                                boxShadow: "none",
                            },
                        }}
                    >
                        ยืนยันการยกเลิก
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2500}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: 3,
                        boxShadow: "0 10px 30px rgba(15,23,42,0.18)",
                    }}
                >
                    {snackText}
                </Alert>
            </Snackbar>
        </>
    );
}