'use client';

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import type { Role } from "@/lib/auth";
import { useAuth } from "./AuthProvider";

// A REUSABLE ROLE CHECK for pages only some roles may open.
// Hiding a menu item is not enough: someone can type the address by hand.
// Wrap the page's content like this:
//   <RoleGuard roles={["admin"]}> ...the page... </RoleGuard>
interface RoleGuardProps {
  roles: Role[]; // the roles allowed to see this page
  children: React.ReactNode;
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) return null; // the main guard already sends them to login

  if (!roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-heading text-lg font-bold uppercase tracking-wide text-foreground">
          No access
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have permission to open this page.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}