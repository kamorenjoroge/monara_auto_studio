'use client';

import { LogOut, Menu } from "lucide-react";

import { useAuth } from "./AuthProvider";

// The bar across the top: menu button (phones), the user's name and role, and Log out.
interface AdminTopbarProps {
  onMenuClick: () => void; // opens the side menu on phones
}

const AdminTopbar = ({ onMenuClick }: AdminTopbarProps) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* Left: menu button on phones */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block" />

      {/* Right: who is logged in */}
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-foreground">{user.name}</p>
          <span className="inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {user.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-secondary px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;