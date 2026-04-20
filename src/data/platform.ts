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

export const PLATFORM_HOSTS = {
  admin: "admin.rentflow.com",
  partner: "partner.rentflow.com",
  wildcardStorefront: "*.rentflow.com",
  cnameTarget: "storefront.rentflow.com",
};

export const TENANTS: Tenant[] = [
  {
    id: "tenant_velo",
    shopName: "Velo Premium Cars",
    ownerName: "Pachara S.",
    ownerEmail: "owner@velo.example",
    slug: "velo",
    publicDomain: "velo.rentflow.com",
    status: "active",
    plan: "Growth",
    cars: 42,
    bookingsThisMonth: 188,
    revenueThisMonth: 742000,
    createdAt: "2026-04-02",
  },
  {
    id: "tenant_north",
    shopName: "NorthRide Chiangmai",
    ownerName: "Narin K.",
    ownerEmail: "narin@northride.example",
    slug: "northride",
    publicDomain: "northride.rentflow.com",
    status: "active",
    plan: "Starter",
    cars: 18,
    bookingsThisMonth: 61,
    revenueThisMonth: 196400,
    createdAt: "2026-04-07",
  },
  {
    id: "tenant_siam",
    shopName: "Siam EV Rental",
    ownerName: "Ploy T.",
    ownerEmail: "ploy@siamev.example",
    slug: "siamev",
    publicDomain: "siamev.rentflow.com",
    status: "pending",
    plan: "Enterprise",
    cars: 57,
    bookingsThisMonth: 0,
    revenueThisMonth: 0,
    createdAt: "2026-04-18",
  },
  {
    id: "tenant_andaman",
    shopName: "Andaman Drive",
    ownerName: "Anan M.",
    ownerEmail: "anan@andaman.example",
    slug: "andaman",
    publicDomain: "andaman.rentflow.com",
    status: "suspended",
    plan: "Starter",
    cars: 11,
    bookingsThisMonth: 12,
    revenueThisMonth: 38400,
    createdAt: "2026-03-25",
  },
];

export const DOMAINS: DomainRecord[] = [
  {
    id: "dom_001",
    tenantId: "tenant_velo",
    domain: "velo.rentflow.com",
    target: PLATFORM_HOSTS.cnameTarget,
    status: "verified",
    lastCheckedAt: "2026-04-21 00:20",
  },
  {
    id: "dom_002",
    tenantId: "tenant_north",
    domain: "northride.rentflow.com",
    target: PLATFORM_HOSTS.cnameTarget,
    status: "verified",
    lastCheckedAt: "2026-04-21 00:18",
  },
  {
    id: "dom_003",
    tenantId: "tenant_siam",
    domain: "siamev.rentflow.com",
    target: PLATFORM_HOSTS.cnameTarget,
    status: "pending_dns",
    lastCheckedAt: "2026-04-21 00:12",
  },
  {
    id: "dom_004",
    tenantId: "tenant_andaman",
    domain: "andaman.rentflow.com",
    target: PLATFORM_HOSTS.cnameTarget,
    status: "conflict",
    lastCheckedAt: "2026-04-21 00:05",
  },
];

export function formatTHB(value: number) {
  const n = Number.isFinite(value) ? value : 0;
  return `${new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(n)} บาท`;
}

export function tenantStatusLabel(status: TenantStatus) {
  const map: Record<TenantStatus, string> = {
    active: "ใช้งานอยู่",
    pending: "รอตรวจสอบ",
    suspended: "ระงับชั่วคราว",
  };
  return map[status];
}

export function domainStatusLabel(status: DomainStatus) {
  const map: Record<DomainStatus, string> = {
    verified: "ยืนยันแล้ว",
    pending_dns: "รอ DNS",
    conflict: "มีปัญหา",
  };
  return map[status];
}
