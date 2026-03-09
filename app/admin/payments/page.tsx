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
    Drawer,
    IconButton,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

type PayStatus = "pending" | "success" | "failed" | "refund";
type DrawerMode = "detail" | "status" | null;

type PaymentMethod = "card" | "transfer" | "cash";

type PaymentRow = {
    id: string;
    bookingId: string;
    method: PaymentMethod;
    amount: number;
    status: PayStatus;
    createdAt: string;
};

const SEED: PaymentRow[] = [
    {
        id: "PAY-9001",
        bookingId: "BK-1001",
        method: "card",
        amount: 2580,
        status: "success",
        createdAt: "2026-02-28",
    },
    {
        id: "PAY-9002",
        bookingId: "BK-1002",
        method: "transfer",
        amount: 2980,
        status: "pending",
        createdAt: "2026-03-01",
    },
    {
        id: "PAY-9003",
        bookingId: "BK-1004",
        method: "card",
        amount: 3180,
        status: "failed",
        createdAt: "2026-03-02",
    },
];

function formatTHB(n: number) {
    const value = Number.isFinite(n) ? n : 0;
    const num = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
    return `${num} บาท`;
}

function paymentMethodLabel(method: PaymentMethod) {
    if (method === "card") return "บัตร";
    if (method === "transfer") return "โอนเงิน";
    return "เงินสด";
}

function getPayStatusMeta(status: PayStatus) {
    const map: Record<
        PayStatus,
        {
            label: string;
            tone: "amber" | "emerald" | "rose" | "slate";
        }
    > = {
        pending: { label: "รอตรวจสอบ", tone: "amber" },
        success: { label: "สำเร็จ", tone: "emerald" },
        failed: { label: "ล้มเหลว", tone: "rose" },
        refund: { label: "คืนเงิน", tone: "slate" },
    };

    return map[status];
}

function statusChipSX(tone: ReturnType<typeof getPayStatusMeta>["tone"]) {
    if (tone === "amber") {
        return {
            border: "1px solid rgb(253 230 138)",
            bgcolor: "rgb(254 243 199)",
            color: "rgb(146 64 14)",
        };
    }
    if (tone === "emerald") {
        return {
            border: "1px solid rgb(167 243 208)",
            bgcolor: "rgb(209 250 229)",
            color: "rgb(6 95 70)",
        };
    }
    if (tone === "rose") {
        return {
            border: "1px solid rgb(254 202 202)",
            bgcolor: "rgb(254 226 226)",
            color: "rgb(153 27 27)",
        };
    }
    return {
        border: "1px solid rgb(226 232 240)",
        bgcolor: "rgb(248 250 252)",
        color: "rgb(51 65 85)",
    };
}

function StatusChip({ s }: { s: PayStatus }) {
    const meta = getPayStatusMeta(s);
    return <Chip size="small" label={meta.label} sx={statusChipSX(meta.tone)} />;
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
            <Typography className="text-sm font-extrabold text-slate-900">{title}</Typography>
            <Divider className="my-3 border-slate-200!" />
            <Stack spacing={2}>{children}</Stack>
        </Box>
    );
}

export default function AdminPaymentsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [rowsData, setRowsData] = React.useState<PaymentRow[]>(SEED);
    const [status, setStatus] = React.useState<PayStatus | "all">("all");

    const [drawerMode, setDrawerMode] = React.useState<DrawerMode>(null);
    const [selectedPaymentId, setSelectedPaymentId] = React.useState<string | null>(null);
    const [nextStatus, setNextStatus] = React.useState<PayStatus>("pending");

    const [snack, setSnack] = React.useState<{
        open: boolean;
        msg: string;
        type: "success" | "error" | "info";
    }>({
        open: false,
        msg: "",
        type: "success",
    });

    const rows = React.useMemo(() => {
        return rowsData.filter((r) => (status === "all" ? true : r.status === status));
    }, [status, rowsData]);

    const selectedPayment = React.useMemo(
        () => rowsData.find((r) => r.id === selectedPaymentId) ?? null,
        [rowsData, selectedPaymentId]
    );

    const openDetailDrawer = (payment: PaymentRow) => {
        setSelectedPaymentId(payment.id);
        setDrawerMode("detail");
    };

    const openStatusDrawer = (payment: PaymentRow) => {
        setSelectedPaymentId(payment.id);
        setNextStatus(payment.status);
        setDrawerMode("status");
    };

    const closeDrawer = () => {
        setDrawerMode(null);
    };

    const handleDrawerExited = () => {
        setSelectedPaymentId(null);
        setNextStatus("pending");
    };

    const savePaymentStatus = () => {
        if (!selectedPayment) return;

        setRowsData((prev) =>
            prev.map((item) =>
                item.id === selectedPayment.id
                    ? {
                          ...item,
                          status: nextStatus,
                      }
                    : item
            )
        );

        setDrawerMode(null);
        setSnack({
            open: true,
            msg: `อัปเดตสถานะเป็น "${getPayStatusMeta(nextStatus).label}" เรียบร้อย`,
            type: "success",
        });
    };

    const quickActions: Array<{
        label: string;
        status: PayStatus;
        variant: "contained" | "outlined";
        icon: React.ReactNode;
        sx: object;
    }> = [
        {
            label: "สำเร็จ",
            status: "success",
            variant: "contained",
            icon: <CheckCircleRoundedIcon />,
            sx: {
                bgcolor: "rgb(22 163 74)",
                boxShadow: "none",
                "&:hover": { bgcolor: "rgb(21 128 61)", boxShadow: "none" },
            },
        },
        {
            label: "รอตรวจสอบ",
            status: "pending",
            variant: "outlined",
            icon: <AutorenewRoundedIcon />,
            sx: {
                borderColor: "rgb(253 224 71)",
                color: "rgb(146 64 14)",
                "&:hover": {
                    borderColor: "rgb(234 179 8)",
                    bgcolor: "rgb(254 249 195)",
                },
            },
        },
        {
            label: "ล้มเหลว",
            status: "failed",
            variant: "outlined",
            icon: <ErrorOutlineRoundedIcon />,
            sx: {
                borderColor: "rgb(252 165 165)",
                color: "rgb(185 28 28)",
                "&:hover": {
                    borderColor: "rgb(248 113 113)",
                    bgcolor: "rgb(254 242 242)",
                },
            },
        },
        {
            label: "คืนเงิน",
            status: "refund",
            variant: "outlined",
            icon: <ReplayRoundedIcon />,
            sx: {
                borderColor: "rgb(203 213 225)",
                color: "rgb(71 85 105)",
                "&:hover": {
                    borderColor: "rgb(148 163 184)",
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
                            การชำระเงิน
                        </Typography>
                        <Typography className="text-sm text-slate-600">
                            ติดตามสถานะธุรกรรมและตรวจสอบการชำระเงิน
                        </Typography>
                    </Box>

                    <TextField
                        size="small"
                        select
                        label="สถานะ"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as PayStatus | "all")}
                        className="w-full md:w-55"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                            },
                        }}
                    >
                        <MenuItem value="all">ทั้งหมด</MenuItem>
                        <MenuItem value="pending">รอตรวจสอบ</MenuItem>
                        <MenuItem value="success">สำเร็จ</MenuItem>
                        <MenuItem value="failed">ล้มเหลว</MenuItem>
                        <MenuItem value="refund">คืนเงิน</MenuItem>
                    </TextField>
                </Stack>

                <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                    <CardContent className="p-5">
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            className="items-start sm:items-center justify-between"
                        >
                            <Stack direction="row" spacing={1.25} className="items-center">
                                <Box className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-slate-50">
                                    <PaymentsRoundedIcon fontSize="small" />
                                </Box>

                                <Box>
                                    <Typography className="text-sm font-bold text-slate-900">
                                        ทั้งหมด {rowsData.length} รายการ • กำลังแสดง {rows.length} รายการ
                                    </Typography>
                                    <Typography className="mt-1 text-xs text-slate-500">
                                        ตรวจสอบธุรกรรมที่รอตรวจสอบและรายการที่ล้มเหลวเป็นพิเศษ
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                    <CardContent className="p-0">
                        {rows.map((p, idx) => (
                            <Box key={p.id}>
                                <Box className="p-4 sm:p-5">
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={2}
                                        className="items-start justify-between"
                                        sx={{
                                            alignItems: { xs: "flex-start", md: "stretch" },
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} className="items-start min-w-0 flex-1 w-full">
                                            <Box className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-200 bg-slate-50 shrink-0">
                                                <PaymentsRoundedIcon fontSize="small" />
                                            </Box>

                                            <Box className="min-w-0 flex-1">
                                                <Stack direction="row" spacing={1} className="items-center flex-wrap">
                                                    <Typography className="text-sm font-extrabold text-slate-900 tracking-wide">
                                                        {p.id}
                                                    </Typography>
                                                    <StatusChip s={p.status} />
                                                </Stack>

                                                <Typography className="mt-1 text-lg font-bold text-slate-800">
                                                    Booking {p.bookingId}
                                                </Typography>

                                                <Divider className="my-2 border-slate-200!" />

                                                <Typography className="text-xs text-slate-500">
                                                    วิธีชำระ:{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {paymentMethodLabel(p.method)}
                                                    </span>
                                                </Typography>

                                                <Typography className="mt-1 text-xs text-slate-500">
                                                    วันที่ทำรายการ:{" "}
                                                    <span className="font-medium text-slate-700">{p.createdAt}</span>
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack
                                            spacing={1.5}
                                            className="w-full md:w-auto"
                                            sx={{
                                                minWidth: { md: 220 },
                                                alignSelf: { xs: "stretch", md: "stretch" },
                                            }}
                                        >
                                            <Box className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                                <Typography className="text-xs text-slate-500">
                                                    ยอดชำระ
                                                </Typography>
                                                <Typography className="text-sm font-semibold text-slate-900">
                                                    {formatTHB(p.amount)}
                                                </Typography>
                                            </Box>

                                            <Stack direction="row" spacing={1} className="justify-end" sx={{ mt: { md: "auto" } }}>
                                                <Button
                                                    size="medium"
                                                    variant="outlined"
                                                    onClick={() => openDetailDrawer(p)}
                                                    sx={{
                                                        textTransform: "none",
                                                        borderColor: "rgb(226 232 240)",
                                                        borderRadius: 2.5,
                                                    }}
                                                >
                                                    รายละเอียด
                                                </Button>

                                                <Button
                                                    size="medium"
                                                    variant="contained"
                                                    onClick={() => openStatusDrawer(p)}
                                                    sx={{
                                                        textTransform: "none",
                                                        bgcolor: "rgb(15 23 42)",
                                                        boxShadow: "none",
                                                        borderRadius: 2.5,
                                                        "&:hover": {
                                                            bgcolor: "rgb(2 6 23)",
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    อัปเดตสถานะ
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
                                <Typography className="text-sm text-slate-600">
                                    ไม่พบรายการชำระเงิน
                                </Typography>
                            </Box>
                        ) : null}
                    </CardContent>
                </Card>
            </Box>

            <Drawer
                anchor={isMobile ? "bottom" : "right"}
                open={drawerMode !== null}
                onClose={closeDrawer}
                ModalProps={{
                    keepMounted: true,
                    onTransitionExited: handleDrawerExited,
                }}
                PaperProps={{
                    sx: {
                        width: isMobile ? "100%" : 700,
                        height: isMobile ? "80%" : "100%",
                    },
                }}
            >
                <Box className="p-4">
                    <Stack direction="row" spacing={1.25} className="items-center justify-between">
                        <Stack direction="row" spacing={1.25} className="items-center min-w-0">
                            <Box className="min-w-0">
                                <Typography className="text-sm font-black text-slate-900">
                                    {drawerMode === "detail" ? "รายละเอียดการชำระเงิน" : "อัปเดตสถานะการชำระเงิน"}
                                </Typography>
                                <Typography className="text-xs text-slate-500">
                                    {selectedPayment
                                        ? `${selectedPayment.id} • ${selectedPayment.bookingId}`
                                        : "-"}
                                </Typography>
                            </Box>
                        </Stack>

                        <IconButton onClick={closeDrawer}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>

                    <Divider className="my-4! border-slate-200!" />

                    {drawerMode === "detail" && selectedPayment ? (
                        <Stack spacing={2}>
                            <Box className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <Box
                                    className="relative bg-linear-to-br from-slate-900 to-slate-700"
                                    sx={{ minHeight: 220 }}
                                >
                                    <Box className="grid h-55 w-full place-items-center text-slate-300">
                                        <PaymentsRoundedIcon sx={{ fontSize: 56 }} />
                                    </Box>

                                    <Box
                                        className="absolute inset-0"
                                        sx={{
                                            background:
                                                "linear-gradient(to bottom, rgba(15,23,42,0.82), rgba(15,23,42,0.18))",
                                        }}
                                    />

                                    <Box className="absolute inset-x-0 top-0 p-4 text-white">
                                        <Typography className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                            Payment Overview
                                        </Typography>
                                        <Typography className="mt-2 text-xl font-extrabold">
                                            {selectedPayment.id}
                                        </Typography>
                                        <Typography className="mt-2 text-sm text-slate-200">
                                            Booking {selectedPayment.bookingId} • {paymentMethodLabel(selectedPayment.method)}
                                        </Typography>
                                        <Typography className="mt-4 text-sm text-slate-300">ยอดชำระ</Typography>
                                        <Typography className="text-2xl font-extrabold">
                                            {formatTHB(selectedPayment.amount)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <SectionCard title="ข้อมูลรายการชำระเงิน">
                                    <InfoRow label="รหัสรายการ" value={selectedPayment.id} />
                                    <InfoRow label="Booking ID" value={selectedPayment.bookingId} />
                                    <InfoRow
                                        label="วิธีชำระ"
                                        value={paymentMethodLabel(selectedPayment.method)}
                                    />
                                    <InfoRow label="ยอดชำระ" value={formatTHB(selectedPayment.amount)} />
                                </SectionCard>

                                <SectionCard title="สถานะธุรกรรม">
                                    <InfoRow label="สถานะปัจจุบัน" value={<StatusChip s={selectedPayment.status} />} />
                                    <InfoRow label="วันที่ทำรายการ" value={selectedPayment.createdAt} />
                                </SectionCard>
                            </Box>

                            <Stack direction="row" spacing={1} className="pt-0.5">
                                <Button
                                    fullWidth
                                    size="medium"
                                    variant="outlined"
                                    onClick={closeDrawer}
                                    sx={{
                                        textTransform: "none",
                                        borderColor: "rgb(226 232 240)",
                                        color: "rgb(15 23 42)",
                                        borderRadius: 2.5,
                                    }}
                                >
                                    ปิดหน้าต่าง
                                </Button>
                                <Button
                                    fullWidth
                                    size="medium"
                                    variant="contained"
                                    onClick={() => setDrawerMode("status")}
                                    sx={{
                                        textTransform: "none",
                                        bgcolor: "rgb(15 23 42)",
                                        boxShadow: "none",
                                        borderRadius: 2.5,
                                        "&:hover": {
                                            bgcolor: "rgb(2 6 23)",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    อัปเดตสถานะ
                                </Button>
                            </Stack>
                        </Stack>
                    ) : null}

                    {drawerMode === "status" && selectedPayment ? (
                        <Stack spacing={2}>
                            <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                                <Stack direction="row" spacing={1} className="items-center">
                                    <Typography className="text-sm font-bold text-slate-900">
                                        สถานะปัจจุบัน
                                    </Typography>
                                    <StatusChip s={selectedPayment.status} />
                                </Stack>
                            </Box>

                            <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={1}
                                    className="items-start sm:items-center justify-between"
                                >
                                    <Typography className="text-sm font-bold text-slate-900">
                                        เลือกสถานะใหม่
                                    </Typography>

                                    <Stack direction="row" spacing={1} className="items-center">
                                        <Typography className="text-xs text-slate-500">
                                            จะบันทึกเป็น
                                        </Typography>
                                        <StatusChip s={nextStatus} />
                                    </Stack>
                                </Stack>

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} className="mt-4">
                                    {quickActions.map((action) => {
                                        const isActive = nextStatus === action.status;

                                        return (
                                            <Button
                                                key={action.status}
                                                variant={isActive ? "contained" : action.variant}
                                                startIcon={action.icon}
                                                onClick={() => setNextStatus(action.status)}
                                                sx={{
                                                    flex: 1,
                                                    textTransform: "none",
                                                    borderRadius: 2.5,
                                                    ...(isActive
                                                        ? {
                                                              bgcolor: "rgb(15 23 42)",
                                                              color: "white",
                                                              boxShadow: "none",
                                                              "&:hover": {
                                                                  bgcolor: "rgb(2 6 23)",
                                                                  boxShadow: "none",
                                                              },
                                                          }
                                                        : action.sx),
                                                }}
                                            >
                                                {action.label}
                                            </Button>
                                        );
                                    })}
                                </Stack>
                            </Box>

                            <Stack direction="row" spacing={1} className="pt-0.5">
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={closeDrawer}
                                    sx={{
                                        textTransform: "none",
                                        borderColor: "rgb(226 232 240)",
                                        color: "rgb(15 23 42)",
                                        borderRadius: 2.5,
                                    }}
                                >
                                    ยกเลิก
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={savePaymentStatus}
                                    sx={{
                                        textTransform: "none",
                                        bgcolor: "rgb(15 23 42)",
                                        boxShadow: "none",
                                        borderRadius: 2.5,
                                        "&:hover": {
                                            bgcolor: "rgb(2 6 23)",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    บันทึกสถานะ
                                </Button>
                            </Stack>
                        </Stack>
                    ) : null}
                </Box>
            </Drawer>

            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snack.type}
                    variant="filled"
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    sx={{ borderRadius: 3 }}
                >
                    {snack.msg}
                </Alert>
            </Snackbar>
        </>
    );
}