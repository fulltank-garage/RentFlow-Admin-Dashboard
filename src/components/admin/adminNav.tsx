export type AdminNavGroup =
  | "Operations"
  | "Partners"
  | "Finance"
  | "Security"
  | "Settings";

export type AdminNavItem = {
  label: string;
  href: string;
  group: AdminNavGroup;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: "ภาพรวม",
    href: "/admin/dashboard",
    group: "Operations",
  },
  {
    label: "ร้านเช่ารถ",
    href: "/admin/tenants",
    group: "Operations",
  },
  {
    label: "โดเมนร้าน",
    href: "/admin/domains",
    group: "Operations",
  },
  {
    label: "เจ้าของร้าน",
    href: "/admin/partners",
    group: "Partners",
  },
  {
    label: "แผนและรายได้",
    href: "/admin/billing",
    group: "Finance",
  },
  {
    label: "ความปลอดภัย",
    href: "/admin/security",
    group: "Security",
  },
  {
    label: "ตั้งค่าหน้ารวม",
    href: "/admin/settings",
    group: "Settings",
  },
  {
    label: "จัดหน้าเว็บรวม",
    href: "/admin/store-builder",
    group: "Settings",
  },
  {
    label: "ผู้ช่วย AI",
    href: "/admin/ai",
    group: "Settings",
  },
];
