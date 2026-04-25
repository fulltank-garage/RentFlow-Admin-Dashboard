import { requestAdmin } from "../core/api-client.service";
import type {
  CreatePartnerPayload,
  CreatePartnerResponse,
  PlatformTenant,
} from "./partners.types";

export const partnersService = {
  listPartners() {
    return requestAdmin<{ items: PlatformTenant[]; total: number }>(
      "/platform/partners"
    );
  },

  createPartner(payload: CreatePartnerPayload) {
    return requestAdmin<CreatePartnerResponse>("/platform/partners", {
      method: "POST",
      data: payload,
    });
  },
};
