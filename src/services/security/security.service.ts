import { requestAdmin } from "../core/api-client.service";
import type { PlatformSecurity } from "./security.types";

export const securityService = {
  getSecurity() {
    return requestAdmin<PlatformSecurity>("/platform/security");
  },
};
