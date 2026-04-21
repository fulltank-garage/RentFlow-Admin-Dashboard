import { requestAdmin } from "../core/api-client.service";
import type { AuthUser, PlatformMe } from "./auth.types";

export const authService = {
  login(input: { username: string; password: string }) {
    return requestAdmin<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      data: input,
    });
  },

  logout() {
    return requestAdmin<null>("/auth/logout", {
      method: "POST",
    });
  },

  getMe() {
    return requestAdmin<PlatformMe>("/platform/me");
  },
};
