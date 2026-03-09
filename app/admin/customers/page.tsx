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
  Snackbar,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type DrawerMode = "detail" | "history" | null;
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type CustomerSegment = "all" | "new" | "regular" | "noRecentBooking";
type CustomerSort = "mostBookings" | "latest" | "name";
type CustomerFlag = "normal" | "watchlist" | "blacklist";
type CustomerFlagFilter = "all" | "normal" | "watchlist" | "blacklist";
type PendingFlagAction = "watchlist" | "blacklist" | "normal" | null;

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  lastBookingId?: string;
  flag: CustomerFlag;
  blacklistReason?: string;
  blacklistAt?: string;
  blacklistedBy?: string;
};

type BookingHistoryRow = {
  id: string;
  customerId: string;
  carName: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: BookingStatus;
};

const INITIAL_CUSTOMERS: CustomerRow[] = [
  {
    id: "u1",
    name: "Pachara",
    phone: "09x-xxx-xxxx",
    email: "pachara@email.com",
    totalBookings: 3,
    lastBookingId: "BK-1003",
    flag: "normal",
  },
  {
    id: "u2",
    name: "Somchai",
    phone: "08x-xxx-xxxx",
    email: "somchai@email.com",
    totalBookings: 1,
    lastBookingId: "BK-1002",
    flag: "watchlist",
  },
  {
    id: "u3",
    name: "Anan",
    phone: "06x-xxx-xxxx",
    email: "anan@email.com",
    totalBookings: 0,
    flag: "blacklist",
    blacklistReason: "คืนรถล่าช้าหลายครั้งและติดต่อยาก",
    blacklistAt: "2026-03-09 14:20",
    blacklistedBy: "Admin",
  },
  {
    id: "u4",
    name: "Suda",
    phone: "09x-xxx-1111",
    email: "suda@email.com",
    totalBookings: 5,
    lastBookingId: "BK-1010",
    flag: "normal",
  },
];

const BOOKING_HISTORY: BookingHistoryRow[] = [
  {
    id: "BK-1001",
    customerId: "u1",
    carName: "BMW 320d M Sport",
    pickupDate: "2026-03-01",
    returnDate: "2026-03-03",
    totalPrice: 2580,
    status: "confirmed",
  },
  {
    id: "BK-1003",
    customerId: "u1",
    carName: "BMW M3 CS",
    pickupDate: "2026-03-03",
    returnDate: "2026-03-05",
    totalPrice: 3980,
    status: "completed",
  },
  {
    id: "BK-1005",
    customerId: "u1",
    carName: "BMW i5 eDrive40 M Sport",
    pickupDate: "2026-03-10",
    returnDate: "2026-03-12",
    totalPrice: 3180,
    status: "pending",
  },
  {
    id: "BK-1002",
    customerId: "u2",
    carName: "BMW 330e M Sport",
    pickupDate: "2026-03-02",
    returnDate: "2026-03-04",
    totalPrice: 2980,
    status: "confirmed",
  },
  {
    id: "BK-1006",
    customerId: "u4",
    carName: "BMW 330e M Sport",
    pickupDate: "2026-02-02",
    returnDate: "2026-02-04",
    totalPrice: 2980,
    status: "completed",
  },
  {
    id: "BK-1007",
    customerId: "u4",
    carName: "BMW M3 CS",
    pickupDate: "2026-02-10",
    returnDate: "2026-02-12",
    totalPrice: 4200,
    status: "completed",
  },
  {
    id: "BK-1008",
    customerId: "u4",
    carName: "BMW i5 eDrive40 M Sport",
    pickupDate: "2026-02-18",
    returnDate: "2026-02-20",
    totalPrice: 3500,
    status: "confirmed",
  },
  {
    id: "BK-1009",
    customerId: "u4",
    carName: "BMW i5 M60 xDrive",
    pickupDate: "2026-02-24",
    returnDate: "2026-02-26",
    totalPrice: 3900,
    status: "completed",
  },
  {
    id: "BK-1010",
    customerId: "u4",
    carName: "BMW 320d M Sport",
    pickupDate: "2026-03-01",
    returnDate: "2026-03-03",
    totalPrice: 2580,
    status: "confirmed",
  },
];

function formatTHB(n: number) {
  const value = Number.isFinite(n) ? n : 0;
  const num = new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(value);
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
      tone: "amber" | "emerald" | "rose" | "slate";
    }
  > = {
    pending: { label: "รอดำเนินการ", tone: "amber" },
    confirmed: { label: "ยืนยันแล้ว", tone: "emerald" },
    completed: { label: "เสร็จสิ้น", tone: "slate" },
    cancelled: { label: "ยกเลิก", tone: "rose" },
  };

  return map[status];
}

function statusChipSX(tone: ReturnType<typeof getStatusMeta>["tone"]) {
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

function StatusChip({ s }: { s: BookingStatus }) {
  const meta = getStatusMeta(s);

  return (
    <Chip
      size="medium"
      label={meta.label}
      variant="outlined"
      sx={statusChipSX(meta.tone)}
    />
  );
}

function customerSegmentMeta(segment: CustomerSegment) {
  const map: Record<
    Exclude<CustomerSegment, "all">,
    { label: string; tone: "sky" | "violet" | "slate" }
  > = {
    new: { label: "ลูกค้าใหม่", tone: "sky" },
    regular: { label: "ลูกค้าประจำ", tone: "violet" },
    noRecentBooking: { label: "ไม่มีการจองล่าสุด", tone: "slate" },
  };

  return map[segment as Exclude<CustomerSegment, "all">];
}

function segmentChipSX(tone: "sky" | "violet" | "slate") {
  if (tone === "sky") {
    return {
      border: "1px solid rgb(186 230 253)",
      bgcolor: "rgb(224 242 254)",
      color: "rgb(3 105 161)",
    };
  }

  if (tone === "violet") {
    return {
      border: "1px solid rgb(221 214 254)",
      bgcolor: "rgb(237 233 254)",
      color: "rgb(91 33 182)",
    };
  }

  return {
    border: "1px solid rgb(226 232 240)",
    bgcolor: "rgb(248 250 252)",
    color: "rgb(51 65 85)",
  };
}

function getCustomerSegment(
  customer: CustomerRow
): Exclude<CustomerSegment, "all"> {
  if (!customer.lastBookingId) return "noRecentBooking";
  if (customer.totalBookings >= 3) return "regular";
  return "new";
}

function CustomerSegmentChip({ customer }: { customer: CustomerRow }) {
  const segment = getCustomerSegment(customer);
  const meta = customerSegmentMeta(segment);

  return (
    <Chip
      size="medium"
      label={meta.label}
      variant="outlined"
      sx={segmentChipSX(meta.tone)}
    />
  );
}

function getCustomerFlagMeta(flag: CustomerFlag) {
  const map: Record<
    CustomerFlag,
    {
      label: string;
      tone: "emerald" | "amber" | "rose";
      icon: React.ReactElement;
    }
  > = {
    normal: {
      label: "ปกติ",
      tone: "emerald",
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />,
    },
    watchlist: {
      label: "เฝ้าระวัง",
      tone: "amber",
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />,
    },
    blacklist: {
      label: "Blacklist",
      tone: "rose",
      icon: <BlockRoundedIcon sx={{ fontSize: 16 }} />,
    },
  };

  return map[flag];
}

function customerFlagChipSX(tone: "emerald" | "amber" | "rose") {
  if (tone === "emerald") {
    return {
      border: "1px solid rgb(167 243 208)",
      bgcolor: "rgb(209 250 229)",
      color: "rgb(6 95 70)",
    };
  }

  if (tone === "amber") {
    return {
      border: "1px solid rgb(253 230 138)",
      bgcolor: "rgb(254 243 199)",
      color: "rgb(146 64 14)",
    };
  }

  return {
    border: "1px solid rgb(254 202 202)",
    bgcolor: "rgb(254 226 226)",
    color: "rgb(153 27 27)",
  };
}

function CustomerFlagChip({ flag }: { flag: CustomerFlag }) {
  const meta = getCustomerFlagMeta(flag);

  return (
    <Chip
      size="medium"
      icon={meta.icon}
      label={meta.label}
      variant="outlined"
      sx={customerFlagChipSX(meta.tone)}
    />
  );
}

function getBookingNumber(bookingId?: string) {
  if (!bookingId) return Number.NEGATIVE_INFINITY;
  const match = bookingId.match(/\d+/g);
  if (!match?.length) return Number.NEGATIVE_INFINITY;
  return Number(match[match.length - 1]);
}

function getResetButtonLabel(flag: CustomerFlag) {
  if (flag === "blacklist") return "ปลด Blacklist";
  if (flag === "watchlist") return "ตั้งเป็นปกติ";
  return "คงสถานะปกติ";
}

function getConfirmMeta(
  action: PendingFlagAction,
  customerName: string,
  reason: string
) {
  if (action === "watchlist") {
    return {
      title: "ยืนยันตั้งเป็นเฝ้าระวัง",
      description: `คุณต้องการตั้งลูกค้า ${customerName} เป็นสถานะเฝ้าระวังใช่หรือไม่`,
      confirmLabel: "ยืนยัน",
      confirmColor: "warning" as const,
    };
  }

  if (action === "blacklist") {
    return {
      title: "ยืนยันตั้งเป็น Blacklist",
      description: `คุณต้องการตั้งลูกค้า ${customerName} เป็น Blacklist ใช่หรือไม่${
        reason.trim() ? `\nเหตุผล: ${reason.trim()}` : ""
      }`,
      confirmLabel: "ยืนยัน Blacklist",
      confirmColor: "error" as const,
    };
  }

  return {
    title: "ยืนยันเปลี่ยนเป็นสถานะปกติ",
    description: `คุณต้องการเปลี่ยนสถานะลูกค้า ${customerName} กลับเป็นปกติใช่หรือไม่`,
    confirmLabel: "ยืนยัน",
    confirmColor: "primary" as const,
  };
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

export default function AdminCustomersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [customers, setCustomers] =
    React.useState<CustomerRow[]>(INITIAL_CUSTOMERS);

  const [q, setQ] = React.useState("");
  const [segment, setSegment] = React.useState<CustomerSegment>("all");
  const [flagFilter, setFlagFilter] = React.useState<CustomerFlagFilter>("all");
  const [sortBy, setSortBy] = React.useState<CustomerSort>("mostBookings");
  const [drawerMode, setDrawerMode] = React.useState<DrawerMode>(null);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<
    string | null
  >(null);
  const [flagReason, setFlagReason] = React.useState("");
  const [pendingAction, setPendingAction] =
    React.useState<PendingFlagAction>(null);

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
    const filtered = customers.filter((r) => {
      const keyword = q.trim().toLowerCase();

      const okQ =
        !keyword ||
        r.name.toLowerCase().includes(keyword) ||
        r.phone.includes(keyword) ||
        r.email.toLowerCase().includes(keyword) ||
        r.id.toLowerCase().includes(keyword);

      const currentSegment = getCustomerSegment(r);
      const okSegment = segment === "all" ? true : currentSegment === segment;
      const okFlag = flagFilter === "all" ? true : r.flag === flagFilter;

      return okQ && okSegment && okFlag;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "mostBookings") {
        if (b.totalBookings !== a.totalBookings) {
          return b.totalBookings - a.totalBookings;
        }
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "latest") {
        const latestA = getBookingNumber(a.lastBookingId);
        const latestB = getBookingNumber(b.lastBookingId);

        if (latestB !== latestA) {
          return latestB - latestA;
        }

        return a.name.localeCompare(b.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [customers, q, segment, flagFilter, sortBy]);

  const selectedCustomer = React.useMemo(
    () => customers.find((r) => r.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  const selectedHistory = React.useMemo(() => {
    return BOOKING_HISTORY.filter(
      (b) => b.customerId === selectedCustomerId
    ).sort((a, b) => getBookingNumber(b.id) - getBookingNumber(a.id));
  }, [selectedCustomerId]);

  React.useEffect(() => {
    setFlagReason(selectedCustomer?.blacklistReason ?? "");
  }, [selectedCustomer]);

  const openDetailDrawer = (customer: CustomerRow) => {
    setSelectedCustomerId(customer.id);
    setDrawerMode("detail");
  };

  const openHistoryDrawer = (customer: CustomerRow) => {
    setSelectedCustomerId(customer.id);
    setDrawerMode("history");
  };

  const closeDrawer = () => {
    setDrawerMode(null);
  };

  const handleDrawerExited = () => {
    setSelectedCustomerId(null);
    setFlagReason("");
    setPendingAction(null);
  };

  const updateCustomerFlag = (
    customerId: string,
    nextFlag: CustomerFlag,
    reason?: string
  ) => {
    const now = getNowString();

    setCustomers((prev) =>
      prev.map((item) => {
        if (item.id !== customerId) return item;

        if (nextFlag === "blacklist") {
          return {
            ...item,
            flag: "blacklist",
            blacklistReason: reason?.trim() || "ระบุพฤติกรรมไม่เหมาะสม",
            blacklistAt: now,
            blacklistedBy: "Admin",
          };
        }

        if (nextFlag === "watchlist") {
          return {
            ...item,
            flag: "watchlist",
            blacklistReason: undefined,
            blacklistAt: undefined,
            blacklistedBy: undefined,
          };
        }

        return {
          ...item,
          flag: "normal",
          blacklistReason: undefined,
          blacklistAt: undefined,
          blacklistedBy: undefined,
        };
      })
    );
  };

  const requestSetWatchlist = () => {
    if (!selectedCustomer) return;

    if (selectedCustomer.flag === "watchlist") {
      setSnack({
        open: true,
        msg: `${selectedCustomer.name} อยู่ในสถานะเฝ้าระวังอยู่แล้ว`,
        type: "info",
      });
      return;
    }

    setPendingAction("watchlist");
  };

  const requestSetBlacklist = () => {
    if (!selectedCustomer) return;

    if (!flagReason.trim()) {
      setSnack({
        open: true,
        msg: "กรุณาระบุเหตุผลในการ Blacklist",
        type: "error",
      });
      return;
    }

    setPendingAction("blacklist");
  };

  const requestResetToNormal = () => {
    if (!selectedCustomer) return;

    if (selectedCustomer.flag === "normal") {
      setSnack({
        open: true,
        msg: `${selectedCustomer.name} อยู่ในสถานะปกติอยู่แล้ว`,
        type: "info",
      });
      return;
    }

    setPendingAction("normal");
  };

  const executePendingAction = () => {
    if (!selectedCustomer || !pendingAction) return;

    if (pendingAction === "watchlist") {
      updateCustomerFlag(selectedCustomer.id, "watchlist");
      setSnack({
        open: true,
        msg: `ตั้ง ${selectedCustomer.name} เป็นเฝ้าระวังแล้ว`,
        type: "success",
      });
      setPendingAction(null);
      return;
    }

    if (pendingAction === "blacklist") {
      updateCustomerFlag(selectedCustomer.id, "blacklist", flagReason);
      setSnack({
        open: true,
        msg: `ตั้ง ${selectedCustomer.name} เป็น Blacklist แล้ว`,
        type: "success",
      });
      setPendingAction(null);
      return;
    }

    updateCustomerFlag(selectedCustomer.id, "normal");
    setSnack({
      open: true,
      msg:
        selectedCustomer.flag === "blacklist"
          ? `ปลด Blacklist ของ ${selectedCustomer.name} แล้ว`
          : `ตั้ง ${selectedCustomer.name} กลับเป็นสถานะปกติแล้ว`,
      type: "success",
    });
    setPendingAction(null);
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.totalBookings > 0).length;
  const newCustomers = customers.filter(
    (c) => getCustomerSegment(c) === "new"
  ).length;
  const regularCustomers = customers.filter(
    (c) => getCustomerSegment(c) === "regular"
  ).length;
  const noRecentCustomers = customers.filter(
    (c) => getCustomerSegment(c) === "noRecentBooking"
  ).length;
  const normalCount = customers.filter((c) => c.flag === "normal").length;
  const watchlistCount = customers.filter((c) => c.flag === "watchlist").length;
  const blacklistCount = customers.filter((c) => c.flag === "blacklist").length;

  const roundedFieldSX = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  };

  const confirmMeta =
    selectedCustomer && pendingAction
      ? getConfirmMeta(pendingAction, selectedCustomer.name, flagReason)
      : null;

  const confirmDrawerOpen = pendingAction !== null && !!selectedCustomer;

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
              ลูกค้า
            </Typography>
            <Typography className="text-sm text-slate-600">
              ดูข้อมูลลูกค้า ประวัติการจอง และสถานะความเสี่ยง
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            className="w-full md:w-auto"
          >
            <TextField
              size="small"
              label="ค้นหา (รหัส/ชื่อ/โทร/อีเมล)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full sm:w-80"
              sx={roundedFieldSX}
            />

            <TextField
              size="small"
              select
              label="กลุ่มลูกค้า"
              value={segment}
              onChange={(e) => setSegment(e.target.value as CustomerSegment)}
              className="w-full sm:w-52"
              sx={roundedFieldSX}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="new">ลูกค้าใหม่</MenuItem>
              <MenuItem value="regular">ลูกค้าประจำ</MenuItem>
              <MenuItem value="noRecentBooking">ไม่มีการจองล่าสุด</MenuItem>
            </TextField>

            <TextField
              size="small"
              select
              label="สถานะลูกค้า"
              value={flagFilter}
              onChange={(e) =>
                setFlagFilter(e.target.value as CustomerFlagFilter)
              }
              className="w-full sm:w-44"
              sx={roundedFieldSX}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="normal">ปกติ</MenuItem>
              <MenuItem value="watchlist">เฝ้าระวัง</MenuItem>
              <MenuItem value="blacklist">Blacklist</MenuItem>
            </TextField>

            <TextField
              size="small"
              select
              label="เรียงตาม"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as CustomerSort)}
              className="w-full sm:w-52"
              sx={roundedFieldSX}
            >
              <MenuItem value="mostBookings">จำนวนการจองมากสุด</MenuItem>
              <MenuItem value="latest">ล่าสุด</MenuItem>
              <MenuItem value="name">ชื่อลูกค้า</MenuItem>
            </TextField>
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
                  <PeopleAltRoundedIcon fontSize="medium" />
                </Box>

                <Box>
                  <Typography className="text-sm font-bold text-slate-900">
                    ทั้งหมด {totalCustomers} คน • มีประวัติการจอง{" "}
                    {activeCustomers} คน
                  </Typography>
                  <Typography className="mt-1 text-xs text-slate-500">
                    ลูกค้าใหม่ {newCustomers} • ลูกค้าประจำ {regularCustomers} •
                    ไม่มีการจองล่าสุด {noRecentCustomers}
                  </Typography>
                  <Typography className="mt-1 text-xs text-slate-500">
                    ปกติ {normalCount} • เฝ้าระวัง {watchlistCount} • Blacklist{" "}
                    {blacklistCount}
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
              {rows.map((c, idx) => (
                <Box key={c.id}>
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
                              xs: 180,
                              sm: 220,
                              md: 150,
                              lg: 170,
                            },
                          }}
                        >
                          <Box className="grid h-full w-full place-items-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-500">
                            <PersonRoundedIcon sx={{ fontSize: 42 }} />
                          </Box>
                        </Box>

                        <Box className="min-w-0 flex-1">
                          <Stack
                            direction="row"
                            spacing={1.5}
                            className="items-center flex-wrap"
                          >
                            <Typography className="text-sm font-extrabold text-slate-900 tracking-wide">
                              {c.id}
                            </Typography>

                            <CustomerFlagChip flag={c.flag} />
                            <CustomerSegmentChip customer={c} />

                            <Chip
                              size="medium"
                              label={`จองทั้งหมด ${c.totalBookings} รายการ`}
                              variant="outlined"
                            />

                            {c.lastBookingId ? (
                              <Chip
                                size="medium"
                                label={`ล่าสุด ${c.lastBookingId}`}
                                variant="outlined"
                              />
                            ) : null}
                          </Stack>

                          <Typography className="mt-1 text-lg font-bold text-slate-800">
                            {c.name}
                          </Typography>

                          <Divider className="my-2! border-slate-200!" />

                          <Typography className="text-xs text-slate-500">
                            เบอร์โทร:{" "}
                            <span className="font-medium text-slate-700">
                              {c.phone}
                            </span>
                          </Typography>

                          <Typography className="mt-1 text-xs text-slate-500">
                            อีเมล:{" "}
                            <span className="font-medium text-slate-700">
                              {c.email}
                            </span>
                          </Typography>

                          {c.flag === "blacklist" && c.blacklistReason ? (
                            <Typography className="mt-2 text-xs text-rose-700">
                              เหตุผล: {c.blacklistReason}
                            </Typography>
                          ) : null}
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
                            จำนวนการจอง
                          </Typography>
                          <Typography className="text-sm font-semibold text-slate-900">
                            {c.totalBookings} รายการ
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
                            onClick={() => openDetailDrawer(c)}
                            className="rounded-lg!"
                            sx={{
                              textTransform: "none",
                              borderColor: "rgb(226 232 240)",
                            }}
                          >
                            ดูรายละเอียด
                          </Button>

                          <Button
                            size="medium"
                            variant="contained"
                            onClick={() => openHistoryDrawer(c)}
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
                            ประวัติการจอง
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
                    ไม่พบข้อมูลลูกค้าที่ตรงกับเงื่อนไข
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
                        drawerMode === "detail"
                          ? "rgb(241 245 249)"
                          : "rgb(239 246 255)",
                    }}
                  >
                    {drawerMode === "detail" ? (
                      <PersonRoundedIcon
                        sx={{ fontSize: 20, color: "rgb(15 23 42)" }}
                      />
                    ) : (
                      <PeopleAltRoundedIcon
                        sx={{ fontSize: 20, color: "rgb(3 105 161)" }}
                      />
                    )}
                  </Box>

                  <Box className="min-w-0">
                    <Typography className="truncate text-sm font-black text-slate-900">
                      {drawerMode === "detail"
                        ? "ข้อมูลลูกค้า"
                        : "ประวัติการจองลูกค้า"}
                    </Typography>

                    <Typography className="truncate text-xs text-slate-500">
                      {selectedCustomer
                        ? `${selectedCustomer.id} • ${selectedCustomer.name}`
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
            {drawerMode === "detail" && selectedCustomer ? (
              <Stack spacing={2}>
                <Box className="overflow-hidden rounded-2xl border border-slate-200 bg-white mb-1">
                  <Box
                    className="relative bg-linear-to-br from-slate-900 to-slate-700"
                    sx={{ minHeight: 220 }}
                  >
                    <Box className="grid h-55 w-full place-items-center text-slate-300">
                      <PersonRoundedIcon sx={{ fontSize: 56 }} />
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
                        Customer Overview
                      </Typography>

                      <Typography className="mt-2 text-xl font-extrabold">
                        {selectedCustomer.name}
                      </Typography>

                      <Typography className="mt-2 text-sm text-slate-200">
                        {selectedCustomer.phone} • {selectedCustomer.email}
                      </Typography>

                      <Typography className="mt-4 text-sm text-slate-300">
                        การจองทั้งหมด
                      </Typography>
                      <Typography className="text-2xl font-extrabold">
                        {selectedCustomer.totalBookings} รายการ
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SectionCard title="ข้อมูลลูกค้า">
                    <InfoRow label="รหัสลูกค้า" value={selectedCustomer.id} />
                    <InfoRow label="ชื่อ" value={selectedCustomer.name} />
                    <InfoRow
                      label="เบอร์โทร"
                      value={
                        <Stack
                          direction="row"
                          spacing={1}
                          className="items-center"
                        >
                          <CallRoundedIcon sx={{ fontSize: 16 }} />
                          <span>{selectedCustomer.phone}</span>
                        </Stack>
                      }
                    />
                    <InfoRow
                      label="อีเมล"
                      value={
                        <Stack
                          direction="row"
                          spacing={1}
                          className="items-center"
                        >
                          <EmailRoundedIcon sx={{ fontSize: 16 }} />
                          <span>{selectedCustomer.email}</span>
                        </Stack>
                      }
                    />
                  </SectionCard>

                  <SectionCard title="สรุปการใช้งาน">
                    <InfoRow
                      label="จำนวนการจอง"
                      value={`${selectedCustomer.totalBookings} รายการ`}
                    />
                    <InfoRow
                      label="รายการล่าสุด"
                      value={selectedCustomer.lastBookingId ?? "-"}
                    />
                    <InfoRow
                      label="กลุ่มลูกค้า"
                      value={
                        <CustomerSegmentChip customer={selectedCustomer} />
                      }
                    />
                    <InfoRow
                      label="สถานะลูกค้า"
                      value={<CustomerFlagChip flag={selectedCustomer.flag} />}
                    />

                    {selectedCustomer.flag === "blacklist" ? (
                      <>
                        <InfoRow
                          label="เหตุผล"
                          value={selectedCustomer.blacklistReason ?? "-"}
                        />
                        <InfoRow
                          label="วันที่บันทึก"
                          value={selectedCustomer.blacklistAt ?? "-"}
                        />
                        <InfoRow
                          label="บันทึกโดย"
                          value={selectedCustomer.blacklistedBy ?? "-"}
                        />
                      </>
                    ) : null}
                  </SectionCard>
                </Box>

                <SectionCard title="จัดการสถานะลูกค้า">
                  <Stack spacing={2}>
                    <InfoRow
                      label="สถานะปัจจุบัน"
                      value={<CustomerFlagChip flag={selectedCustomer.flag} />}
                    />

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="เหตุผลสำหรับ Blacklist"
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      placeholder="เช่น คืนรถล่าช้าซ้ำหลายครั้ง / ติดต่อไม่ได้ / ทำความเสียหายแล้วไม่รับผิดชอบ"
                      sx={roundedFieldSX}
                    />

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.2}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<WarningAmberRoundedIcon />}
                        onClick={requestSetWatchlist}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2.5,
                          borderColor: "rgb(253 224 71)",
                          color: "rgb(146 64 14)",
                          "&:hover": {
                            borderColor: "rgb(234 179 8)",
                            bgcolor: "rgb(254 249 195)",
                          },
                        }}
                      >
                        ตั้งเป็นเฝ้าระวัง
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<BlockRoundedIcon />}
                        onClick={requestSetBlacklist}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2.5,
                        }}
                      >
                        ตั้งเป็น Blacklist
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckCircleRoundedIcon />}
                        onClick={requestResetToNormal}
                        disabled={selectedCustomer.flag === "normal"}
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
                        {getResetButtonLabel(selectedCustomer.flag)}
                      </Button>
                    </Stack>
                  </Stack>
                </SectionCard>

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
                    onClick={() => setDrawerMode("history")}
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
                    ดูประวัติการจอง
                  </Button>
                </Stack>
              </Stack>
            ) : null}

            {drawerMode === "history" && selectedCustomer ? (
              <Stack spacing={2}>
                <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Stack direction="row" spacing={1} className="items-center">
                    <Typography className="text-sm font-bold text-slate-900">
                      ประวัติการจองของ {selectedCustomer.name}
                    </Typography>
                    <Chip
                      size="medium"
                      label={`${selectedHistory.length} รายการ`}
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Box className="rounded-2xl border border-slate-200 bg-white">
                  {selectedHistory.length ? (
                    selectedHistory.map((b, idx) => (
                      <Box key={b.id}>
                        <Box className="p-4">
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            className="items-start md:items-center justify-between"
                          >
                            <Box>
                              <Stack
                                direction="row"
                                spacing={1}
                                className="items-center flex-wrap"
                              >
                                <Typography className="text-sm font-bold text-slate-900">
                                  {b.id}
                                </Typography>
                                <StatusChip s={b.status} />
                              </Stack>

                              <Typography className="mt-1 text-sm font-semibold text-slate-800">
                                {b.carName}
                              </Typography>

                              <Typography className="mt-2 text-xs text-slate-500">
                                รับรถ: {b.pickupDate} • คืนรถ: {b.returnDate}
                              </Typography>
                            </Box>

                            <Box className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                              <Typography className="text-xs text-slate-500">
                                ยอดรวม
                              </Typography>
                              <Typography className="text-sm font-semibold text-slate-900">
                                {formatTHB(b.totalPrice)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {idx !== selectedHistory.length - 1 ? (
                          <Divider className="border-slate-200!" />
                        ) : null}
                      </Box>
                    ))
                  ) : (
                    <Box className="p-8 text-center">
                      <Typography className="text-sm text-slate-600">
                        ยังไม่มีประวัติการจอง
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Stack direction="row" spacing={2} className="pt-0.5">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setDrawerMode("detail")}
                    sx={{
                      textTransform: "none",
                      borderColor: "rgb(226 232 240)",
                      color: "rgb(15 23 42)",
                      borderRadius: 2.5,
                    }}
                  >
                    กลับไปข้อมูลลูกค้า
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      setSnack({
                        open: true,
                        msg: "พร้อมเชื่อมไปหน้ารายการจองแล้ว",
                        type: "info",
                      })
                    }
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
                    เปิดหน้ารายการจอง
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Box>
        </Box>
      </Drawer>

      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={confirmDrawerOpen}
        onClose={() => setPendingAction(null)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 420,
            height: isMobile ? "auto" : "100%",
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
                        pendingAction === "blacklist"
                          ? "rgb(254 242 242)"
                          : pendingAction === "watchlist"
                          ? "rgb(254 249 195)"
                          : "rgb(239 246 255)",
                      color:
                        pendingAction === "blacklist"
                          ? "rgb(185 28 28)"
                          : pendingAction === "watchlist"
                          ? "rgb(146 64 14)"
                          : "rgb(3 105 161)",
                    }}
                  >
                    {pendingAction === "blacklist" ? (
                      <BlockRoundedIcon sx={{ fontSize: 20 }} />
                    ) : pendingAction === "watchlist" ? (
                      <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
                    )}
                  </Box>

                  <Box className="min-w-0">
                    <Typography className="truncate text-sm font-black text-slate-900">
                      {confirmMeta?.title}
                    </Typography>
                    <Typography className="truncate text-xs text-slate-500">
                      ยืนยันก่อนบันทึกการเปลี่ยนสถานะ
                    </Typography>
                  </Box>
                </Stack>

                <IconButton
                  onClick={() => setPendingAction(null)}
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
          <Box className="min-h-0 flex-1 overflow-y-auto p-4">
            <Stack spacing={2.5}>
              <Box
                className="overflow-hidden rounded-2xl border"
                sx={{
                  borderColor:
                    pendingAction === "blacklist"
                      ? "rgb(254 202 202)"
                      : pendingAction === "watchlist"
                      ? "rgb(253 230 138)"
                      : "rgb(191 219 254)",
                  background:
                    pendingAction === "blacklist"
                      ? "linear-gradient(135deg, rgb(254 242 242), rgb(255 255 255))"
                      : pendingAction === "watchlist"
                      ? "linear-gradient(135deg, rgb(254 249 195), rgb(255 255 255))"
                      : "linear-gradient(135deg, rgb(239 246 255), rgb(255 255 255))",
                }}
              >
                <Box className="p-4">
                  <Typography className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Confirmation
                  </Typography>

                  <Typography className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line">
                    {confirmMeta?.description}
                  </Typography>
                </Box>
              </Box>

              {selectedCustomer ? (
                <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Typography className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    ข้อมูลที่กำลังเปลี่ยน
                  </Typography>

                  <Divider className="my-3! border-slate-200!" />

                  <Stack spacing={1.25}>
                    <InfoRow label="รหัสลูกค้า" value={selectedCustomer.id} />
                    <InfoRow label="ชื่อลูกค้า" value={selectedCustomer.name} />
                    <InfoRow
                      label="สถานะปัจจุบัน"
                      value={<CustomerFlagChip flag={selectedCustomer.flag} />}
                    />

                    <InfoRow
                      label="สถานะใหม่"
                      value={
                        pendingAction === "blacklist" ? (
                          <CustomerFlagChip flag="blacklist" />
                        ) : pendingAction === "watchlist" ? (
                          <CustomerFlagChip flag="watchlist" />
                        ) : (
                          <CustomerFlagChip flag="normal" />
                        )
                      }
                    />

                    {pendingAction === "blacklist" ? (
                      <InfoRow
                        label="เหตุผล"
                        value={flagReason.trim() || "-"}
                      />
                    ) : null}
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            className="mt-auto p-4"
            sx={{
              borderTop: "1px solid rgb(226 232 240)",
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setPendingAction(null)}
                sx={{
                  textTransform: "none",
                  borderColor: "rgb(226 232 240)",
                  color: "rgb(15 23 42)",
                  borderRadius: 2.5,
                  minHeight: 44,
                }}
              >
                ยกเลิก
              </Button>

              <Button
                fullWidth
                onClick={executePendingAction}
                variant="contained"
                color={confirmMeta?.confirmColor ?? "primary"}
                sx={{
                  textTransform: "none",
                  boxShadow: "none",
                  borderRadius: 2.5,
                  minHeight: 44,
                }}
              >
                {confirmMeta?.confirmLabel}
              </Button>
            </Stack>
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
