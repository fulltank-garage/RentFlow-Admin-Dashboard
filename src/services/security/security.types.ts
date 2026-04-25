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
  members?: Array<{
    id: string;
    tenantId: string;
    userId?: string;
    email: string;
    name?: string;
    role: string;
    status: string;
  }>;
  platformMembers?: PlatformSecurityMember[];
  sessionAudits?: Array<{
    id: string;
    userId?: string;
    userEmail?: string;
    app: string;
    action: string;
    ip?: string;
    userAgent?: string;
    createdAt: string;
  }>;
};

export type PlatformSecurityMember = {
  id: string;
  userId?: string;
  email: string;
  name?: string;
  role: "owner" | "admin" | "support" | "finance";
  permissions?: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PlatformSecurityMemberInput = {
  email: string;
  name?: string;
  role: PlatformSecurityMember["role"];
  permissions?: string[];
  status?: string;
};
