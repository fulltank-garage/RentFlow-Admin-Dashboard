import type { PlatformDomain } from "../domains/domains.types";
import type { PlatformTenant } from "../partners/partners.types";

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
