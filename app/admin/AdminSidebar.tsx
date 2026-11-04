'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, ExternalLink } from "lucide-react";

import { useAuth } from "./AuthProvider";
import { ADMIN_NAV } from "./adminNav";

// The side menu. It only shows the items the logged-in role is allowed to see.
interface AdminSidebarProps {
  onNavigate?: () => void; // used on phones, to close the menu after a click
}

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  // Keep only the menu items for this role
  const items = ADMIN_NAV.filter((item) => item.roles.includes(user.role));

  // The Dashboard link must match exactly, the others match nested pages too
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient">
          <Car className="h-5 w-5 text-primary-foreground" />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-base font-bold text-foreground">MONARA</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {user.role === "admin" ? "Admin panel" : "Seller panel"}
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin menu">
        {items.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive(href)
                ? "bg-primary/15 font-bold text-foreground"
                : "font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${isActive(href) ? "text-primary-dark" : "text-muted-foreground"}`}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Link back to the public website */}
      <div className="border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary/10"
        >
          <ExternalLink className="h-5 w-5" />
          View website
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;