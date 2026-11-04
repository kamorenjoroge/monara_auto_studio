import { Suspense } from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// The layout for the PUBLIC website only: NavBar on top, Footer at the bottom.
// Save this file as app/(site)/layout.tsx
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<header className="h-16 border-b border-border bg-white" />}>
        <NavBar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}