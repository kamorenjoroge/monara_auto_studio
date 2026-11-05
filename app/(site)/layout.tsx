import { Suspense } from "react";

import { getSiteData } from "@/lib/getSite";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { SiteProvider } from "./components/SiteProvider";

// The layout for the PUBLIC website: it reads the settings once, shares them with every
// client component through SiteProvider, and draws the NavBar and Footer.
// Save this file as app/(site)/layout.tsx
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <SiteShell>{children}</SiteShell>
    </Suspense>
  );
}

// Reads the settings from the database, then draws the frame of the website
async function SiteShell({ children }: { children: React.ReactNode }) {
  const data = await getSiteData();

  return (
    <SiteProvider data={data}>
      <Suspense fallback={<header className="h-16 border-b border-border bg-white" />}>
        <NavBar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </SiteProvider>
  );
}