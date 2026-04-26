import { requestAdmin } from "../core/api-client.service";
import type {
  PlatformTenantListResponse,
  PlatformTenantBookingMode,
  PlatformTenantStatus,
  UpdateTenantSettingsResponse,
} from "./tenants.types";

export const tenantsService = {
  listTenants() {
    return requestAdmin<PlatformTenantListResponse>("/platform/tenants");
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
