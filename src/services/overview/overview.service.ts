import { requestAdmin } from "../core/api-client.service";
import type { PlatformOverview } from "./overview.types";

export const overviewService = {
  getOverview() {
    return requestAdmin<PlatformOverview>("/platform/overview");
  },
};
