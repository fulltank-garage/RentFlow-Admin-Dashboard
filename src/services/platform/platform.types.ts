export type TenantStatus = "active" | "pending" | "suspended";
export type DomainStatus = "verified" | "pending_dns" | "conflict";

export type Tenant = {
  id: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  slug: string;
  publicDomain: string;
  status: TenantStatus;
  plan: "Starter" | "Growth" | "Enterprise";
  cars: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
  createdAt: string;
};

export type DomainRecord = {
  id: string;
  tenantId: string;
  domain: string;
  target: string;
  status: DomainStatus;
  lastCheckedAt: string;
};
