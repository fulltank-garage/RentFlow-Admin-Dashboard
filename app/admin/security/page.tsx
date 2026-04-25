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
  Stack,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { securityService } from "@/src/services/security/security.service";
import type { PlatformSecurity } from "@/src/services/security/security.types";

function statusLabel(status: string) {
  const map: Record<string, string> = {
    active: "เปิดใช้งาน",
    configured: "ตั้งค่าแล้ว",
    pending: "รอตั้งค่า",
    missing: "ยังไม่พร้อม",
  };
  return map[status] || status;
}

function statusColor(status: string) {
  if (status === "active" || status === "configured") return "success";
  if (status === "pending") return "warning";
  return "error";
}

export default function SecurityPage() {
  const [security, setSecurity] = React.useState<PlatformSecurity | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [busyUserId, setBusyUserId] = React.useState("");

  const loadSecurity = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      setSecurity(await securityService.getSecurity());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "โหลดข้อมูลความปลอดภัยไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadSecurity();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadSecurity]);

  useAdminRealtimeRefresh({
    events: ["tenant.updated", "support.changed"],
    onRefresh: loadSecurity,
  });

  async function lockMember(userId?: string) {
    if (!userId) {
      setError("สมาชิกนี้ยังไม่ได้ผูกบัญชีผู้ใช้");
      return;
    }
    setBusyUserId(userId);
    try {
      await securityService.updateUserSecurity(userId, {
        status: "locked",
        reason: "ล็อกโดยผู้ดูแลระบบกลาง",
        revokeSession: true,
      });
      await loadSecurity();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "ล็อกผู้ใช้ไม่สำเร็จ");
    } finally {
      setBusyUserId("");
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          ความปลอดภัยและสิทธิ์การเข้าถึง
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          แยกสิทธิ์ระหว่างผู้ดูแลระบบ เจ้าของร้าน และลูกค้าหน้าร้าน
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box className="grid min-h-72 place-items-center rounded-[32px] bg-white">
          <CircularProgress />
        </Box>
      ) : security ? (
        <>
          <Box className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["ผู้ดูแลระบบกลาง", security.summary.platformAdminConfigured ? "พร้อม" : "ยังไม่พร้อม"],
              ["เจ้าของร้าน", security.summary.tenantOwners],
              ["สมาชิกในร้าน", security.summary.tenantMembers],
              ["LINE OA", security.summary.connectedLineChannels],
              ["โดเมนยืนยันแล้ว", security.summary.verifiedCustomDomains],
              ["ร้านถูกระงับ", security.summary.suspendedTenants],
            ].map(([label, value]) => (
              <Card key={String(label)} elevation={0} className="rounded-3xl! bg-white">
                <CardContent className="p-5!">
                  <Typography className="text-sm text-slate-500">
                    {label}
                  </Typography>
                  <Typography className="mt-2 text-2xl font-black text-slate-950">
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Card elevation={0} className="rounded-3xl! bg-white">
            <CardContent className="p-0!">
              {security.policies.map((policy, index) => (
                <Box key={policy.title}>
                  <Box className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <Box>
                      <Typography className="text-lg font-black text-slate-950">
                        {policy.title}
                      </Typography>
                      <Typography className="mt-1 text-sm text-slate-500">
                        {policy.detail}
                      </Typography>
                    </Box>
                    <Chip
                      color={statusColor(policy.status)}
                      label={statusLabel(policy.status)}
                    />
                  </Box>
                  {index < security.policies.length - 1 ? (
                    <Divider className="border-slate-200!" />
                  ) : null}
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card elevation={0} className="rounded-3xl! bg-white">
            <CardContent className="p-0!">
              {(security.members || []).length === 0 ? (
                <Box className="p-5">
                  <Typography className="text-sm text-slate-500">
                    ยังไม่มีสมาชิกในร้าน
                  </Typography>
                </Box>
              ) : (
                (security.members || []).slice(0, 12).map((member, index) => (
                  <Box key={member.id}>
                    <Box className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                      <Box>
                        <Typography className="text-lg font-black text-slate-950">
                          {member.name || member.email}
                        </Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          {member.email} • สิทธิ์ {member.role}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled={!member.userId || busyUserId === member.userId}
                        onClick={() => lockMember(member.userId)}
                      >
                        ล็อกและออกจากระบบ
                      </Button>
                    </Box>
                    {index < (security.members || []).length - 1 ? (
                      <Divider className="border-slate-200!" />
                    ) : null}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
