export type PlatformTenantStatus = "active" | "pending" | "suspended" | "rejected";
export type PlatformTenantBookingMode = "payment" | "chat";

export type PlatformTenant = {
  id: string;
  ownerName?: string;
  ownerEmail: string;
  shopName: string;
  domainSlug: string;
  publicDomain: string;
  status: PlatformTenantStatus;
  bookingMode?: PlatformTenantBookingMode;
  plan: string;
  lifecycleReason?: string;
  cars?: number;
  totalBookings?: number;
  bookingsThisMonth?: number;
  revenueThisMonth?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePartnerPayload = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shopName: string;
  domainSlug: string;
  plan?: string;
  status?: PlatformTenantStatus;
};

export type CreatePartnerResponse = {
  tenant: PlatformTenant;
  user: {
    id: string;
    username?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
};

export type UpdateTenantSettingsResponse = {
  tenant?: Partial<PlatformTenant> & Pick<PlatformTenant, "id">;
};
