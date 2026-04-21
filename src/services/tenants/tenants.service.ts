import { requestAdmin } from "../core/api-client.service";
import type {
  PlatformTenantListResponse,
  PlatformTenantStatus,
} from "./tenants.types";

export const tenantsService = {
  listTenants() {
    return requestAdmin<PlatformTenantListResponse>("/platform/tenants");
  },

  updateTenantStatus(tenantId: string, status: PlatformTenantStatus) {
    return requestAdmin<null>(
      `/platform/tenants/${encodeURIComponent(tenantId)}/status`,
      {
        method: "PATCH",
        data: { status },
      }
    );
  },
};
