"use client";

import * as React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
    Divider,
    Button,
    Drawer,
    IconButton,
    Snackbar,
    Alert,
    TextField,
    MenuItem,
    Switch,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

type DiscountType = "percent" | "fixed";
type DrawerMode = "create" | "detail" | "status" | null;

type Promo = {
    id: string;
    code: string;
    title: string;
    discountType: DiscountType;
    discountValue: number;
    expires: string;
    usageCount: number;
    usageLimit: number;
    active: boolean;
};

const SEED: Promo[] = [
    {
        id: "P1",
        code: "NEW10",
        title: "ส่วนลดลูกค้าใหม่",
        discountType: "percent",
        discountValue: 10,
        expires: "2026-06-30",
        usageCount: 0,
        usageLimit: 100,
        active: true,
    },
    {
        id: "P2",
        code: "WEEKEND200",
        title: "โปรสุดสัปดาห์",
        discountType: "fixed",
        discountValue: 200,
        expires: "2026-12-31",
        usageCount: 12,
        usageLimit: 500,
        active: true,
    },
];

function makeNextPromoId(rows: Promo[]) {
    const nums = rows
        .map((r) => Number(r.id.replace(/[^\d]/g, "")))
        .filter((n) => Number.isFinite(n));
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `P${next}`;
}

function formatTHB(n: number) {
    const v = Number.isFinite(n) ? n : 0;
    return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(v) + " บาท";
}

function formatDiscount(type: DiscountType, value: number) {
    if (type === "percent") return `ลด ${value}%`;
    return `ลด ${formatTHB(value)}`;
}

function usageLabel(usageCount: number, usageLimit: number) {
    return `${usageCount}/${usageLimit}`;
}

function PromoStatusChip({ active }: { active: boolean }) {
    return (
        <Chip
            size="small"
            label={active ? "Active" : "Inactive"}
            sx={{
                height: 22,
                fontSize: 11,
                bgcolor: active ? "rgb(226 232 240)" : "rgb(241 245 249)",
                border: "1px solid rgb(226 232 240)",
                color: "rgb(30 41 59)",
                fontWeight: 800,
            }}
        />
    );
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

export default function AdminPromotionsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [rowsData, setRowsData] = React.useState<Promo[]>(SEED);

    const [drawerMode, setDrawerMode] = React.useState<DrawerMode>(null);
    const [selectedPromoId, setSelectedPromoId] = React.useState<string | null>(null);

    const [editCode, setEditCode] = React.useState("");
    const [editTitle, setEditTitle] = React.useState("");
    const [editDiscountType, setEditDiscountType] = React.useState<DiscountType>("percent");
    const [editDiscountValue, setEditDiscountValue] = React.useState<number>(0);
    const [editExpires, setEditExpires] = React.useState("");
    const [editUsageLimit, setEditUsageLimit] = React.useState<number>(100);
    const [editActive, setEditActive] = React.useState(true);

    const [nextActive, setNextActive] = React.useState(true);

    const [snack, setSnack] = React.useState<{
        open: boolean;
        msg: string;
        type: "success" | "error" | "info";
    }>({
        open: false,
        msg: "",
        type: "success",
    });

    const selectedPromo = React.useMemo(
        () => rowsData.find((item) => item.id === selectedPromoId) ?? null,
        [rowsData, selectedPromoId]
    );

    const activeCount = rowsData.filter((p) => p.active).length;

    const roundedFieldSX = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
        },
    };

    const openCreateDrawer = () => {
        setSelectedPromoId(null);
        setEditCode("");
        setEditTitle("");
        setEditDiscountType("percent");
        setEditDiscountValue(0);
        setEditExpires("");
        setEditUsageLimit(100);
        setEditActive(true);
        setDrawerMode("create");
    };

    const openDetailDrawer = (promo: Promo) => {
        setSelectedPromoId(promo.id);
        setEditCode(promo.code);
        setEditTitle(promo.title);
        setEditDiscountType(promo.discountType);
        setEditDiscountValue(promo.discountValue);
        setEditExpires(promo.expires);
        setEditUsageLimit(promo.usageLimit);
        setEditActive(promo.active);
        setDrawerMode("detail");
    };

    const openStatusDrawer = (promo: Promo) => {
        setSelectedPromoId(promo.id);
        setNextActive(promo.active);
        setDrawerMode("status");
    };

    const closeDrawer = () => {
        setDrawerMode(null);
    };

    const handleDrawerExited = () => {
        setSelectedPromoId(null);
        setEditCode("");
        setEditTitle("");
        setEditDiscountType("percent");
        setEditDiscountValue(0);
        setEditExpires("");
        setEditUsageLimit(100);
        setEditActive(true);
        setNextActive(true);
    };

    const savePromoDetail = () => {
        if (!selectedPromo) return;

        if (!editCode.trim() || !editTitle.trim()) {
            setSnack({ open: true, msg: "กรุณากรอกรหัสและชื่อโปรโมชัน", type: "error" });
            return;
        }

        setRowsData((prev) =>
            prev.map((item) =>
                item.id === selectedPromo.id
                    ? {
                        ...item,
                        code: editCode.trim().toUpperCase(),
                        title: editTitle.trim(),
                        discountType: editDiscountType,
                        discountValue: Number(editDiscountValue) || 0,
                        expires: editExpires,
                        usageLimit: Number(editUsageLimit) || 0,
                        active: editActive,
                    }
                    : item
            )
        );

        setDrawerMode(null);
        setSnack({ open: true, msg: "บันทึกโปรโมชันเรียบร้อย", type: "success" });
    };

    const createPromo = () => {
        if (!editCode.trim() || !editTitle.trim()) {
            setSnack({ open: true, msg: "กรุณากรอกรหัสและชื่อโปรโมชัน", type: "error" });
            return;
        }

        const newPromo: Promo = {
            id: makeNextPromoId(rowsData),
            code: editCode.trim().toUpperCase(),
            title: editTitle.trim(),
            discountType: editDiscountType,
            discountValue: Number(editDiscountValue) || 0,
            expires: editExpires,
            usageCount: 0,
            usageLimit: Number(editUsageLimit) || 0,
            active: editActive,
        };

        setRowsData((prev) => [newPromo, ...prev]);
        setDrawerMode(null);
        setSnack({ open: true, msg: "สร้างโปรโมชันใหม่เรียบร้อย", type: "success" });
    };

    const savePromoForm = () => {
        if (drawerMode === "create") {
            createPromo();
            return;
        }
        savePromoDetail();
    };

    const savePromoStatus = () => {
        if (!selectedPromo) return;

        setRowsData((prev) =>
            prev.map((item) =>
                item.id === selectedPromo.id
                    ? {
                        ...item,
                        active: nextActive,
                    }
                    : item
            )
        );

        setDrawerMode(null);
        setSnack({
            open: true,
            msg: nextActive ? "เปิดใช้งานโปรโมชันแล้ว" : "ปิดใช้งานโปรโมชันแล้ว",
            type: "success",
        });
    };

    const quickActions = [
        {
            label: "เปิดใช้งาน",
            value: true,
            icon: <CheckCircleRoundedIcon />,
            variant: "contained" as const,
            sx: {
                bgcolor: "rgb(22 163 74)",
                boxShadow: "none",
                "&:hover": { bgcolor: "rgb(21 128 61)", boxShadow: "none" },
            },
        },
        {
            label: "ปิดใช้งาน",
            value: false,
            icon: <VisibilityOffRoundedIcon />,
            variant: "outlined" as const,
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
                            โปรโมชัน
                        </Typography>
                        <Typography className="text-sm text-slate-600">
                            จัดการคูปอง โค้ดส่วนลด และโปรโมชัน
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={openCreateDrawer}
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
                        + สร้างโปรโมชัน
                    </Button>
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
                                    <LocalOfferRoundedIcon fontSize="small" />
                                </Box>

                                <Box>
                                    <Typography className="text-sm font-bold text-slate-900">
                                        ทั้งหมด {rowsData.length} โปรโมชัน • เปิดใช้งาน {activeCount} โปรโมชัน
                                    </Typography>
                                    <Typography className="mt-1 text-xs text-slate-500">
                                        ควรตรวจสอบวันหมดอายุและจำนวนการใช้งานเป็นประจำ
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card elevation={0} className="rounded-2xl! border border-slate-200 bg-white">
                    <CardContent className="p-0">
                        {rowsData.map((p, idx) => (
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
                                                <LocalOfferRoundedIcon fontSize="small" />
                                            </Box>

                                            <Box className="min-w-0 flex-1">
                                                <Stack direction="row" spacing={1} className="items-center flex-wrap">
                                                    <Typography className="text-sm font-extrabold text-slate-900 tracking-wide">
                                                        {p.id}
                                                    </Typography>
                                                    <PromoStatusChip active={p.active} />
                                                    <Chip size="small" label={p.code} variant="outlined" />
                                                </Stack>

                                                <Typography className="mt-1 text-lg font-bold text-slate-800">
                                                    {p.title}
                                                </Typography>

                                                <Divider className="my-2 border-slate-200!" />

                                                <Typography className="text-xs text-slate-500">
                                                    ส่วนลด:{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {formatDiscount(p.discountType, p.discountValue)}
                                                    </span>
                                                </Typography>

                                                <Typography className="mt-1 text-xs text-slate-500">
                                                    หมดอายุ:{" "}
                                                    <span className="font-medium text-slate-700">{p.expires}</span>
                                                    {" • "}
                                                    ใช้แล้ว:{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {usageLabel(p.usageCount, p.usageLimit)}
                                                    </span>
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
                                                <Typography className="text-xs text-slate-500">สถานะ</Typography>
                                                <Typography className="text-sm font-semibold text-slate-900">
                                                    {p.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
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
                                                    แก้ไข
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
                                                    จัดการสถานะ
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {idx !== rowsData.length - 1 ? <Divider className="border-slate-200!" /> : null}
                            </Box>
                        ))}

                        {!rowsData.length ? (
                            <Box className="p-8 text-center">
                                <Typography className="text-sm text-slate-600">
                                    ไม่พบโปรโมชัน
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
                                    {drawerMode === "create"
                                        ? "สร้างโปรโมชันใหม่"
                                        : drawerMode === "detail"
                                            ? "แก้ไขโปรโมชัน"
                                            : "จัดการสถานะโปรโมชัน"}
                                </Typography>
                                <Typography className="text-xs text-slate-500">
                                    {drawerMode === "create"
                                        ? "กรอกข้อมูลโปรโมชันใหม่"
                                        : selectedPromo
                                            ? `${selectedPromo.id} • ${selectedPromo.title}`
                                            : "-"}
                                </Typography>
                            </Box>
                        </Stack>

                        <IconButton onClick={closeDrawer}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>

                    <Divider className="my-4! border-slate-200!" />

                    {(drawerMode === "create" || (drawerMode === "detail" && selectedPromo)) ? (
                        <Stack spacing={2}>
                            <Box className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <Box
                                    className="relative bg-linear-to-br from-slate-900 to-slate-700"
                                    sx={{ minHeight: 220 }}
                                >
                                    <Box className="grid h-55 w-full place-items-center text-slate-300">
                                        <LocalOfferRoundedIcon sx={{ fontSize: 56 }} />
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
                                            {drawerMode === "create" ? "New Promotion" : "Promotion Overview"}
                                        </Typography>
                                        <Typography className="mt-2 text-xl font-extrabold">
                                            {editTitle || "โปรโมชันใหม่"}
                                        </Typography>
                                        <Typography className="mt-2 text-sm text-slate-200">
                                            {editCode || "CODE"} • {formatDiscount(editDiscountType, Number(editDiscountValue) || 0)}
                                        </Typography>
                                        <Typography className="mt-4 text-sm text-slate-300">หมดอายุ</Typography>
                                        <Typography className="text-2xl font-extrabold">
                                            {editExpires || "-"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <SectionCard title="ข้อมูลหลัก">
                                    <TextField
                                        fullWidth
                                        label="ชื่อโปรโมชัน"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        sx={roundedFieldSX}
                                    />

                                    <TextField
                                        fullWidth
                                        label="โค้ดส่วนลด"
                                        value={editCode}
                                        onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                                        sx={roundedFieldSX}
                                    />
                                </SectionCard>

                                <SectionCard title="ส่วนลด">
                                    <TextField
                                        select
                                        fullWidth
                                        label="ประเภทส่วนลด"
                                        value={editDiscountType}
                                        onChange={(e) => setEditDiscountType(e.target.value as DiscountType)}
                                        sx={roundedFieldSX}
                                    >
                                        <MenuItem value="percent">เปอร์เซ็นต์</MenuItem>
                                        <MenuItem value="fixed">จำนวนเงิน</MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label={editDiscountType === "percent" ? "ส่วนลด (%)" : "ส่วนลด (บาท)"}
                                        value={editDiscountValue}
                                        onChange={(e) => setEditDiscountValue(Number(e.target.value))}
                                        sx={roundedFieldSX}
                                    />
                                </SectionCard>

                                <SectionCard title="การใช้งาน">
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="วันหมดอายุ"
                                        value={editExpires}
                                        onChange={(e) => setEditExpires(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={roundedFieldSX}
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="จำนวนใช้ได้สูงสุด"
                                        value={editUsageLimit}
                                        onChange={(e) => setEditUsageLimit(Number(e.target.value))}
                                        sx={roundedFieldSX}
                                    />
                                </SectionCard>

                                <SectionCard title="สถานะ">
                                    <Stack direction="row" spacing={1} className="items-center justify-between">
                                        <Typography className="text-sm font-medium text-slate-700">
                                            เปิดใช้งาน
                                        </Typography>
                                        <Switch
                                            checked={editActive}
                                            onChange={(e) => setEditActive(e.target.checked)}
                                            size="small"
                                        />
                                    </Stack>

                                    <InfoRow label="สถานะ" value={<PromoStatusChip active={editActive} />} />
                                </SectionCard>
                            </Box>

                            {drawerMode === "detail" && selectedPromo ? (
                                <SectionCard title="ข้อมูลเพิ่มเติม">
                                    <InfoRow label="รหัสโปรโมชัน" value={selectedPromo.id} />
                                    <InfoRow
                                        label="ใช้งานแล้ว"
                                        value={usageLabel(selectedPromo.usageCount, selectedPromo.usageLimit)}
                                    />
                                </SectionCard>
                            ) : null}

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
                                    onClick={savePromoForm}
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
                                    {drawerMode === "create" ? "สร้างโปรโมชัน" : "บันทึกข้อมูล"}
                                </Button>
                            </Stack>
                        </Stack>
                    ) : null}

                    {drawerMode === "status" && selectedPromo ? (
                        <Stack spacing={2}>
                            <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                                <Stack direction="row" spacing={1} className="items-center">
                                    <Typography className="text-sm font-bold text-slate-900">
                                        สถานะปัจจุบัน
                                    </Typography>
                                    <PromoStatusChip active={selectedPromo.active} />
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
                                        <PromoStatusChip active={nextActive} />
                                    </Stack>
                                </Stack>

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} className="mt-4">
                                    {quickActions.map((action) => {
                                        const isActive = nextActive === action.value;

                                        return (
                                            <Button
                                                key={action.label}
                                                variant={isActive ? "contained" : action.variant}
                                                startIcon={action.icon}
                                                onClick={() => setNextActive(action.value)}
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
                                    onClick={savePromoStatus}
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