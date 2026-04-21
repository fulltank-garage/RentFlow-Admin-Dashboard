export type PlatformAiMetric = {
  label: string;
  displayValue: string | number;
  detail: string;
  tone: "default" | "success" | "warning" | "info" | "danger";
};

export type PlatformAiAlert = {
  tone: "success" | "warning" | "info" | "danger";
  title: string;
  detail: string;
};

export type PlatformAiAction = {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
};

export type PlatformAiGrowthTenant = {
  id: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  domainSlug: string;
  publicDomain: string;
  status: string;
  plan: string;
  cars: number;
  totalBookings: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
  createdAt: string;
  updatedAt: string;
};

export type PlatformAiRiskTenant = {
  tenantId: string;
  shopName: string;
  publicDomain: string;
  status: string;
  reason: string;
};

export type PlatformAiAssistant = {
  provider: string;
  summary: string;
  metrics: PlatformAiMetric[];
  alerts: PlatformAiAlert[];
  actions: PlatformAiAction[];
  growthTenants: PlatformAiGrowthTenant[];
  riskTenants: PlatformAiRiskTenant[];
  generatedAt: string;
};
