import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  TENANTS,
  formatTHB,
  tenantStatusLabel,
  type TenantStatus,
} from "@/src/data/platform";

function statusColor(status: TenantStatus) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  return "error";
}

export default function TenantsPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          ร้านเช่ารถทั้งหมด
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          ใช้ดูแล tenant ที่สร้างจาก partner portal และตรวจความพร้อมก่อนเปิดร้าน
        </Typography>
      </Box>

      <Card
        elevation={0}
        className="rounded-3xl! border border-slate-200 bg-white"
      >
        <CardContent className="p-0!">
          {TENANTS.map((tenant, index) => (
            <Box key={tenant.id}>
              <Box className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.7fr_0.65fr_auto] lg:items-center">
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography className="text-lg font-black text-slate-950">
                      {tenant.shopName}
                    </Typography>
                    <Chip
                      size="small"
                      color={statusColor(tenant.status)}
                      label={tenantStatusLabel(tenant.status)}
                    />
                  </Stack>
                  <Typography className="mt-1 text-sm text-slate-500">
                    {tenant.ownerName} • {tenant.ownerEmail}
                  </Typography>
                </Box>

                <Box>
                  <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Public URL
                  </Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {tenant.publicDomain}
                  </Typography>
                </Box>

                <Box>
                  <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Month revenue
                  </Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {formatTHB(tenant.revenueThisMonth)}
                  </Typography>
                </Box>

                <Box className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                  {tenant.cars} คัน • {tenant.plan}
                </Box>
              </Box>
              {index < TENANTS.length - 1 ? (
                <Divider className="border-slate-200!" />
              ) : null}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
}
