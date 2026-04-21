import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { TENANTS, formatTHB } from "@/src/services/platform/platform.data";

const plans = ["Starter", "Growth", "Enterprise"] as const;

export default function BillingPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="text-3xl font-black tracking-tight text-slate-950">
          แผนและรายได้
        </Typography>
        <Typography className="mt-2 text-sm text-slate-500">
          ภาพรวมรายได้และจำนวนร้านตามแผนบริการ
        </Typography>
      </Box>

      <Box className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const tenants = TENANTS.filter((tenant) => tenant.plan === plan);
          const revenue = tenants.reduce(
            (sum, tenant) => sum + tenant.revenueThisMonth,
            0
          );

          return (
            <Card
              key={plan}
              elevation={0}
              className="rounded-3xl! border border-slate-200 bg-white"
            >
              <CardContent className="p-5!">
                <Typography className="text-sm font-bold text-slate-500">
                  {plan}
                </Typography>
                <Typography className="mt-3 text-3xl font-black text-slate-950">
                  {tenants.length}
                </Typography>
                <Typography className="mt-1 text-sm text-slate-500">
                  ร้านในแผนนี้
                </Typography>
                <Typography className="mt-4 text-sm font-bold text-slate-900">
                  {formatTHB(revenue)}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Stack>
  );
}
