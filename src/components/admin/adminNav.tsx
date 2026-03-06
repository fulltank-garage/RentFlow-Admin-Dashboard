import type { SvgIconComponent } from "@mui/icons-material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ExtensionRoundedIcon from "@mui/icons-material/ExtensionRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";

export type AdminNavGroup =
  | "Operations"
  | "Sales"
  | "Finance"
  | "Analytics"
  | "Administration";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
  group: AdminNavGroup;
  badge?: string;
  color?: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: "แดชบอร์ด",
    href: "/admin/dashboard",
    icon: DashboardRoundedIcon,
    group: "Operations",
    color: "#3B82F6",
  },
  {
    label: "การจอง",
    href: "/admin/bookings",
    icon: CalendarMonthRoundedIcon,
    group: "Operations",
    color: "#6366F1",
  },
  {
    label: "ปฏิทินรถ",
    href: "/admin/calendar",
    icon: EventNoteRoundedIcon,
    group: "Operations",
    color: "#8B5CF6",
  },
  {
    label: "จัดการรถ",
    href: "/admin/cars",
    icon: DirectionsCarRoundedIcon,
    group: "Operations",
    color: "#0EA5E9",
  },
  {
    label: "บริการเสริม",
    href: "/admin/addons",
    icon: ExtensionRoundedIcon,
    group: "Operations",
    color: "#14B8A6",
  },
  {
    label: "จุดรับ-ส่ง / สาขา",
    href: "/admin/locations",
    icon: PlaceRoundedIcon,
    group: "Operations",
    color: "#10B981",
  },
  {
    label: "ลูกค้า",
    href: "/admin/customers",
    icon: PeopleAltRoundedIcon,
    group: "Sales",
    color: "#F59E0B",
  },
  {
    label: "จองผ่านแชท",
    href: "/admin/leads",
    icon: ForumRoundedIcon,
    group: "Sales",
    color: "#F97316",
  },
  {
    label: "โปรโมชัน",
    href: "/admin/promotions",
    icon: LocalOfferRoundedIcon,
    group: "Sales",
    color: "#EF4444",
  },
  {
    label: "การชำระเงิน",
    href: "/admin/payments",
    icon: PaymentsRoundedIcon,
    group: "Finance",
    color: "#22C55E",
  },
  {
    label: "ตรวจสลิป/ยืนยันชำระ",
    href: "/admin/payment-verification",
    icon: FactCheckRoundedIcon,
    group: "Finance",
    color: "#16A34A",
  },

  {
    label: "รายงาน",
    href: "/admin/reports",
    icon: AssessmentRoundedIcon,
    group: "Analytics",
    color: "#7C3AED",
  },
  {
    label: "ซัพพอร์ต",
    href: "/admin/support",
    icon: SupportAgentRoundedIcon,
    group: "Administration",
    color: "#EC4899",
  },
  // {
  //   label: "ผู้ใช้แอดมิน/สิทธิ์",
  //   href: "/admin/admin-users",
  //   icon: AdminPanelSettingsRoundedIcon,
  //   group: "Administration",
  //   color: "#334155",
  // },
];
