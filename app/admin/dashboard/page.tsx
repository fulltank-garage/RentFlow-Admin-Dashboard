import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import {
  DOMAINS,
  PLATFORM_HOSTS,
  TENANTS,
  domainStatusLabel,
  formatTHB,
  tenantStatusLabel,
} from "@/src/data/platform";

const totalRevenue = TENANTS.reduce(
  (sum, tenant) => sum + tenant.revenueThisMonth,
  0
);
const activeTenants = TENANTS.filter((tenant) => tenant.status === "active");
const verifiedDomains = DOMAINS.filter((domain) => domain.status === "verified");
const pendingTenants = TENANTS.filter((tenant) => tenant.status === "pending");

const stats = [
  {
    label: "ร้านทั้งหมด",
    value: TENANTS.length.toString(),
    caption: `${activeTenants.length} ร้านเปิดใช้งาน`,
    icon: StorefrontRoundedIcon,
  },
  {
    label: "โดเมนพร้อมใช้งาน",
    value: verifiedDomains.length.toString(),
    caption: `${DOMAINS.length - verifiedDomains.length} รายการต้องดูแล`,
    icon: DnsRoundedIcon,
  },
  {
    label: "เจ้าของร้านรอตรวจ",
    value: pendingTenants.length.toString(),
    caption: "รออนุมัติร้านและ subdomain",
    icon: PeopleAltRoundedIcon,
  },
  {
    label: "รายได้เดือนนี้",
    value: formatTHB(totalRevenue),
    caption: "รวมทุก tenant",
    icon: PaymentsRoundedIcon,
  },
];

function toneForStatus(status: string) {
  if (status === "active" || status === "verified") return "success";
  if (status === "pending" || status === "pending_dns") return "warning";
  return "error";
}

export default function AdminDashboardPage() {
  return (
    <Stack spacing={3}>
      <Box className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
        >
          <Box>
            <Typography className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
              Platform overview
            </Typography>
            <Typography className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              ควบคุม RentFlow ทุก tenant ในที่เดียว
            </Typography>
            <Typography className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              หน้านี้คือหลังบ้านของคุณสำหรับจัดการเจ้าของร้านทั้งหมด ตรวจสอบร้านใหม่
              และดูสถานะ subdomain ที่ลูกค้าปลายทางจะใช้งาน
            </Typography>
          </Box>

          <Box className="min-w-72 rounded-3xl bg-slate-950 p-5 text-white">
            <Typography className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Host model
            </Typography>
            <Stack spacing={1.25} className="mt-4">
              <Typography className="text-sm font-semibold">
                Admin: {PLATFORM_HOSTS.admin}
              </Typography>
              <Typography className="text-sm font-semibold">
                Partner: {PLATFORM_HOSTS.partner}
              </Typography>
              <Typography className="text-sm font-semibold">
                Shops: {PLATFORM_HOSTS.wildcardStorefront}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              elevation={0}
              className="rounded-3xl! border border-slate-200 bg-white"
            >
              <CardContent className="p-5!">
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography className="text-sm text-slate-500">
                      {stat.label}
                    </Typography>
                    <Typography className="mt-2 text-2xl font-black text-slate-950">
                      {stat.value}
                    </Typography>
                    <Typography className="mt-1 text-xs text-slate-500">
                      {stat.caption}
                    </Typography>
                  </Box>
                  <Box className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-900">
                    <Icon />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card
          elevation={0}
          className="rounded-3xl! border border-slate-200 bg-white"
        >
          <CardContent className="p-5!">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography className="text-lg font-black text-slate-950">
                  ร้านล่าสุดในระบบ
                </Typography>
                <Typography className="text-sm text-slate-500">
                  tenant ที่ผูกกับ public storefront subdomain
                </Typography>
              </Box>
            </Stack>

            <Divider className="my-4! border-slate-200!" />

            <Stack spacing={1.5}>
              {TENANTS.map((tenant) => (
                <Box
                  key={tenant.id}
                  className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_auto]"
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="font-black text-slate-950">
                        {tenant.shopName}
                      </Typography>
                      <Chip
                        size="small"
                        color={toneForStatus(tenant.status)}
                        label={tenantStatusLabel(tenant.status)}
                      />
                    </Stack>
                    <Typography className="mt-1 text-sm text-slate-500">
                      {tenant.publicDomain} • เจ้าของ {tenant.ownerName}
                    </Typography>
                  </Box>
                  <Box className="text-left md:text-right">
                    <Typography className="text-sm font-bold text-slate-900">
                      {formatTHB(tenant.revenueThisMonth)}
                    </Typography>
                    <Typography className="text-xs text-slate-500">
                      {tenant.bookingsThisMonth} booking เดือนนี้
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          className="rounded-3xl! border border-slate-200 bg-white"
        >
          <CardContent className="p-5!">
            <Typography className="text-lg font-black text-slate-950">
              Provisioning pipeline
            </Typography>
            <Typography className="mt-1 text-sm text-slate-500">
              ขั้นตอนจากสมัครเจ้าของร้านจนร้านออนไลน์
            </Typography>

            <Stack spacing={3} className="mt-5">
              {[
                ["สมัครเจ้าของร้าน", 100],
                ["ตั้งชื่อร้านและ slug", 86],
                ["สร้าง subdomain", 72],
                ["ตรวจ DNS / wildcard", 62],
                ["เปิด storefront", 58],
              ].map(([label, value]) => (
                <Box key={label}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography className="text-sm font-bold text-slate-800">
                      {label}
                    </Typography>
                    <Typography className="text-sm text-slate-500">
                      {value}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Number(value)}
                    className="mt-2 rounded-full!"
                    sx={{ height: 8, bgcolor: "rgb(226 232 240)" }}
                  />
                </Box>
              ))}
            </Stack>

            <Divider className="my-5! border-slate-200!" />

            <Stack spacing={1.25}>
              {DOMAINS.map((domain) => (
                <Stack
                  key={domain.id}
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  className="rounded-2xl bg-slate-50 px-3 py-2"
                >
                  <Typography className="text-sm font-semibold text-slate-900">
                    {domain.domain}
                  </Typography>
                  <Chip
                    size="small"
                    color={toneForStatus(domain.status)}
                    label={domainStatusLabel(domain.status)}
                  />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
