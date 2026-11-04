import type { Metadata } from "next";

import { AuthProvider } from "./AuthProvider";

// Keep the admin area out of Google
export const metadata: Metadata = {
  title: "Admin | Monara Auto Studio",
  robots: { index: false, follow: false },
};

// Wraps EVERY admin page (the login page and the dashboard) so they all know who is logged in.
// Save this file as app/admin/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}