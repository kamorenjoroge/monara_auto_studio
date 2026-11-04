import {
  Car,
  ClipboardCheck,
  Images,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/lib/auth";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[]; // which roles can see this menu item
}

// THE MENU. To show or hide an item for a role, edit the `roles` list.
export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin", "seller"] },
  { label: "Cars", href: "/admin/cars", icon: Car, roles: ["admin", "seller"] },
  { label: "Approvals", href: "/admin/approvals", icon: ClipboardCheck, roles: ["admin"] },
  { label: "Sellers", href: "/admin/sellers", icon: Users, roles: ["admin"] },
  { label: "Services", href: "/admin/services", icon: Wrench, roles: ["admin"] },
  { label: "Packages", href: "/admin/packages", icon: Tag, roles: ["admin"] },
  { label: "Products", href: "/admin/products", icon: ShoppingBag, roles: ["admin"] },
  { label: "Gallery", href: "/admin/gallery", icon: Images, roles: ["admin"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"] },
];