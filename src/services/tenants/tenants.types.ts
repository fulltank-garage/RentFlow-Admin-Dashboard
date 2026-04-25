import type {
  PlatformTenant,
  PlatformTenantBookingMode,
  PlatformTenantStatus,
  UpdateTenantSettingsResponse,
} from "../partners/partners.types";

export type {
  PlatformTenant,
  PlatformTenantBookingMode,
  PlatformTenantStatus,
  UpdateTenantSettingsResponse,
};

export type PlatformTenantListResponse = {
  items: PlatformTenant[];
  total: number;
};
