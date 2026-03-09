"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Switch,
  IconButton,
  Button,
  Stack,
  TextField,
  MenuItem,
  Chip,
  Drawer,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import type { SwitchProps } from "@mui/material/Switch";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExtensionRoundedIcon from "@mui/icons-material/ExtensionRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

type PricingType = "perDay" | "perTrip";
type DrawerMode = "create" | "detail" | "delete" | null;
type AddonFilterStatus = "all" | "active" | "inactive";

type Addon = {
  id: string;
  title: string;
  price: number;
  pricingType: PricingType;
  inventoryTrack: boolean;
  stock: number | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function pricingLabel(t: PricingType) {
  return t === "perDay" ? "ต่อวัน" : "ต่อครั้ง";
}

function formatTHB(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return (
    new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(v) +
    " บาท"
  );
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

function makeNextAddonId(rows: Addon[]) {
  const nums = rows
    .map((r) => Number(r.id.replace(/[^\d]/g, "")))
    .filter((n) => Number.isFinite(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `A${String(next).padStart(3, "0")}`;
}

function getAddonStatusMeta(active: boolean) {
  return active
    ? {
        label: "เปิดใช้งาน",
        tone: "emerald" as const,
      }
    : {
        label: "ปิดใช้งาน",
        tone: "slate" as const,
      };
}

function statusChipSX(tone: "emerald" | "slate") {
  if (tone === "emerald") {
    return {
      border: "1px solid rgb(167 243 208)",
      bgcolor: "rgb(209 250 229)",
      color: "rgb(6 95 70)",
      fontWeight: 700,
    };
  }

  return {
    border: "1px solid rgb(226 232 240)",
    bgcolor: "rgb(248 250 252)",
    color: "rgb(51 65 85)",
    fontWeight: 700,
  };
}

function AddonStatusChip({ active }: { active: boolean }) {
  const meta = getAddonStatusMeta(active);

  return (
    <Chip
      size="medium"
      label={meta.label}
      variant="outlined"
      sx={{
        height: 28,
        fontSize: 12,
        ...statusChipSX(meta.tone),
      }}
    />
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr]">
      <Typography className="text-sm font-medium text-slate-500">
        {label}
      </Typography>
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
      <Typography className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </Typography>
      <Divider className="my-3! border-slate-200!" />
      <Stack spacing={2}>{children}</Stack>
    </Box>
  );
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function AdminAddonsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [addons, setAddons] = React.useState<Addon[]>([
    {
      id: "A001",
      title: "คาร์ซีทเด็ก",
      price: 150,
      pricingType: "perDay",
      inventoryTrack: true,
      stock: 5,
      active: true,
      createdAt: "2026-03-01 09:30",
      updatedAt: "2026-03-02 11:20",
    },
    {
      id: "A002",
      title: "คืนต่างสาขา",
      price: 500,
      pricingType: "perTrip",
      inventoryTrack: false,
      stock: null,
      active: true,
      createdAt: "2026-03-01 10:10",
      updatedAt: "2026-03-01 10:10",
    },
    {
      id: "A003",
      title: "Wi-Fi พกพา",
      price: 100,
      pricingType: "perDay",
      inventoryTrack: true,
      stock: 0,
      active: false,
      createdAt: "2026-03-02 14:10",
      updatedAt: "2026-03-03 08:45",
    },
  ]);

  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<AddonFilterStatus>("all");

  const [drawerMode, setDrawerMode] = React.useState<DrawerMode>(null);
  const [selectedAddonId, setSelectedAddonId] = React.useState<string | null>(
    null
  );

  const [editTitle, setEditTitle] = React.useState("");
  const [editPrice, setEditPrice] = React.useState<number>(0);
  const [editPricingType, setEditPricingType] =
    React.useState<PricingType>("perDay");
  const [editInventoryTrack, setEditInventoryTrack] = React.useState(false);
  const [editStock, setEditStock] = React.useState<number | null>(null);
  const [editActive, setEditActive] = React.useState(true);

  const [snack, setSnack] = React.useState<{
    open: boolean;
    msg: string;
    type: "success" | "error" | "info";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  const roundedFieldSX = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  };

  const activeCount = addons.filter((a) => a.active).length;

  const selectedAddon = React.useMemo(
    () => addons.find((a) => a.id === selectedAddonId) ?? null,
    [addons, selectedAddonId]
  );

  const rows = React.useMemo(() => {
    return addons.filter((a) => {
      const keyword = q.trim().toLowerCase();
      const okQ =
        !keyword ||
        a.id.toLowerCase().includes(keyword) ||
        a.title.toLowerCase().includes(keyword) ||
        pricingLabel(a.pricingType).toLowerCase().includes(keyword);

      const okStatus =
        status === "all" ? true : status === "active" ? a.active : !a.active;

      return okQ && okStatus;
    });
  }, [addons, q, status]);

  const openCreateDrawer = () => {
    setSelectedAddonId(null);
    setEditTitle("");
    setEditPrice(0);
    setEditPricingType("perDay");
    setEditInventoryTrack(false);
    setEditStock(null);
    setEditActive(true);
    setDrawerMode("create");
  };

  const openDetailDrawer = (addon: Addon) => {
    setSelectedAddonId(addon.id);
    setEditTitle(addon.title);
    setEditPrice(addon.price);
    setEditPricingType(addon.pricingType);
    setEditInventoryTrack(addon.inventoryTrack);
    setEditStock(addon.stock);
    setEditActive(addon.active);
    setDrawerMode("detail");
  };

  const openDeleteDrawer = (addon: Addon) => {
    setSelectedAddonId(addon.id);
    setDrawerMode("delete");
  };

  const closeDrawer = () => {
    setDrawerMode(null);
  };

  const handleDrawerExited = () => {
    setSelectedAddonId(null);
    setEditTitle("");
    setEditPrice(0);
    setEditPricingType("perDay");
    setEditInventoryTrack(false);
    setEditStock(null);
    setEditActive(true);
  };

  const removeAddon = (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
    setSnack({
      open: true,
      msg: "ลบบริการเสริมแล้ว",
      type: "info",
    });
  };

  const saveAddonDetail = () => {
    if (!selectedAddon) return;

    if (!editTitle.trim()) {
      setSnack({
        open: true,
        msg: "กรุณาระบุชื่อบริการ",
        type: "error",
      });
      return;
    }

    const now = getNowString();

    setAddons((prev) =>
      prev.map((a) =>
        a.id === selectedAddon.id
          ? {
              ...a,
              title: editTitle.trim(),
              price: Number(editPrice) || 0,
              pricingType: editPricingType,
              inventoryTrack: editInventoryTrack,
              stock: editInventoryTrack ? Number(editStock ?? 0) : null,
              active: editActive,
              updatedAt: now,
            }
          : a
      )
    );

    setSnack({
      open: true,
      msg: "บันทึกข้อมูลบริการเสริมเรียบร้อย",
      type: "success",
    });
    setDrawerMode(null);
  };

  const createAddon = () => {
    if (!editTitle.trim()) {
      setSnack({
        open: true,
        msg: "กรุณาระบุชื่อบริการ",
        type: "error",
      });
      return;
    }

    const now = getNowString();

    const newAddon: Addon = {
      id: makeNextAddonId(addons),
      title: editTitle.trim(),
      price: Number(editPrice) || 0,
      pricingType: editPricingType,
      inventoryTrack: editInventoryTrack,
      stock: editInventoryTrack ? Number(editStock ?? 0) : null,
      active: editActive,
      createdAt: now,
      updatedAt: now,
    };

    setAddons((prev) => [newAddon, ...prev]);
    setSnack({
      open: true,
      msg: "เพิ่มบริการเสริมใหม่เรียบร้อย",
      type: "success",
    });
    setDrawerMode(null);
  };

  const saveAddonForm = () => {
    if (drawerMode === "create") {
      createAddon();
      return;
    }

    saveAddonDetail();
  };

  return (
    <>
      <Box className="grid gap-4">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          className="items-start md:items-center justify-between"
        >
          <Box>
            <Typography
              variant="h6"
              className="text-xl font-extrabold text-slate-900"
            >
              บริการเสริม
            </Typography>
            <Typography className="text-sm text-slate-600">
              จัดการราคา รูปแบบการคิดเงิน และสถานะการใช้งานของบริการเสริม
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            className="w-full md:w-auto"
          >
            <TextField
              size="small"
              label="ค้นหา (รหัส/ชื่อบริการ)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full sm:w-70"
              sx={roundedFieldSX}
            />

            <TextField
              size="small"
              select
              label="สถานะ"
              value={status}
              onChange={(e) => setStatus(e.target.value as AddonFilterStatus)}
              className="w-full sm:w-45"
              sx={roundedFieldSX}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="active">เปิดใช้งาน</MenuItem>
              <MenuItem value="inactive">ปิดใช้งาน</MenuItem>
            </TextField>

            <Button
              variant="contained"
              size="medium"
              onClick={openCreateDrawer}
              startIcon={<AddRoundedIcon />}
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
              เพิ่มบริการเสริม
            </Button>
          </Stack>
        </Stack>

        <Card
          elevation={0}
          className="rounded-2xl! border border-slate-200 bg-white"
        >
          <CardContent className="p-4!">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              className="items-start sm:items-center justify-between"
            >
              <Stack direction="row" spacing={1.25} className="items-center">
                <Box className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200">
                  <ExtensionRoundedIcon fontSize="medium" />
                </Box>

                <Box>
                  <Typography className="text-sm font-bold text-slate-900">
                    ทั้งหมด {addons.length} รายการ • เปิดใช้งาน {activeCount}{" "}
                    รายการ
                  </Typography>
                  <Typography className="mt-1 text-xs text-slate-500">
                    แนะนำให้เปิดตัดสต็อกเฉพาะบริการที่มีจำนวนจำกัด
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          className="rounded-2xl! border border-slate-200 bg-white"
        >
          <CardContent className="p-0">
            <Box className="grid">
              {rows.map((a, idx) => (
                <Box key={a.id}>
                  <Box className="p-4 sm:p-5">
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      className="items-start justify-between"
                    >
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        className="min-w-0 flex-1 w-full"
                      >
                        <Box
                          className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                          sx={{
                            width: {
                              xs: "100%",
                              md: 220,
                              lg: 260,
                            },
                            height: {
                              xs: 150,
                              sm: 180,
                              md: 150,
                              lg: 170,
                            },
                          }}
                        >
                          <Box className="grid h-full w-full place-items-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-500">
                            <Inventory2RoundedIcon sx={{ fontSize: 42 }} />
                          </Box>
                        </Box>

                        <Box className="min-w-0 flex-1">
                          <Stack
                            direction="row"
                            spacing={1.5}
                            className="items-center flex-wrap"
                          >
                            <Typography className="text-sm font-extrabold text-slate-900 tracking-wide">
                              {a.id}
                            </Typography>

                            <AddonStatusChip active={a.active} />

                            <Chip
                              size="medium"
                              label={pricingLabel(a.pricingType)}
                              variant="outlined"
                            />
                          </Stack>

                          <Typography className="mt-1 text-lg font-bold text-slate-800">
                            {a.title}
                          </Typography>

                          <Divider className="my-2! border-slate-200!" />

                          <Typography className="text-xs text-slate-500">
                            ราคา:{" "}
                            <span className="font-medium text-slate-700">
                              {formatTHB(a.price)}
                            </span>
                            {" • "}
                            รูปแบบคิดเงิน:{" "}
                            <span className="font-medium text-slate-700">
                              {pricingLabel(a.pricingType)}
                            </span>
                          </Typography>

                          <Typography className="mt-1 text-xs text-slate-500">
                            ระบบสต็อก:{" "}
                            <span className="font-medium text-slate-700">
                              {a.inventoryTrack
                                ? `ตัดสต็อก • คงเหลือ ${a.stock ?? 0}`
                                : "ไม่ตัดสต็อก"}
                            </span>
                          </Typography>

                          <Typography className="mt-1 text-xs text-slate-500">
                            สร้างเมื่อ{" "}
                            <span className="font-medium text-slate-700">
                              {a.createdAt ?? "-"}
                            </span>
                            {" • "}
                            อัปเดตล่าสุด{" "}
                            <span className="font-medium text-slate-700">
                              {a.updatedAt ?? "-"}
                            </span>
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        spacing={1.5}
                        className="w-full md:w-auto"
                        sx={{
                          minWidth: { md: 220 },
                        }}
                      >
                        <Box className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <Typography className="text-xs text-slate-500">
                            ราคา
                          </Typography>
                          <Typography className="text-sm font-semibold text-slate-900">
                            {formatTHB(a.price)}
                          </Typography>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          className="justify-end"
                        >
                          <Button
                            size="medium"
                            variant="outlined"
                            color="error"
                            onClick={() => openDeleteDrawer(a)}
                            className="rounded-lg!"
                            sx={{
                              textTransform: "none",
                              borderRadius: 2.5,
                            }}
                          >
                            ลบรายการ
                          </Button>

                          <Button
                            size="medium"
                            variant="contained"
                            onClick={() => openDetailDrawer(a)}
                            className="rounded-lg!"
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
                            จัดการบริการเสริม
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
            height: isMobile ? "88%" : "100%",
            borderTopLeftRadius: isMobile ? 18 : 0,
            borderTopRightRadius: isMobile ? 18 : 0,
            overflow: "hidden",
            bgcolor: "rgb(248 250 252)",
          },
        }}
      >
        <Box className="flex h-full flex-col">
          {/* Topbar */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              borderBottom: "1px solid rgb(226 232 240)",
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
            }}
          >
            {isMobile ? (
              <Box className="flex justify-center pt-2">
                <Box className="h-1.5 w-12 rounded-full bg-slate-300" />
              </Box>
            ) : null}

            <Box className="px-4 py-3">
              <Stack
                direction="row"
                spacing={1.5}
                className="items-center justify-between"
              >
                <Stack
                  direction="row"
                  spacing={1.25}
                  className="items-center min-w-0"
                >
                  <Box
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200"
                    sx={{
                      bgcolor:
                        drawerMode === "create"
                          ? "rgb(239 246 255)"
                          : drawerMode === "delete"
                          ? "rgb(254 242 242)"
                          : "rgb(241 245 249)",
                      color:
                        drawerMode === "create"
                          ? "rgb(3 105 161)"
                          : drawerMode === "delete"
                          ? "rgb(185 28 28)"
                          : "rgb(15 23 42)",
                    }}
                  >
                    {drawerMode === "create" ? (
                      <Inventory2RoundedIcon sx={{ fontSize: 20 }} />
                    ) : drawerMode === "delete" ? (
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <Inventory2RoundedIcon sx={{ fontSize: 20 }} />
                    )}
                  </Box>

                  <Box className="min-w-0">
                    <Typography className="truncate text-sm font-black text-slate-900">
                      {drawerMode === "create"
                        ? "เพิ่มบริการเสริมใหม่"
                        : drawerMode === "delete"
                        ? "ยืนยันการลบบริการ"
                        : "แก้ไขบริการเสริม"}
                    </Typography>

                    <Typography className="truncate text-xs text-slate-500">
                      {drawerMode === "create"
                        ? "กรอกข้อมูลบริการใหม่"
                        : drawerMode === "delete"
                        ? "ตรวจสอบข้อมูลก่อนลบรายการ"
                        : selectedAddon
                        ? `${selectedAddon.id} • ${selectedAddon.title}`
                        : "-"}
                    </Typography>
                  </Box>
                </Stack>

                <IconButton
                  onClick={closeDrawer}
                  sx={{
                    border: "1px solid rgb(226 232 240)",
                    bgcolor: "white",
                    "&:hover": {
                      bgcolor: "rgb(248 250 252)",
                    },
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          {/* Content */}
          <Box className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {(drawerMode === "create" ||
              (drawerMode === "detail" && selectedAddon)) && (
              <Stack spacing={2}>
                <Box className="overflow-hidden rounded-2xl border border-slate-200 bg-white mb-1">
                  <Box
                    className="relative bg-linear-to-br from-slate-900 to-slate-700"
                    sx={{ minHeight: 220 }}
                  >
                    <Box className="grid h-55 w-full place-items-center text-slate-300">
                      <Inventory2RoundedIcon sx={{ fontSize: 56 }} />
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
                        {drawerMode === "create"
                          ? "New Addon"
                          : "Addon Overview"}
                      </Typography>

                      <Typography className="mt-2 text-xl font-extrabold">
                        {editTitle || "บริการเสริม"}
                      </Typography>

                      <Typography className="mt-2 text-sm text-slate-200">
                        {pricingLabel(editPricingType)} •{" "}
                        {editInventoryTrack ? "ตัดสต็อก" : "ไม่ตัดสต็อก"}
                      </Typography>

                      <Typography className="mt-4 text-sm text-slate-300">
                        ราคา
                      </Typography>
                      <Typography className="text-2xl font-extrabold">
                        {formatTHB(Number(editPrice) || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SectionCard title="ข้อมูลหลัก">
                    <TextField
                      fullWidth
                      label="ชื่อบริการ"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      sx={roundedFieldSX}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="ราคา"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      sx={roundedFieldSX}
                    />
                  </SectionCard>

                  <SectionCard title="รูปแบบการคิดราคา">
                    <TextField
                      select
                      fullWidth
                      label="คิดราคาแบบ"
                      value={editPricingType}
                      onChange={(e) =>
                        setEditPricingType(e.target.value as PricingType)
                      }
                      sx={roundedFieldSX}
                    >
                      <MenuItem value="perDay">ต่อวัน</MenuItem>
                      <MenuItem value="perTrip">ต่อครั้ง</MenuItem>
                    </TextField>

                    <InfoRow
                      label="ราคาแสดงผล"
                      value={formatTHB(Number(editPrice) || 0)}
                    />
                  </SectionCard>

                  <SectionCard title="คลังสินค้า">
                    <Stack
                      direction="row"
                      spacing={1}
                      className="items-center justify-between"
                    >
                      <Typography className="text-sm font-medium text-slate-700">
                        ตัดสต็อก
                      </Typography>
                      <IOSSwitch
                        checked={editInventoryTrack}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEditInventoryTrack(checked);
                          setEditStock(checked ? editStock ?? 0 : null);
                        }}
                      />
                    </Stack>

                    {editInventoryTrack ? (
                      <TextField
                        fullWidth
                        type="number"
                        label="จำนวนคงเหลือ"
                        value={editStock ?? 0}
                        onChange={(e) => setEditStock(Number(e.target.value))}
                        inputProps={{ min: 0 }}
                        sx={roundedFieldSX}
                      />
                    ) : (
                      <Typography className="text-xs text-slate-500">
                        เมื่อปิดตัดสต็อก
                        ระบบจะไม่ตรวจสอบจำนวนคงเหลือของบริการนี้
                      </Typography>
                    )}
                  </SectionCard>

                  <SectionCard title="การใช้งาน">
                    <Stack
                      direction="row"
                      spacing={1}
                      className="items-center justify-between"
                    >
                      <Typography className="text-sm font-medium text-slate-700">
                        เปิดใช้งาน
                      </Typography>
                      <IOSSwitch
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                      />
                    </Stack>

                    <InfoRow
                      label="สถานะ"
                      value={<AddonStatusChip active={editActive} />}
                    />
                  </SectionCard>

                  {drawerMode === "detail" && selectedAddon ? (
                    <>
                      <SectionCard title="ข้อมูลระบบ">
                        <InfoRow label="รหัสบริการ" value={selectedAddon.id} />
                        <InfoRow
                          label="วันที่สร้าง"
                          value={selectedAddon.createdAt ?? "-"}
                        />
                        <InfoRow
                          label="อัปเดตล่าสุด"
                          value={selectedAddon.updatedAt ?? "-"}
                        />
                      </SectionCard>

                      <SectionCard title="สรุปข้อมูลบริการ">
                        <InfoRow
                          label="ชื่อบริการ"
                          value={selectedAddon.title}
                        />
                        <InfoRow
                          label="คิดราคาแบบ"
                          value={pricingLabel(selectedAddon.pricingType)}
                        />
                        <InfoRow
                          label="ระบบสต็อก"
                          value={
                            selectedAddon.inventoryTrack
                              ? `ตัดสต็อก • คงเหลือ ${selectedAddon.stock ?? 0}`
                              : "ไม่ตัดสต็อก"
                          }
                        />
                        <InfoRow
                          label="สถานะ"
                          value={
                            <AddonStatusChip active={selectedAddon.active} />
                          }
                        />
                      </SectionCard>
                    </>
                  ) : null}
                </Box>

                <Stack direction="row" spacing={2} className="pt-0.5">
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
                    onClick={saveAddonForm}
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
                    {drawerMode === "create" ? "เพิ่มบริการ" : "บันทึกข้อมูล"}
                  </Button>
                </Stack>
              </Stack>
            )}

            {drawerMode === "delete" && selectedAddon ? (
              <Stack spacing={2}>
                <Box className="overflow-hidden rounded-2xl border border-red-200 bg-white mb-1">
                  <Box
                    className="relative bg-linear-to-br from-red-900 to-rose-700"
                    sx={{ minHeight: 220 }}
                  >
                    <Box className="grid h-55 w-full place-items-center text-red-100">
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Box
                      className="absolute inset-0"
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(127,29,29,0.82), rgba(127,29,29,0.18))",
                      }}
                    />

                    <Box className="absolute inset-x-0 top-0 p-4 text-white">
                      <Typography className="text-xs font-semibold uppercase tracking-[0.2em] text-red-100/80">
                        Delete Addon
                      </Typography>

                      <Typography className="mt-2 text-xl font-extrabold">
                        ยืนยันการลบบริการเสริม
                      </Typography>

                      <Typography className="mt-2 text-sm text-red-100">
                        รายการนี้จะถูกลบออกจากระบบทันที
                      </Typography>

                      <Typography className="mt-4 text-sm text-red-100/80">
                        รายการที่เลือก
                      </Typography>
                      <Typography className="text-2xl font-extrabold">
                        {selectedAddon.title}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SectionCard title="ข้อมูลรายการ">
                    <InfoRow label="รหัสบริการ" value={selectedAddon.id} />
                    <InfoRow label="ชื่อบริการ" value={selectedAddon.title} />
                    <InfoRow
                      label="ราคา"
                      value={formatTHB(selectedAddon.price)}
                    />
                    <InfoRow
                      label="คิดราคาแบบ"
                      value={pricingLabel(selectedAddon.pricingType)}
                    />
                  </SectionCard>

                  <SectionCard title="ผลกระทบ">
                    <Typography className="text-sm text-slate-700">
                      เมื่อลบแล้ว รายการนี้จะไม่สามารถใช้งานในการจองใหม่ได้
                    </Typography>
                    <Typography className="text-sm text-slate-700">
                      ตรวจสอบให้แน่ใจก่อนดำเนินการ
                    </Typography>
                  </SectionCard>
                </Box>

                <Stack direction="row" spacing={2} className="pt-0.5">
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
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => {
                      removeAddon(selectedAddon.id);
                      closeDrawer();
                    }}
                    sx={{
                      textTransform: "none",
                      boxShadow: "none",
                      borderRadius: 2.5,
                    }}
                  >
                    ยืนยันการลบ
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: 24 }}
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
