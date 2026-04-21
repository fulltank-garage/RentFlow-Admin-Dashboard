import type { SvgIconComponent } from "@mui/icons-material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
  caption: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: "ภาพรวมระบบ",
    href: "/admin/dashboard",
    icon: DashboardRoundedIcon,
    caption: "Platform overview",
  },
  {
    label: "ร้านเช่ารถ",
    href: "/admin/tenants",
    icon: StorefrontRoundedIcon,
    caption: "Tenant management",
  },
  {
    label: "โดเมนร้าน",
    href: "/admin/domains",
    icon: DnsRoundedIcon,
    caption: "Subdomain routing",
  },
  {
    label: "เจ้าของร้าน",
    href: "/admin/partners",
    icon: PeopleAltRoundedIcon,
    caption: "Owner approval",
  },
  {
    label: "แผนและรายได้",
    href: "/admin/billing",
    icon: PaymentsRoundedIcon,
    caption: "Billing control",
  },
  {
    label: "ความปลอดภัย",
    href: "/admin/security",
    icon: ShieldRoundedIcon,
    caption: "Access policy",
  },
  {
    label: "AI Insights",
    href: "/admin/ai",
    icon: AutoAwesomeRoundedIcon,
    caption: "AI summary",
  },
];
