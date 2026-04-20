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
  DOMAINS,
  PLATFORM_HOSTS,
  domainStatusLabel,
  type DomainStatus,
} from "@/src/data/platform";

function statusColor(status: DomainStatus) {
  if (status === "verified") return "success";
  if (status === "pending_dns") return "warning";
  return "error";
}

export default function DomainsPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          โดเมนและ Subdomain ของร้าน
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          ตรวจ route สำหรับ public storefront ของแต่ละ tenant
        </Typography>
      </Box>

      <Box className="grid gap-4 md:grid-cols-3">
        <Card elevation={0} className="rounded-3xl! border border-slate-200">
          <CardContent>
            <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Partner portal
            </Typography>
            <Typography className="mt-3 text-lg font-black text-slate-950">
              {PLATFORM_HOSTS.partner}
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={0} className="rounded-3xl! border border-slate-200">
          <CardContent>
            <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Platform admin
            </Typography>
            <Typography className="mt-3 text-lg font-black text-slate-950">
              {PLATFORM_HOSTS.admin}
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={0} className="rounded-3xl! border border-slate-200">
          <CardContent>
            <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Storefront target
            </Typography>
            <Typography className="mt-3 text-lg font-black text-slate-950">
              {PLATFORM_HOSTS.cnameTarget}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card
        elevation={0}
        className="rounded-3xl! border border-slate-200 bg-white"
      >
        <CardContent className="p-0!">
          {DOMAINS.map((domain, index) => (
            <Box key={domain.id}>
              <Box className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-center">
                <Box>
                  <Typography className="text-lg font-black text-slate-950">
                    {domain.domain}
                  </Typography>
                  <Typography className="mt-1 text-sm text-slate-500">
                    Tenant ID: {domain.tenantId}
                  </Typography>
                </Box>
                <Box>
                  <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    CNAME target
                  </Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {domain.target}
                  </Typography>
                </Box>
                <Chip
                  color={statusColor(domain.status)}
                  label={domainStatusLabel(domain.status)}
                />
                <Typography className="text-sm text-slate-500">
                  checked {domain.lastCheckedAt}
                </Typography>
              </Box>
              {index < DOMAINS.length - 1 ? (
                <Divider className="border-slate-200!" />
              ) : null}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
}
