import type {
  PlatformTenant,
  PlatformTenantStatus,
} from "../partners/partners.types";

export type { PlatformTenant, PlatformTenantStatus };

export type PlatformTenantListResponse = {
  items: PlatformTenant[];
  total: number;
};
