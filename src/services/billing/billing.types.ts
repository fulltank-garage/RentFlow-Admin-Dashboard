import type { PlatformTenant } from "../partners/partners.types";

export type PlatformBilling = {
  items: PlatformTenant[];
  plans: Array<{
    plan: string;
    count: number;
    revenueThisMonth: number;
  }>;
  summary: {
    totalTenants: number;
    revenueThisMonth: number;
    activeTenantCount: number;
  };
};
