import { requestAdmin } from "../core/api-client.service";
import type {
  PlatformSecurity,
  PlatformSecurityMember,
  PlatformSecurityMemberInput,
} from "./security.types";

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

  createPlatformMember(input: PlatformSecurityMemberInput) {
    return requestAdmin<PlatformSecurityMember>("/platform/security/members", {
      method: "POST",
      data: input,
    });
  },

  updatePlatformMember(id: string, input: PlatformSecurityMemberInput) {
    return requestAdmin<PlatformSecurityMember>(
      `/platform/security/members/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        data: input,
      }
    );
  },

  deletePlatformMember(id: string) {
    return requestAdmin<null>(
      `/platform/security/members/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    );
  },
};
