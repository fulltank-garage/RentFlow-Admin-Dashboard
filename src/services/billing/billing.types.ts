import type { PlatformTenant } from "../partners/partners.types";

export type PlatformBilling = {
  items: PlatformTenant[];
  invoices?: Array<{
    id: string;
    tenantId: string;
    period: string;
    plan: string;
    amount: number;
    paidAmount?: number;
    status: string;
    issuedAt?: string;
    dueAt?: string;
    paidAt?: string;
    paymentMethod?: string;
    paidBy?: string;
    note?: string;
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

export type PlatformInvoiceStatus = "open" | "paid" | "overdue" | "void";
