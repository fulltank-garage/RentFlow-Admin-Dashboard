export type PlatformTenantStatus = "active" | "pending" | "suspended";

export type PlatformTenant = {
  id: string;
  ownerName?: string;
  ownerEmail: string;
  shopName: string;
  domainSlug: string;
  publicDomain: string;
  status: PlatformTenantStatus;
  plan: string;
  cars?: number;
  totalBookings?: number;
  bookingsThisMonth?: number;
  revenueThisMonth?: number;
  createdAt?: string;
  updatedAt?: string;
};
