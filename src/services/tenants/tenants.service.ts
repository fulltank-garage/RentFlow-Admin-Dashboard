import { requestAdmin, resolveAdminAssetUrl } from "../core/api-client.service";
import type {
  PlatformTenant,
  PlatformTenantListResponse,
  PlatformTenantBookingMode,
  PlatformTenantStatus,
  UpdateTenantSettingsResponse,
} from "./tenants.types";

function normalizeTenant(tenant: PlatformTenant): PlatformTenant {
  return {
    ...tenant,
    logoUrl: resolveAdminAssetUrl(tenant.logoUrl),
  };
}

export const tenantsService = {
  async listTenants() {
    const response = await requestAdmin<PlatformTenantListResponse>(
      "/platform/tenants"
    );
    return {
      ...response,
      items: response.items.map(normalizeTenant),
    };
  },

  updateTenantStatus(tenantId: string, status: PlatformTenantStatus) {
    return requestAdmin<UpdateTenantSettingsResponse>(
      `/platform/tenants/${encodeURIComponent(tenantId)}/status`,
      {
        method: "PATCH",
        data: { status },
      }
    );
  },

  updateTenantSettings(
    tenantId: string,
    input: {
      status: PlatformTenantStatus;
      bookingMode: PlatformTenantBookingMode;
      chatThresholdTHB?: number;
      plan?: string;
      reason?: string;
    }
  ) {
    return requestAdmin<UpdateTenantSettingsResponse>(
      `/platform/tenants/${encodeURIComponent(tenantId)}/status`,
      {
        method: "PATCH",
        data: input,
      }
    );
  },
};
