import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { TENANTS, tenantStatusLabel, type TenantStatus } from "@/src/data/platform";

function statusColor(status: TenantStatus) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  return "error";
}

export default function PartnersPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          เจ้าของร้าน
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          ตรวจข้อมูลเจ้าของร้านก่อนให้ใช้งาน partner portal และ subdomain
        </Typography>
      </Box>

      <Card elevation={0} className="rounded-3xl! border border-slate-200">
        <CardContent className="p-0!">
          {TENANTS.map((tenant, index) => (
            <Box key={tenant.id}>
              <Box className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center">
                <Box>
                  <Typography className="text-lg font-black text-slate-950">
                    {tenant.ownerName}
                  </Typography>
                  <Typography className="mt-1 text-sm text-slate-500">
                    {tenant.ownerEmail} • {tenant.shopName}
                  </Typography>
                </Box>
                <Chip
                  color={statusColor(tenant.status)}
                  label={tenantStatusLabel(tenant.status)}
                />
                <Typography className="text-sm font-semibold text-slate-700">
                  สร้างเมื่อ {tenant.createdAt}
                </Typography>
              </Box>
              {index < TENANTS.length - 1 ? <Divider /> : null}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
}
