import { requestAdmin } from "../core/api-client.service";
import type { StorefrontBlock, StorefrontPage } from "./storefront.types";

export const storefrontService = {
  getMarketplaceHomePage() {
    return requestAdmin<StorefrontPage>("/platform/storefront/page?page=home");
  },

  saveMarketplaceHomePage(blocks: StorefrontBlock[]) {
    return requestAdmin<StorefrontPage>("/platform/storefront/page", {
      method: "PUT",
      data: {
        page: "home",
        blocks,
        theme: {},
        isPublished: true,
      },
    });
  },
};
