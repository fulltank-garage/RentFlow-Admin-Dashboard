import { requestAdmin } from "../core/api-client.service";
import type { PlatformSecurity } from "./security.types";

export const securityService = {
  getSecurity() {
    return requestAdmin<PlatformSecurity>("/platform/security");
  },

  updateUserSecurity(
    userId: string,
    input: { status: "active" | "locked" | "disabled"; reason?: string; revokeSession?: boolean }
  ) {
    return requestAdmin<{ user: { id: string; status: string; lockedReason?: string } }>(
      `/platform/security/users/${encodeURIComponent(userId)}`,
      {
        method: "PATCH",
        data: input,
      }
    );
  },
};
