"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  platformApi,
  type PlatformTenant,
} from "@/src/lib/platform-api";

function tenantStatusLabel(status: PlatformTenant["status"]) {
  const map: Record<PlatformTenant["status"], string> = {
    active: "ใช้งานอยู่",
    pending: "รอตรวจสอบ",
    suspended: "ระงับชั่วคราว",
  };
  return map[status] || status;
}

function statusColor(status: PlatformTenant["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  return "error";
}

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState<PlatformTenant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);

  const loadTenants = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const response = await platformApi.listTenants();
      setTenants(response.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลร้านไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTenants();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadTenants]);

  async function updateStatus(
    tenant: PlatformTenant,
    status: PlatformTenant["status"]
  ) {
    try {
      await platformApi.updateTenantStatus(tenant.id, status);
      setSnackOpen(true);
      await loadTenants();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "อัปเดตร้านไม่สำเร็จ");
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          ร้านเช่ารถทั้งหมด
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          จัดการ tenant กลางจาก API จริง ระงับหรือเปิดร้านได้ทันที
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card
        elevation={0}
        className="rounded-3xl! border border-slate-200 bg-white"
      >
        <CardContent className="p-0!">
          {loading ? (
            <Box className="grid min-h-72 place-items-center">
              <CircularProgress />
            </Box>
          ) : tenants.length === 0 ? (
            <Box className="grid min-h-72 place-items-center text-center">
              <Typography className="text-sm text-slate-500">
                ยังไม่มีร้านในระบบ
              </Typography>
            </Box>
          ) : (
            tenants.map((tenant, index) => (
              <Box key={tenant.id}>
                <Box className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.8fr_auto] lg:items-center">
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
                      {tenant.ownerEmail} • {tenant.publicDomain}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Plan / Slug
                    </Typography>
                    <Typography className="mt-1 text-sm font-semibold text-slate-900">
                      {tenant.plan} • {tenant.domainSlug}
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                      select
                      size="small"
                      label="สถานะ"
                      value={tenant.status}
                      onChange={(event) =>
                        updateStatus(
                          tenant,
                          event.target.value as PlatformTenant["status"]
                        )
                      }
                      className="w-full sm:w-44"
                    >
                      <MenuItem value="active">ใช้งานอยู่</MenuItem>
                      <MenuItem value="pending">รอตรวจสอบ</MenuItem>
                      <MenuItem value="suspended">ระงับชั่วคราว</MenuItem>
                    </TextField>
                    <Button
                      href={`https://${tenant.publicDomain}`}
                      target="_blank"
                      variant="outlined"
                    >
                      เปิดหน้าร้าน
                    </Button>
                  </Stack>
                </Box>
                {index < tenants.length - 1 ? (
                  <Divider className="border-slate-200!" />
                ) : null}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          อัปเดตสถานะร้านสำเร็จ
        </Alert>
      </Snackbar>
    </Stack>
  );
}
