import { requestAdmin } from "../core/api-client.service";
import type { PlatformBilling } from "./billing.types";

export const billingService = {
  getBilling() {
    return requestAdmin<PlatformBilling>("/platform/billing");
  },
};
