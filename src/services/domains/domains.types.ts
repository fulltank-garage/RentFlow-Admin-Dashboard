export type PlatformDomain = {
  id: string;
  tenantId: string;
  shopName?: string;
  ownerEmail?: string;
  ownerName?: string;
  domain: string;
  target: string;
  status: string;
  source?: string;
  lastCheckedAt?: string;
};
