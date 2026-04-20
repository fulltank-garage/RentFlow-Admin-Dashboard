import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

const policies = [
  {
    title: "Platform admin",
    detail: "จัดการ tenant, domain, owner approval และ billing",
    status: "ต้องใช้สิทธิ์สูงสุด",
  },
  {
    title: "Partner owner",
    detail: "จัดการร้านของตัวเองผ่าน partner.rentflow.com เท่านั้น",
    status: "จำกัดตาม tenant",
  },
  {
    title: "Public storefront",
    detail: "ลูกค้าเข้าผ่าน subdomain ของร้าน เช่น shop1.rentflow.com",
    status: "อ่านข้อมูลสาธารณะ",
  },
];

export default function SecurityPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          ความปลอดภัยและสิทธิ์การเข้าถึง
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          แยกสิทธิ์ระหว่าง admin รวม, owner แต่ละร้าน และลูกค้าหน้าร้าน
        </Typography>
      </Box>

      <Card elevation={0} className="rounded-3xl! border border-slate-200">
        <CardContent className="p-0!">
          {policies.map((policy, index) => (
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
                <Chip label={policy.status} />
              </Box>
              {index < policies.length - 1 ? <Divider /> : null}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
}
