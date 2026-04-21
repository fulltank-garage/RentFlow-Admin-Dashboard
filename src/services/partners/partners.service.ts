import { requestAdmin } from "../core/api-client.service";
import type { PlatformTenant } from "./partners.types";

export const partnersService = {
  listPartners() {
    return requestAdmin<{ items: PlatformTenant[]; total: number }>(
      "/platform/partners"
    );
  },
};
