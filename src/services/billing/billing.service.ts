import { requestAdmin } from "../core/api-client.service";
import type { PlatformBilling, PlatformInvoiceStatus } from "./billing.types";

export const billingService = {
  getBilling() {
    return requestAdmin<PlatformBilling>("/platform/billing");
  },

  updateInvoiceStatus(
    invoiceId: string,
    input: {
      status: PlatformInvoiceStatus;
      paymentMethod?: string;
      paidAmount?: number;
      note?: string;
    }
  ) {
    return requestAdmin<NonNullable<PlatformBilling["invoices"]>[number]>(
      `/platform/billing/invoices/${encodeURIComponent(invoiceId)}`,
      {
        method: "PATCH",
        data: input,
      }
    );
  },
};
