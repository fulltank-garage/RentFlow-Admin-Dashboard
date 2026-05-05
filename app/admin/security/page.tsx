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
  Stack,
  TextField,
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
    disabled: "ปิดใช้งาน",
  };
  return map[status] || status;
}

function statusColor(status: string) {
  if (status === "active" || status === "configured") return "success";
  if (status === "pending") return "warning";
  return "error";
}

const PLATFORM_PERMISSION_OPTIONS = [
  { key: "tenants.write", label: "จัดการร้าน" },
  { key: "billing.write", label: "จัดการ billing" },
  { key: "security.write", label: "จัดการสิทธิ์" },
  { key: "domains.write", label: "จัดการโดเมน" },
  { key: "reports.read", label: "ดูรายงาน" },
] as const;

function platformRoleLabel(role?: string) {
  const labels: Record<string, string> = {
    owner: "เจ้าของระบบ",
    admin: "ผู้ดูแลระบบ",
    support: "ดูแลร้าน",
    finance: "การเงิน",
  };
  return labels[role || ""] || role || "-";
}

export default function SecurityPage() {
  const [security, setSecurity] = React.useState<PlatformSecurity | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [busyUserId, setBusyUserId] = React.useState("");
  const [memberEmail, setMemberEmail] = React.useState("");
  const [memberName, setMemberName] = React.useState("");
  const [memberRole, setMemberRole] = React.useState<"owner" | "admin" | "support" | "finance">("admin");
  const [memberPermissions, setMemberPermissions] = React.useState<string[]>([
    "tenants.write",
    "domains.write",
  ]);

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
    events: ["tenant.updated", "support.changed", "member.changed"],
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

  function togglePermission(permission: string) {
    setMemberPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  }

  async function createPlatformMember() {
    try {
      await securityService.createPlatformMember({
        email: memberEmail,
        name: memberName,
        role: memberRole,
        permissions: memberRole === "owner" ? ["*"] : memberPermissions,
        status: "active",
      });
      setMemberEmail("");
      setMemberName("");
      await loadSecurity();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เพิ่มผู้ดูแลระบบไม่สำเร็จ");
    }
  }

  async function togglePlatformMemberStatus(memberId: string, nextStatus: string) {
    const member = security?.platformMembers?.find((item) => item.id === memberId);
    if (!member) return;
    try {
      await securityService.updatePlatformMember(memberId, {
        email: member.email,
        name: member.name,
        role: member.role,
        permissions: member.permissions || [],
        status: nextStatus,
      });
      await loadSecurity();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "อัปเดตผู้ดูแลระบบไม่สำเร็จ");
    }
  }

  return (
    <Box className="admin-page">
      <Box className="admin-page-header">
        <Typography className="admin-page-title">
          ความปลอดภัยและสิทธิ์การเข้าถึง
        </Typography>
        <Typography className="admin-page-subtitle">
          แยกสิทธิ์ระหว่างผู้ดูแลระบบ เจ้าของร้าน และลูกค้าหน้าร้าน
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box className="admin-surface grid min-h-72 place-items-center rounded-[32px]">
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
              <Card key={String(label)} elevation={0} className="admin-card rounded-3xl!">
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

          <Card elevation={0} className="admin-card rounded-3xl!">
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

          <Card elevation={0} className="admin-card rounded-3xl!">
            <CardContent className="p-5!">
              <Typography className="text-lg font-black text-slate-950">
                ทีมผู้ดูแลระบบกลาง
              </Typography>
              <Typography className="mt-1 text-sm text-slate-500">
                เพิ่มผู้ดูแลระบบและกำหนดสิทธิ์ให้แยกตามหน้าที่
              </Typography>
              <Stack spacing={1.5} className="mt-4">
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <TextField label="อีเมล" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} fullWidth />
                  <TextField label="ชื่อ" value={memberName} onChange={(e) => setMemberName(e.target.value)} fullWidth />
                  <TextField select label="บทบาท" value={memberRole} onChange={(e) => setMemberRole(e.target.value as typeof memberRole)} className="md:min-w-48">
                    <MenuItem value="admin">ผู้ดูแลระบบ</MenuItem>
                    <MenuItem value="support">ดูแลร้าน</MenuItem>
                    <MenuItem value="finance">การเงิน</MenuItem>
                    <MenuItem value="owner">เจ้าของระบบ</MenuItem>
                  </TextField>
                </Stack>
                {memberRole !== "owner" ? (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {PLATFORM_PERMISSION_OPTIONS.map((permission) => {
                      const active = memberPermissions.includes(permission.key);
                      return (
                        <Button
                          key={permission.key}
                          size="small"
                          variant={active ? "contained" : "outlined"}
                          onClick={() => togglePermission(permission.key)}
                        >
                          {permission.label}
                        </Button>
                      );
                    })}
                  </Stack>
                ) : null}
                <Button variant="contained" onClick={createPlatformMember} className="self-start">
                  เพิ่มผู้ดูแลระบบ
                </Button>
              </Stack>
              <Stack divider={<Divider />} className="mt-5">
                {(security.platformMembers || []).map((member) => (
                  <Box key={member.id} className="py-3">
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="justify-between">
                      <Box>
                        <Typography className="font-black text-slate-950">
                          {member.name || member.email}
                        </Typography>
                        <Typography className="mt-1 text-sm text-slate-500">
                          {member.email} • {platformRoleLabel(member.role)}
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" className="mt-2">
                          <Chip label={statusLabel(member.status)} className={member.status === "active" ? "admin-chip admin-chip-green" : "admin-chip admin-chip-rose"} />
                          {(member.permissions || []).slice(0, 6).map((permission) => (
                            <Chip key={`${member.id}-${permission}`} label={permission === "*" ? "ทุกสิทธิ์" : permission} className="admin-chip" />
                          ))}
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1} className="md:self-center">
                        <Button
                          variant="outlined"
                          onClick={() => togglePlatformMemberStatus(member.id, member.status === "active" ? "disabled" : "active")}
                        >
                          {member.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={async () => {
                            await securityService.deletePlatformMember(member.id);
                            await loadSecurity();
                          }}
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} className="admin-card rounded-3xl!">
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

          <Card elevation={0} className="admin-card rounded-3xl!">
            <CardContent className="p-5!">
              <Typography className="text-lg font-black text-slate-950">
                ประวัติการเข้าสู่ระบบล่าสุด
              </Typography>
              <Stack divider={<Divider />} className="mt-3">
                {(security.sessionAudits || []).slice(0, 12).map((item) => (
                  <Box key={item.id} className="py-3">
                    <Typography className="font-black text-slate-950">
                      {item.userEmail || item.userId || "-"} • {item.action === "logout" ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
                    </Typography>
                    <Typography className="mt-1 text-sm text-slate-500">
                      {item.app} • {item.ip || "-"} • {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Box>
  );
}
