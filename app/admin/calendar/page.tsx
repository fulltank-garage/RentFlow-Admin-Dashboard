"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
  Drawer,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Tooltip,
} from "@mui/material";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

/* ===================== Types ===================== */
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Branch = { id: string; name: string };
type Car = { id: string; name: string; branchId: string };

type Booking = {
  id: string;
  carId: string;
  customer: string;
  start: string; // inclusive
  end: string; // exclusive
  status: BookingStatus;
};

/* ===================== Mock ===================== */
const BRANCHES: Branch[] = [
  { id: "bkk", name: "สาขากรุงเทพฯ" },
  { id: "spb", name: "สาขาสุพรรณบุรี" },
];

const CARS: Car[] = [
  { id: "c1", name: "BMW 320d", branchId: "bkk" },
  { id: "c2", name: "BMW 330e", branchId: "bkk" },
  { id: "c3", name: "Toyota Yaris", branchId: "spb" },
];

/* ===================== Date Utils ===================== */
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function toYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}
function parseYMD(s: string) {
  return new Date(s + "T00:00:00");
}
function diffDays(start: string, endExclusive: string) {
  return Math.max(
    1,
    Math.round(
      (parseYMD(endExclusive).getTime() - parseYMD(start).getTime()) / 86400000
    )
  );
}
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const a0 = parseYMD(aStart).getTime();
  const a1 = parseYMD(aEnd).getTime();
  const b0 = parseYMD(bStart).getTime();
  const b1 = parseYMD(bEnd).getTime();
  return a0 < b1 && b0 < a1;
}

function formatRangeLabel(cursor: Date) {
  const start = toYMD(cursor);
  const end = toYMD(addDays(cursor, 6));
  return `${start} ถึง ${end}`;
}

function statusTone(s: BookingStatus) {
  if (s === "confirmed")
    return {
      bg: "rgb(220 252 231)",
      border: "rgb(134 239 172)",
      text: "rgb(21 128 61)",
      chip: "ยืนยันแล้ว",
    };
  if (s === "pending")
    return {
      bg: "rgb(254 249 195)",
      border: "rgb(253 224 71)",
      text: "rgb(133 77 14)",
      chip: "รอดำเนินการ",
    };
  if (s === "completed")
    return {
      bg: "rgb(219 234 254)",
      border: "rgb(147 197 253)",
      text: "rgb(30 64 175)",
      chip: "เสร็จสิ้น",
    };
  return {
    bg: "rgb(254 226 226)",
    border: "rgb(252 165 165)",
    text: "rgb(153 27 27)",
    chip: "ยกเลิก",
  };
}

export default function AdminCalendarNoMotion() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [cursor, setCursor] = React.useState(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([
    {
      id: "BK-001",
      carId: "c1",
      customer: "Pachara",
      start: toYMD(addDays(new Date(), 1)),
      end: toYMD(addDays(new Date(), 3)),
      status: "confirmed",
    },
  ]);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = bookings.find((b) => b.id === selectedId) || null;

  const [snack, setSnack] = React.useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });

  const days = React.useMemo(
    () => Array.from({ length: 7 }, (_, i) => toYMD(addDays(cursor, i))),
    [cursor]
  );

  const touchStartX = React.useRef<number | null>(null);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 80) setCursor((d) => addDays(d, -7));
    if (diff < -80) setCursor((d) => addDays(d, 7));
    touchStartX.current = null;
  }

  function updateBooking(next: Booking) {
    const conflict = bookings.some(
      (b) =>
        b.id !== next.id &&
        b.carId === next.carId &&
        overlaps(next.start, next.end, b.start, b.end)
    );

    if (conflict) {
      setSnack({ open: true, msg: "ช่วงวันชนกับการจองอื่น", type: "error" });
      return;
    }

    setBookings((prev) => prev.map((b) => (b.id === next.id ? next : b)));
    setSnack({ open: true, msg: "อัปเดตเรียบร้อย", type: "success" });
  }

  function resize(id: string, delta: number) {
    const b = bookings.find((x) => x.id === id);
    if (!b) return;

    const newLen = diffDays(b.start, b.end) + delta;
    const next: Booking = {
      ...b,
      end: toYMD(addDays(parseYMD(b.start), Math.max(1, newLen))),
    };
    updateBooking(next);
  }

  function move(id: string, newStart: string) {
    const b = bookings.find((x) => x.id === id);
    if (!b) return;

    const duration = diffDays(b.start, b.end);
    const next: Booking = {
      ...b,
      start: newStart,
      end: toYMD(addDays(parseYMD(newStart), duration)),
    };
    updateBooking(next);
  }

  const bookingCount = bookings.length;

  return (
    <Box className="grid gap-4">
      <Box>
        <Typography
          variant="h6"
          className="text-xl font-extrabold text-slate-900"
        >
          ปฏิทินรถ
        </Typography>
        <Typography className="text-sm text-slate-600">
          จัดการการจองแบบรายสัปดาห์ — ลากเพื่อย้ายวัน,
          ปรับระยะเวลาในแถบรายละเอียด, และปัดซ้าย/ขวาบนมือถือเพื่อเลื่อนสัปดาห์
        </Typography>
      </Box>

      <Card
        elevation={0}
        className="rounded-2xl! border border-slate-200 bg-white"
      >
        <CardContent className="p-4 sm:p-5">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            className="items-start sm:items-center justify-between"
          >
            <Stack direction="row" spacing={1.25} className="items-center">
              <Box className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-slate-50">
                <EventNoteRoundedIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography className="text-sm font-bold text-slate-900">
                  {formatRangeLabel(cursor)}
                </Typography>
                <Typography className="mt-1 text-xs text-slate-500">
                  ทั้งหมด {bookingCount} รายการ • รถ {CARS.length} คัน • สาขา{" "}
                  {BRANCHES.length} แห่ง
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={1}
              className="w-full sm:w-auto"
            >
              <Button
                fullWidth={isMobile}
                variant="outlined"
                size="medium"
                startIcon={<ChevronLeftRoundedIcon />}
                onClick={() => setCursor((d) => addDays(d, -7))}
                sx={{
                  textTransform: "none",
                  borderRadius: 2.5,
                  minHeight: 38,
                }}
              >
                ก่อนหน้า
              </Button>
              <Button
                fullWidth={isMobile}
                variant="contained"
                size="medium"
                endIcon={<ChevronRightRoundedIcon />}
                onClick={() => setCursor((d) => addDays(d, 7))}
                sx={{
                  textTransform: "none",
                  bgcolor: "rgb(15 23 42)",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" },
                  borderRadius: 2.5,
                  minHeight: 38,
                }}
              >
                ถัดไป
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        className="rounded-2xl! border border-slate-200 bg-white overflow-hidden"
      >
        <CardContent
          className="p-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Box
            sx={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Box
              className="grid"
              sx={{
                gridTemplateColumns: isMobile
                  ? `170px repeat(${days.length}, 130px)`
                  : `240px repeat(${days.length}, 1fr)`,
                minWidth: isMobile ? 1080 : 980,
              }}
            >
              <Box className="p-3 sm:p-4 bg-slate-50 border-b sticky left-0 z-10">
                <Box className="rounded-r-none">
                  <Typography className="text-xs font-bold text-slate-700">
                    รถ
                  </Typography>
                  <Typography className="text-[11px] text-slate-500 mt-0.5">
                    แตะหรือ drag เพื่อย้าย
                  </Typography>
                </Box>
              </Box>

              {days.map((d) => (
                <Box
                  key={d}
                  className="p-3 sm:p-4 bg-slate-50 border-l border-b"
                >
                  <Typography className="text-xs font-bold text-slate-700">
                    {d}
                  </Typography>
                  <Typography className="text-[11px] text-slate-500 mt-0.5">
                    วางที่นี่
                  </Typography>
                </Box>
              ))}

              {CARS.map((car) => (
                <React.Fragment key={car.id}>
                  <Box className="p-3 sm:p-4 border-b bg-white sticky left-0 z-10">
                    <Typography className="text-sm font-semibold text-slate-900">
                      {car.name}
                    </Typography>
                    <Typography className="text-[11px] text-slate-500 mt-0.5">
                      {BRANCHES.find((b) => b.id === car.branchId)?.name ?? "-"}
                    </Typography>
                  </Box>

                  {days.map((day) => {
                    const booking = bookings.find(
                      (b) =>
                        b.carId === car.id &&
                        overlaps(
                          day,
                          toYMD(addDays(parseYMD(day), 1)),
                          b.start,
                          b.end
                        )
                    );

                    return (
                      <Box
                        key={day}
                        className="p-2 border-l border-b"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const id = e.dataTransfer.getData("id");
                          if (id) move(id, day);
                        }}
                        sx={{
                          minHeight: isMobile ? 86 : 78,
                          bgcolor: booking ? "transparent" : "white",
                        }}
                      >
                        {booking && (
                          <Tooltip
                            arrow
                            placement="top"
                            title={
                              <Box className="text-xs">
                                <div className="font-semibold">
                                  {booking.id}
                                </div>
                                <div className="opacity-90">
                                  {booking.customer} • {booking.start} →{" "}
                                  {booking.end}
                                </div>
                              </Box>
                            }
                          >
                            <Box
                              draggable
                              onDragStart={(e) =>
                                e.dataTransfer.setData("id", booking.id)
                              }
                              onClick={() => setSelectedId(booking.id)}
                              sx={{
                                bgcolor: statusTone(booking.status).bg,
                                border: `1px solid ${
                                  statusTone(booking.status).border
                                }`,
                                color: statusTone(booking.status).text,
                                minHeight: isMobile ? 66 : 58,
                              }}
                              className="rounded-xl p-2.5 text-xs cursor-pointer"
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                className="items-center justify-between"
                              >
                                <Typography className="text-xs font-semibold">
                                  {booking.id}
                                </Typography>
                                <Chip
                                  size="medium"
                                  label={statusTone(booking.status).chip}
                                  sx={{
                                    height: 20,
                                    fontSize: 10,
                                    bgcolor: "rgba(255,255,255,0.7)",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                  }}
                                />
                              </Stack>

                              <Typography className="text-[11px] mt-1 opacity-90 line-clamp-2">
                                {booking.customer}
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    );
                  })}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={!!selected}
        onClose={() => setSelectedId(null)}
        PaperProps={{
          sx: {
            height: isMobile ? "78%" : "100%",
            width: isMobile ? "100%" : 420,
            borderTopLeftRadius: isMobile ? 20 : 0,
            borderTopRightRadius: isMobile ? 20 : 0,
          },
        }}
      >
        {selected && (
          <Box className="p-4 sm:p-5">
            {isMobile ? (
              <Box className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
            ) : null}

            <Stack direction="row" spacing={1.25} className="items-center">
              <Box className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-slate-50">
                <EventNoteRoundedIcon fontSize="medium" />
              </Box>
              <Box className="min-w-0">
                <Typography className="font-extrabold text-slate-900">
                  {selected.id}
                </Typography>
                <Typography className="text-xs text-slate-500 mt-0.5">
                  {selected.start} → {selected.end} (
                  {diffDays(selected.start, selected.end)} วัน)
                </Typography>
              </Box>
            </Stack>

            <Divider className="my-4 border-slate-200!" />

            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                className="items-center justify-between"
              >
                <Typography className="text-sm font-semibold text-slate-900">
                  สถานะ
                </Typography>
                <Chip
                  size="medium"
                  label={statusTone(selected.status).chip}
                  sx={{
                    bgcolor: statusTone(selected.status).bg,
                    color: statusTone(selected.status).text,
                    border: `1px solid ${statusTone(selected.status).border}`,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Typography className="text-sm text-slate-700">
                ลูกค้า:{" "}
                <span className="font-semibold">{selected.customer}</span>
              </Typography>

              <Typography className="text-sm text-slate-700">
                รถ:{" "}
                <span className="font-semibold">
                  {CARS.find((c) => c.id === selected.carId)?.name ?? "-"}
                </span>
              </Typography>

              <Divider className="my-2 border-slate-200!" />

              <Typography className="text-sm font-semibold text-slate-900">
                ปรับระยะเวลา
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                className="mt-1"
              >
                <Button
                  fullWidth={isMobile}
                  variant="outlined"
                  onClick={() => resize(selected.id, -1)}
                  startIcon={<RemoveRoundedIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2.5,
                    minHeight: 42,
                  }}
                >
                  ลด 1 วัน
                </Button>

                <Button
                  fullWidth={isMobile}
                  variant="contained"
                  onClick={() => resize(selected.id, 1)}
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    textTransform: "none",
                    bgcolor: "rgb(15 23 42)",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "rgb(2 6 23)", boxShadow: "none" },
                    borderRadius: 2.5,
                    minHeight: 42,
                  }}
                >
                  เพิ่ม 1 วัน
                </Button>
              </Stack>

              <Typography className="text-[11px] text-slate-500 mt-1">
                ระบบจะกันการชนกันของวันจองสำหรับรถคันเดียวกันโดยอัตโนมัติ
              </Typography>
            </Stack>
          </Box>
        )}
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
    </Box>
  );
}
