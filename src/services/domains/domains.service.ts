import { requestAdmin } from "../core/api-client.service";
import type { PlatformHosts } from "../overview/overview.types";
import type { PlatformDomain } from "./domains.types";

export const domainsService = {
  listDomains() {
    return requestAdmin<{
      hosts: PlatformHosts;
      items: PlatformDomain[];
      total: number;
    }>("/platform/domains");
  },
};
