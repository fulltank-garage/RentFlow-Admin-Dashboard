"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { domainsService } from "@/src/services/domains/domains.service";
import type { PlatformDomain } from "@/src/services/domains/domains.types";
import type { PlatformHosts } from "@/src/services/overview/overview.types";

function statusColor(status: string) {
  if (status === "verified") return "success";
  if (status === "pending_dns" || status === "pending") return "warning";
  return "error";
}

function domainStatusLabel(status: string) {
  const map: Record<string, string> = {
    verified: "ยืนยันแล้ว",
    pending_dns: "รอ DNS",
    pending: "รอตรวจสอบ",
    conflict: "มีปัญหา",
  };
  return map[status] || status;
}

function formatCheckedAt(value?: string) {
  if (!value) return "ยังไม่ได้ตรวจ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function DomainsPage() {
  const [hosts, setHosts] = React.useState<PlatformHosts | null>(null);
  const [domains, setDomains] = React.useState<PlatformDomain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadDomains = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const response = await domainsService.listDomains();
      setHosts(response.hosts);
      setDomains(response.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลโดเมนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadDomains();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDomains]);

  useAdminRealtimeRefresh({
    events: ["tenant.updated"],
    onRefresh: loadDomains,
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          โดเมนและ Subdomain ของร้าน
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          ตรวจ route สำหรับหน้าร้านสาธารณะของแต่ละร้านจากข้อมูลจริง
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box className="grid min-h-72 place-items-center rounded-[32px] bg-white">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box className="grid gap-4 md:grid-cols-3">
            <Card elevation={0} className="rounded-3xl! bg-white">
              <CardContent>
                <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Partner portal
                </Typography>
                <Typography className="mt-3 text-lg font-black text-slate-950">
                  {hosts?.partner || "-"}
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={0} className="rounded-3xl! bg-white">
              <CardContent>
                <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Platform admin
                </Typography>
                <Typography className="mt-3 text-lg font-black text-slate-950">
                  {hosts?.admin || "-"}
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={0} className="rounded-3xl! bg-white">
              <CardContent>
                <Typography className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Storefront target
                </Typography>
                <Typography className="mt-3 text-lg font-black text-slate-950">
                  {hosts?.cnameTarget || "-"}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Card elevation={0} className="rounded-3xl! bg-white">
            <CardContent className="p-0!">
              {domains.length === 0 ? (
                <Box className="grid min-h-64 place-items-center text-center">
                  <Typography className="text-sm text-slate-500">
                    ยังไม่มีโดเมนร้านในระบบ
                  </Typography>
                </Box>
              ) : (
                domains.map((domain, index) => (
                  <Box key={domain.id}>
                    <Box className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-center">
                      <Box>
                        <Typography className="text-lg font-black text-slate-950">
                          {domain.domain}
                        </Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          {domain.shopName || domain.tenantId}
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
                        ตรวจล่าสุด {formatCheckedAt(domain.lastCheckedAt)}
                      </Typography>
                    </Box>
                    {index < domains.length - 1 ? (
                      <Divider className="border-slate-200!" />
                    ) : null}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}
