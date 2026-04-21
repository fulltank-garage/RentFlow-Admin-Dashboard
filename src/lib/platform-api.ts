type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AuthUser = {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
};

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

export type PlatformDomain = {
  id: string;
  tenantId: string;
  shopName?: string;
  ownerEmail?: string;
  ownerName?: string;
  domain: string;
  target: string;
  status: string;
  source?: string;
  lastCheckedAt?: string;
};

export type PlatformHosts = {
  admin: string;
  partner: string;
  wildcardStorefront: string;
  cnameTarget: string;
};

export type PlatformOverview = {
  hosts: PlatformHosts;
  summary: {
    totalTenants: number;
    activeTenants: number;
    pendingTenants: number;
    suspendedTenants: number;
    verifiedDomains: number;
    domainsNeedingCare: number;
    revenueThisMonth: number;
  };
  recentTenants: PlatformTenant[];
  recentDomains: PlatformDomain[];
};

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

export type PlatformSecurity = {
  summary: {
    platformAdminConfigured: boolean;
    tenantOwners: number;
    tenantMembers: number;
    connectedLineChannels: number;
    verifiedCustomDomains: number;
    suspendedTenants: number;
  };
  policies: Array<{
    title: string;
    detail: string;
    status: string;
  }>;
};

export type PlatformMe = {
  user: AuthUser;
  hosts: PlatformHosts;
};

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(
    /\/$/,
    ""
  );
}

async function request<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok) {
    throw new Error(payload?.message || "เชื่อมต่อ API ไม่สำเร็จ");
  }

  return payload?.data as T;
}

export const platformApi = {
  login(input: { username: string; password: string }) {
    return request<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  logout() {
    return request<null>("/auth/logout", {
      method: "POST",
    });
  },

  getMe() {
    return request<PlatformMe>("/platform/me");
  },

  getOverview() {
    return request<PlatformOverview>("/platform/overview");
  },

  listPartners() {
    return request<{ items: PlatformTenant[]; total: number }>(
      "/platform/partners"
    );
  },

  listDomains() {
    return request<{ hosts: PlatformHosts; items: PlatformDomain[]; total: number }>(
      "/platform/domains"
    );
  },

  getBilling() {
    return request<PlatformBilling>("/platform/billing");
  },

  getSecurity() {
    return request<PlatformSecurity>("/platform/security");
  },

  listTenants() {
    return request<{ items: PlatformTenant[]; total: number }>(
      "/platform/tenants"
    );
  },

  updateTenantStatus(tenantId: string, status: PlatformTenantStatus) {
    return request<null>(
      `/platform/tenants/${encodeURIComponent(tenantId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },
};
