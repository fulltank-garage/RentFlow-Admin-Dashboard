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
