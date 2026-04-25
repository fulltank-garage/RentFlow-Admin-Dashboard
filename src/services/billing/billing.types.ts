import type { PlatformTenant } from "../partners/partners.types";

export type PlatformBilling = {
  items: PlatformTenant[];
  invoices?: Array<{
    id: string;
    tenantId: string;
    period: string;
    plan: string;
    amount: number;
    status: string;
    issuedAt?: string;
    paidAt?: string;
  }>;
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
