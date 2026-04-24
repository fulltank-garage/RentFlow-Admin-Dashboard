import {
  requestAdmin,
  resolveAdminAssetUrl,
} from "../core/api-client.service";
import type { PlatformSettings } from "./settings.types";

function normalizeSettings(settings: PlatformSettings): PlatformSettings {
  return {
    ...settings,
    promoImageUrl: resolveAdminAssetUrl(settings.promoImageUrl),
  };
}

export const settingsService = {
  async getPlatformSettings() {
    const settings = await requestAdmin<PlatformSettings>("/platform/settings");
    return normalizeSettings(settings);
  },

  async updatePlatformSettings(input: { promoImageUrl?: string | null }) {
    const settings = await requestAdmin<PlatformSettings>("/platform/settings", {
      method: "PUT",
      data: input,
    });
    return normalizeSettings(settings);
  },
};
