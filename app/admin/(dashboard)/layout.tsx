'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useAuth } from "../AuthProvider";
import AdminSidebar from "../AdminSidebar";
import AdminTopbar from "../AdminTopbar";

// THE GUARD + THE FRAME of every dashboard page:
// not logged in → sent to login; logged in → sidebar on the left, top bar on top, page in the middle.
// Save this file as app/admin/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Is the side menu open? (only matters on phones)
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  const checking = loading || !user;

  // The sidebar reads the web address (to highlight the current page),
  // so Next.js wants it inside <Suspense>. The fallback is an empty white panel of the same size.
  const sidebarFallback = <div className="h-full bg-white" />;

  return (
    <>
      {/* The pages are ALWAYS rendered (they show nothing when nobody is logged in).
          While we check the login, this full-screen cover hides them. */}
      {checking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-muted-foreground">
          Loading...
        </div>
      )}

      <div className="min-h-screen lg:flex">
        {/* Side menu on large screens */}
        <aside className="hidden border-r border-border lg:block lg:w-64 lg:shrink-0">
          <div className="sticky top-0 h-screen">
            <Suspense fallback={sidebarFallback}>
              <AdminSidebar />
            </Suspense>
          </div>
        </aside>

        {/* Side menu on phones: slides over the page */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 shadow-xl">
              <Suspense fallback={sidebarFallback}>
                <AdminSidebar onNavigate={() => setMenuOpen(false)} />
              </Suspense>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top bar + the page */}
        <div className="flex min-w-0 flex-1 flex-col bg-muted/40">
          <AdminTopbar onMenuClick={() => setMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}