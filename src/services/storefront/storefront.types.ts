export type StorefrontBlock = {
  id?: string;
  type?: "text" | "feature" | "cta" | "announcement";
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
};

export type StorefrontPage = {
  id?: string;
  scope: "tenant" | "marketplace";
  page: string;
  blocks: StorefrontBlock[];
};
