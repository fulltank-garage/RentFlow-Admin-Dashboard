"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Drawer,
  Avatar,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import DoNotDisturbRoundedIcon from "@mui/icons-material/DoNotDisturbRounded";

type LeadStatus = "new" | "contacted" | "won" | "lost";

type Lead = {
  id: string;
  name: string;
  phone: string;
  channel: "line" | "facebook" | "whatsapp" | "phone";
  status: LeadStatus;
  createdAt: string;
  amountEstimate: number;
  summaryText: string;
  pickupPoint?: string;
  returnPoint?: string;
  pickupDate?: string;
  returnDate?: string;
  carName?: string;
  followUpAt?: string | null;
};

const SEED: Lead[] = [
  {
    id: "LD-2001",
    name: "Pachara",
    phone: "0999999999",
    channel: "line",
    status: "new",
    createdAt: "2026-03-03T10:15:00+07:00",
    amountEstimate: 12800,
    summaryText: "ต้องการเช่า BMW 3 วัน + คืนรถต่างสาขา ขอส่วนลด",
    pickupPoint: "สนามบินดอนเมือง (DMK)",
    returnPoint: "สาขากรุงเทพฯ (รัชดา)",
    pickupDate: "2026-03-05",
    returnDate: "2026-03-08",
    carName: "BMW 330e M Sport",
    followUpAt: null,
  },
  {
    id: "LD-2002",
    name: "Somchai",
    phone: "0888888888",
    channel: "facebook",
    status: "contacted",
    createdAt: "2026-03-02T18:40:00+07:00",
    amountEstimate: 5900,
    summaryText: "ถามเรื่องส่งรถถึงที่ + อยากทราบค่ามัดจำ",
    pickupPoint: "ส่งรถถึงที่ (นัดหมาย)",
    returnPoint: "ส่งรถถึงที่ (นัดหมาย)",
    pickupDate: "2026-03-06",
    returnDate: "2026-03-07",
    carName: "Toyota Yaris",
    followUpAt: "2026-03-04T10:00:00+07:00",
  },
  {
    id: "LD-2003",
    name: "Nok",
    phone: "0777777777",
    channel: "whatsapp",
    status: "won",
    createdAt: "2026-03-01T12:05:00+07:00",
    amountEstimate: 9200,
    summaryText: "ปิดการขายแล้ว นัดรับรถสาขากรุงเทพฯ",
    pickupPoint: "สาขากรุงเทพฯ (รัชดา)",
    returnPoint: "สาขากรุงเทพฯ (รัชดา)",
    pickupDate: "2026-03-04",
    returnDate: "2026-03-06",
    carName: "Honda City",
    followUpAt: null,
  },
  {
    id: "LD-2004",
    name: "Beam",
    phone: "0666666666",
    channel: "phone",
    status: "lost",
    createdAt: "2026-02-28T09:20:00+07:00",
    amountEstimate: 7800,
    summaryText: "ลูกค้าตัดสินใจไปเจ้าอื่น (ราคา)",
    pickupPoint: "สาขาสุพรรณบุรี (ในเมือง)",
    returnPoint: "สาขาสุพรรณบุรี (ในเมือง)",
    pickupDate: "2026-03-02",
    returnDate: "2026-03-04",
    carName: "BMW 320d M Sport",
    followUpAt: null,
  },
];

function formatTHB(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return (
    new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(v) +
    " บาท"
  );
}

function formatDateTimeTH(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function statusMeta(s: LeadStatus) {
  if (s === "new") return { label: "ใหม่", tone: "amber" as const };
  if (s === "contacted") return { label: "ติดต่อแล้ว", tone: "sky" as const };
  if (s === "won") return { label: "ปิดการขาย", tone: "emerald" as const };
  return { label: "ไม่สำเร็จ", tone: "rose" as const };
}

function statusChipSX(tone: "amber" | "sky" | "emerald" | "rose" | "slate") {
  if (tone === "amber") {
    return {
      border: "1px solid rgb(253 230 138)",
      bgcolor: "rgb(254 243 199)",
      color: "rgb(146 64 14)",
    };
  }

  if (tone === "sky") {
    return {
      border: "1px solid rgb(186 230 253)",
      bgcolor: "rgb(224 242 254)",
      color: "rgb(3 105 161)",
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

function channelLabel(c: Lead["channel"]) {
  if (c === "line") return "LINE";
  if (c === "facebook") return "Facebook";
  if (c === "whatsapp") return "WhatsApp";
  return "โทร";
}

function toTelHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function toChatHref(channel: Lead["channel"], lead: Lead) {
  const msg = encodeURIComponent(
    `สนใจจองรถ (Lead ${lead.id})\nชื่อ: ${lead.name}\nโทร: ${lead.phone}\nรถ: ${
      lead.carName ?? "-"
    }\nรับ: ${lead.pickupDate ?? "-"} (${lead.pickupPoint ?? "-"})\nคืน: ${
      lead.returnDate ?? "-"
    } (${lead.returnPoint ?? "-"})\nยอดประมาณ: ${formatTHB(
      lead.amountEstimate
    )}\nรายละเอียด: ${lead.summaryText}`
  );

  if (channel === "line") return `https://line.me/R/msg/text/?${msg}`;
  if (channel === "whatsapp") {
    const p = lead.phone.replace(/\D/g, "");
    return `https://wa.me/${p}?text=${msg}`;
  }
  if (channel === "facebook") return `https://www.facebook.com/messages/`;
  return toTelHref(lead.phone);
}

function buildSummaryText(lead: Lead) {
  return [
    `Lead ${lead.id}`,
    `ชื่อ: ${lead.name}`,
    `โทร: ${lead.phone}`,
    `ช่องทาง: ${channelLabel(lead.channel)}`,
    `สถานะ: ${statusMeta(lead.status).label}`,
    `รถ: ${lead.carName ?? "-"}`,
    `รับ: ${lead.pickupDate ?? "-"} (${lead.pickupPoint ?? "-"})`,
    `คืน: ${lead.returnDate ?? "-"} (${lead.returnPoint ?? "-"})`,
    `ยอดประมาณ: ${formatTHB(lead.amountEstimate)}`,
    `รายละเอียด: ${lead.summaryText}`,
  ].join("\n");
}

function followUpBadge(followUpAt?: string | null) {
  if (!followUpAt) return null;

  const due = new Date(followUpAt);
  const now = new Date();

  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);

  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);

  const startDayAfter = new Date(startTomorrow);
  startDayAfter.setDate(startDayAfter.getDate() + 1);

  if (due.getTime() < now.getTime()) {
    return { label: "เกินกำหนด", tone: "rose" as const };
  }
  if (due >= startToday && due < startTomorrow) {
    return { label: "ติดตามวันนี้", tone: "amber" as const };
  }
  if (due >= startTomorrow && due < startDayAfter) {
    return { label: "ติดตามพรุ่งนี้", tone: "sky" as const };
  }
  return { label: "มีนัดติดตาม", tone: "slate" as const };
}

function LeadStatusChip({ status }: { status: LeadStatus }) {
  const meta = statusMeta(status);
  return (
    <Chip
      size="medium"
      label={meta.label}
      variant="outlined"
      sx={statusChipSX(meta.tone)}
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

export default function AdminLeadsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [rows, setRows] = React.useState<Lead[]>(SEED);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<LeadStatus | "all">("all");
  const [channel, setChannel] = React.useState<Lead["channel"] | "all">("all");

  const [openId, setOpenId] = React.useState<string | null>(null);

  const [followUpLocal, setFollowUpLocal] = React.useState("");

  const [snack, setSnack] = React.useState<{
    open: boolean;
    msg: string;
    type: "success" | "error" | "info";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  const selected = React.useMemo(
    () => rows.find((r) => r.id === openId) ?? null,
    [rows, openId]
  );

  React.useEffect(() => {
    if (!selected?.followUpAt) {
      setFollowUpLocal("");
      return;
    }

    const d = new Date(selected.followUpAt);
    const pad = (n: number) => String(n).padStart(2, "0");

    setFollowUpLocal(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}`
    );
  }, [selected?.id, selected?.followUpAt]);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();

    return rows
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => (channel === "all" ? true : r.channel === channel))
      .filter((r) => {
        if (!qq) return true;
        return (
          r.id.toLowerCase().includes(qq) ||
          r.name.toLowerCase().includes(qq) ||
          r.phone.toLowerCase().includes(qq) ||
          r.summaryText.toLowerCase().includes(qq) ||
          (r.carName ?? "").toLowerCase().includes(qq)
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [rows, q, status, channel]);

  function updateStatus(id: string, next: LeadStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  }

  function updateLead(id: string, patch: Partial<Lead>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function copySummary(lead: Lead) {
    try {
      await navigator.clipboard.writeText(buildSummaryText(lead));
      setSnack({ open: true, msg: "คัดลอกข้อความสรุปแล้ว", type: "success" });
    } catch {
      setSnack({
        open: true,
        msg: "คัดลอกไม่สำเร็จ (เบราว์เซอร์บล็อก clipboard)",
        type: "error",
      });
    }
  }

  function saveFollowUpFromInput() {
    if (!selected) return;

    if (!followUpLocal) {
      updateLead(selected.id, { followUpAt: null });
      setSnack({ open: true, msg: "ล้างเวลาติดตามแล้ว", type: "info" });
      return;
    }

    const d = new Date(followUpLocal);
    if (Number.isNaN(d.getTime())) {
      setSnack({ open: true, msg: "รูปแบบเวลาไม่ถูกต้อง", type: "error" });
      return;
    }

    updateLead(selected.id, { followUpAt: d.toISOString() });
    setSnack({ open: true, msg: "บันทึกเวลาติดตามแล้ว", type: "success" });
  }

  function setFollowUpNowPlus(minutes: number) {
    if (!selected) return;
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutes);
    updateLead(selected.id, { followUpAt: d.toISOString() });
    setSnack({ open: true, msg: "ตั้งเวลาติดตามแล้ว", type: "success" });
  }

  function setFollowUpTomorrow10() {
    if (!selected) return;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    updateLead(selected.id, { followUpAt: d.toISOString() });
    setSnack({
      open: true,
      msg: "ตั้งเวลาติดตาม (พรุ่งนี้ 10:00) แล้ว",
      type: "success",
    });
  }

  function clearFollowUp() {
    if (!selected) return;
    updateLead(selected.id, { followUpAt: null });
    setSnack({ open: true, msg: "ล้างเวลาติดตามแล้ว", type: "info" });
  }

  function closeDrawer() {
    setOpenId(null);
  }

  const roundedFieldSX = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  };

  const quickActions: Array<{
    label: string;
    status: LeadStatus;
    variant: "contained" | "outlined";
    icon: React.ReactNode;
    sx: object;
  }> = [
    {
      label: "ใหม่",
      status: "new",
      variant: "outlined",
      icon: <ForumRoundedIcon />,
      sx: {
        textTransform: "none",
        borderColor: "rgb(253 230 138)",
        color: "rgb(146 64 14)",
        "&:hover": {
          borderColor: "rgb(245 158 11)",
          bgcolor: "rgb(255 251 235)",
        },
      },
    },
    {
      label: "ติดต่อแล้ว",
      status: "contacted",
      variant: "outlined",
      icon: <MarkEmailReadRoundedIcon />,
      sx: {
        textTransform: "none",
        borderColor: "rgb(186 230 253)",
        color: "rgb(3 105 161)",
        "&:hover": {
          borderColor: "rgb(56 189 248)",
          bgcolor: "rgb(240 249 255)",
        },
      },
    },
    {
      label: "ปิดการขาย",
      status: "won",
      variant: "contained",
      icon: <CheckCircleRoundedIcon />,
      sx: {
        textTransform: "none",
        bgcolor: "rgb(22 163 74)",
        boxShadow: "none",
        "&:hover": {
          bgcolor: "rgb(21 128 61)",
          boxShadow: "none",
        },
      },
    },
    {
      label: "ไม่สำเร็จ",
      status: "lost",
      variant: "outlined",
      icon: <DoNotDisturbRoundedIcon />,
      sx: {
        textTransform: "none",
        borderColor: "rgb(252 165 165)",
        color: "rgb(185 28 28)",
        "&:hover": {
          borderColor: "rgb(248 113 113)",
          bgcolor: "rgb(254 242 242)",
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
            <Typography
              variant="h6"
              className="text-xl font-extrabold text-slate-900"
            >
              จองผ่านแชท
            </Typography>
            <Typography className="text-sm text-slate-600">
              จัดการลูกค้าที่ทักเข้ามา ติดตามสถานะ และปิดการขายได้เร็วขึ้น
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            className="w-full md:w-auto"
          >
            <TextField
              size="small"
              label="ค้นหา (Lead ID / ชื่อ / โทร / รถ)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full sm:w-72"
              sx={roundedFieldSX}
              InputProps={{
                startAdornment: (
                  <Box className="mr-2 text-slate-500">
                    <SearchRoundedIcon fontSize="small" />
                  </Box>
                ),
              }}
            />

            <TextField
              size="small"
              select
              label="สถานะ"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus | "all")}
              className="w-full sm:w-44"
              sx={roundedFieldSX}
              InputProps={{
                startAdornment: (
                  <Box className="mr-2 text-slate-500">
                    <FilterAltRoundedIcon fontSize="small" />
                  </Box>
                ),
              }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="new">ใหม่</MenuItem>
              <MenuItem value="contacted">ติดต่อแล้ว</MenuItem>
              <MenuItem value="won">ปิดการขาย</MenuItem>
              <MenuItem value="lost">ไม่สำเร็จ</MenuItem>
            </TextField>

            <TextField
              size="small"
              select
              label="ช่องทาง"
              value={channel}
              onChange={(e) =>
                setChannel(e.target.value as Lead["channel"] | "all")
              }
              className="w-full sm:w-44"
              sx={roundedFieldSX}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="line">LINE</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="phone">โทร</MenuItem>
            </TextField>

            <Button
              variant="contained"
              size="medium"
              onClick={() =>
                setSnack({
                  open: true,
                  msg: "พร้อมต่อ API เพื่อดึง Leads จริง",
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
              จัดการ Leads
            </Button>
          </Stack>
        </Stack>

        <Card
          elevation={0}
          className="rounded-2xl! border border-slate-200 bg-white"
        >
          <CardContent className="p-0">
            <Box className="grid">
              {filtered.map((r, idx) => {
                const fu = followUpBadge(r.followUpAt);

                return (
                  <Box key={r.id}>
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
                          <Avatar
                            sx={{
                              width: { xs: 56, md: 64 },
                              height: { xs: 56, md: 64 },
                              bgcolor: "rgb(248 250 252)",
                              border: "1px solid rgb(226 232 240)",
                              color: "rgb(15 23 42)",
                              fontWeight: 800,
                            }}
                          >
                            <PersonRoundedIcon />
                          </Avatar>

                          <Box className="min-w-0 flex-1">
                            <Stack
                              direction="row"
                              spacing={1.5}
                              className="items-center flex-wrap"
                            >
                              <Typography className="text-sm font-extrabold text-slate-900 tracking-wide">
                                {r.id}
                              </Typography>

                              <LeadStatusChip status={r.status} />

                              <Chip
                                size="medium"
                                label={channelLabel(r.channel)}
                                variant="outlined"
                              />

                              <Chip
                                size="medium"
                                label={formatTHB(r.amountEstimate)}
                                variant="outlined"
                              />

                              {fu ? (
                                <Chip
                                  size="medium"
                                  icon={<AccessTimeRoundedIcon fontSize="small" />}
                                  label={fu.label}
                                  variant="outlined"
                                  sx={{
                                    ...(fu.tone === "slate"
                                      ? statusChipSX("slate")
                                      : statusChipSX(fu.tone)),
                                  }}
                                />
                              ) : null}
                            </Stack>

                            <Typography className="mt-1 text-lg font-bold text-slate-800">
                              {r.name}
                            </Typography>

                            <Divider className="my-2! border-slate-200!" />

                            <Typography className="text-xs text-slate-500">
                              โทร:{" "}
                              <span className="font-medium text-slate-700">
                                {r.phone}
                              </span>
                              {" • "}
                              รถ:{" "}
                              <span className="font-medium text-slate-700">
                                {r.carName ?? "-"}
                              </span>
                            </Typography>

                            <Typography className="mt-1 text-xs text-slate-500">
                              รับรถ:{" "}
                              <span className="font-medium text-slate-700">
                                {r.pickupDate ?? "-"} ({r.pickupPoint ?? "-"})
                              </span>
                            </Typography>

                            <Typography className="mt-1 text-xs text-slate-500">
                              คืนรถ:{" "}
                              <span className="font-medium text-slate-700">
                                {r.returnDate ?? "-"} ({r.returnPoint ?? "-"})
                              </span>
                            </Typography>

                            <Typography className="mt-1 text-xs text-slate-500">
                              สร้างเมื่อ{" "}
                              <span className="font-medium text-slate-700">
                                {formatDateTimeTH(r.createdAt)}
                              </span>
                            </Typography>

                            <Typography className="mt-2 text-sm text-slate-600 line-clamp-2">
                              {r.summaryText}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          spacing={1.5}
                          className="w-full md:w-auto"
                          sx={{
                            minWidth: { md: 220, lg: 240 },
                          }}
                        >
                          <Box className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                            <Typography className="text-xs text-slate-500">
                              สถานะปัจจุบัน
                            </Typography>
                            <LeadStatusChip status={r.status} />
                          </Box>

                          <TextField
                            select
                            size="small"
                            value={r.status}
                            onChange={(e) =>
                              updateStatus(r.id, e.target.value as LeadStatus)
                            }
                            sx={{
                              ...roundedFieldSX,
                              "& .MuiInputBase-root": {
                                backgroundColor: "rgb(248 250 252)",
                              },
                            }}
                          >
                            <MenuItem value="new">ใหม่</MenuItem>
                            <MenuItem value="contacted">ติดต่อแล้ว</MenuItem>
                            <MenuItem value="won">ปิดการขาย</MenuItem>
                            <MenuItem value="lost">ไม่สำเร็จ</MenuItem>
                          </TextField>

                          <Stack direction="row" spacing={1} className="justify-end flex-wrap">
                            <Tooltip title="โทร">
                              <IconButton component="a" href={toTelHref(r.phone)}>
                                <CallRoundedIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="เปิดแชท">
                              <IconButton
                                component="a"
                                href={toChatHref(r.channel, r)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ChatRoundedIcon />
                              </IconButton>
                            </Tooltip>

                            <Button
                              size="medium"
                              variant="contained"
                              onClick={() => setOpenId(r.id)}
                              endIcon={<OpenInNewRoundedIcon />}
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
                              รายละเอียด
                            </Button>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>

                    {idx !== filtered.length - 1 ? (
                      <Divider className="border-slate-200!" />
                    ) : null}
                  </Box>
                );
              })}

              {!filtered.length ? (
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
        open={!!openId}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
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
                      bgcolor: "rgb(241 245 249)",
                      color: "rgb(15 23 42)",
                    }}
                  >
                    <ForumRoundedIcon sx={{ fontSize: 20 }} />
                  </Box>

                  <Box className="min-w-0">
                    <Typography className="truncate text-sm font-black text-slate-900">
                      รายละเอียด Lead
                    </Typography>

                    <Typography className="truncate text-xs text-slate-500">
                      {selected ? `${selected.id} • ${selected.name}` : "-"}
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

          <Box className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {selected ? (
              <Stack spacing={2}>
                <Box className="overflow-hidden rounded-2xl border border-slate-200 bg-white mb-1">
                  <Box
                    className="relative bg-linear-to-br from-slate-900 to-slate-700"
                    sx={{ minHeight: 220 }}
                  >
                    <Box className="grid h-55 w-full place-items-center text-slate-300">
                      <ForumRoundedIcon sx={{ fontSize: 56 }} />
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
                        Lead Overview
                      </Typography>

                      <Typography className="mt-2 text-xl font-extrabold">
                        {selected.carName ?? "ยังไม่ได้ระบุรถ"}
                      </Typography>

                      <Typography className="mt-2 text-sm text-slate-200">
                        {selected.name} • {channelLabel(selected.channel)}
                      </Typography>

                      <Typography className="mt-2 text-sm text-slate-200">
                        {selected.pickupDate ?? "-"} ถึง {selected.returnDate ?? "-"}
                      </Typography>

                      <Typography className="mt-4 text-sm text-slate-300">
                        ยอดประมาณ
                      </Typography>
                      <Typography className="text-2xl font-extrabold">
                        {formatTHB(selected.amountEstimate)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Stack direction="row" spacing={1} className="items-center">
                    <Typography className="text-sm font-bold text-slate-900">
                      สถานะปัจจุบัน
                    </Typography>
                    <LeadStatusChip status={selected.status} />
                  </Stack>
                </Box>

                <Box className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    className="items-start sm:items-center justify-between"
                  >
                    <Typography className="text-sm font-bold text-slate-900">
                      เปลี่ยนสถานะอย่างรวดเร็ว
                    </Typography>

                    <Stack direction="row" spacing={1} className="items-center">
                      <Typography className="text-xs text-slate-500">
                        จะบันทึกเป็น
                      </Typography>
                      <LeadStatusChip status={selected.status} />
                    </Stack>
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.2}
                    className="mt-4"
                  >
                    {quickActions.map((action) => {
                      const isActive = selected.status === action.status;

                      return (
                        <Button
                          key={action.status}
                          variant={isActive ? "contained" : action.variant}
                          startIcon={action.icon}
                          onClick={() => updateStatus(selected.id, action.status)}
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

                <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SectionCard title="ข้อมูลลูกค้า">
                    <InfoRow label="ชื่อ" value={selected.name} />
                    <InfoRow label="เบอร์โทร" value={selected.phone} />
                    <InfoRow label="ช่องทาง" value={channelLabel(selected.channel)} />
                    <InfoRow
                      label="สถานะ"
                      value={<LeadStatusChip status={selected.status} />}
                    />
                  </SectionCard>

                  <SectionCard title="ข้อมูลการจอง">
                    <InfoRow label="รถ" value={selected.carName ?? "-"} />
                    <InfoRow label="วันรับรถ" value={selected.pickupDate ?? "-"} />
                    <InfoRow label="วันคืนรถ" value={selected.returnDate ?? "-"} />
                    <InfoRow
                      label="ยอดประมาณ"
                      value={formatTHB(selected.amountEstimate)}
                    />
                  </SectionCard>

                  <SectionCard title="สถานที่และเวลา">
                    <InfoRow label="จุดรับรถ" value={selected.pickupPoint ?? "-"} />
                    <InfoRow label="จุดคืนรถ" value={selected.returnPoint ?? "-"} />
                    <InfoRow
                      label="สร้างเมื่อ"
                      value={formatDateTimeTH(selected.createdAt)}
                    />
                    <InfoRow
                      label="ติดตาม"
                      value={
                        selected.followUpAt
                          ? formatDateTimeTH(selected.followUpAt)
                          : "-"
                      }
                    />
                  </SectionCard>

                  <SectionCard title="สรุป lead">
                    <Box>
                      <Stack direction="row" className="items-center justify-between">
                        <Typography className="text-xs text-slate-500">
                          ข้อความสรุป
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ContentCopyRoundedIcon />}
                          onClick={() => copySummary(selected)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            borderColor: "rgb(226 232 240)",
                          }}
                        >
                          คัดลอก
                        </Button>
                      </Stack>

                      <Typography className="mt-2 text-sm whitespace-pre-line text-slate-900">
                        {buildSummaryText(selected)}
                      </Typography>
                    </Box>
                  </SectionCard>
                </Box>

                <SectionCard title="ตั้งเวลาติดตาม">
                  <Typography className="text-xs text-slate-500 flex items-center gap-1">
                    <ScheduleRoundedIcon fontSize="inherit" />
                    ตั้งวันและเวลาที่ต้องติดตามลูกค้ารายนี้
                  </Typography>

                  <TextField
                    type="datetime-local"
                    size="medium"
                    value={followUpLocal}
                    onChange={(e) => setFollowUpLocal(e.target.value)}
                    sx={roundedFieldSX}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  <Stack direction="row" spacing={1} className="flex-wrap">
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={saveFollowUpFromInput}
                      sx={{
                        textTransform: "none",
                        bgcolor: "rgb(15 23 42)",
                        boxShadow: "none",
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "rgb(2 6 23)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      บันทึก
                    </Button>

                    <Button
                      size="medium"
                      variant="outlined"
                      onClick={() => setFollowUpNowPlus(60)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        borderColor: "rgb(226 232 240)",
                      }}
                    >
                      +1 ชม
                    </Button>

                    <Button
                      size="medium"
                      variant="outlined"
                      onClick={setFollowUpTomorrow10}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        borderColor: "rgb(226 232 240)",
                      }}
                    >
                      พรุ่งนี้ 10:00
                    </Button>

                    <Button
                      size="medium"
                      variant="text"
                      onClick={clearFollowUp}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        color: "rgb(100 116 139)",
                      }}
                    >
                      ล้าง
                    </Button>
                  </Stack>
                </SectionCard>

                <SectionCard title="ติดต่อกลับ">
                  <Stack spacing={1}>
                    <Button
                      component="a"
                      href={toChatHref(selected.channel, selected)}
                      target="_blank"
                      rel="noreferrer"
                      variant="contained"
                      startIcon={<ChatRoundedIcon />}
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
                      เปิดแชทพร้อมข้อความสรุป
                    </Button>

                    <Button
                      component="a"
                      href={toTelHref(selected.phone)}
                      variant="outlined"
                      startIcon={<CallRoundedIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2.5,
                        borderColor: "rgb(226 232 240)",
                      }}
                    >
                      โทรหาลูกค้า
                    </Button>
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
                    onClick={() => {
                      setSnack({
                        open: true,
                        msg: "บันทึกข้อมูล Lead เรียบร้อย",
                        type: "success",
                      });
                      closeDrawer();
                    }}
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
                    เสร็จสิ้น
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