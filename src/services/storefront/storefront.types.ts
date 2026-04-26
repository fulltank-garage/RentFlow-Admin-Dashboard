export type StorefrontBlock = {
  id?: string;
  type?: "text" | "feature" | "cta" | "announcement";
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
  tone?: "default" | "highlight" | "dark" | "success";
  align?: "left" | "center";
};

export type StorefrontPage = {
  id?: string;
  scope: "tenant" | "marketplace";
  page: string;
  blocks: StorefrontBlock[];
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    surfaceColor?: string;
  };
  isPublished?: boolean;
};
