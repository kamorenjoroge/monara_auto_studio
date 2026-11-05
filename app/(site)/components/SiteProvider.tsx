'use client';

import { createContext, useContext, useMemo } from "react";

import { makeSite, type Site, type SiteData } from "@/lib/site";

// Lets CLIENT components (the NavBar, the Hero, the forms...) use the same contact details.
// The layout reads the settings on the server and hands the plain values to this provider.
// Save this file as app/(site)/components/SiteProvider.tsx
const SiteContext = createContext<Site | null>(null);

export function SiteProvider({
  data,
  children,
}: {
  data: SiteData;
  children: React.ReactNode;
}) {
  // Functions cannot travel from the server to the browser, so we rebuild the helpers here
  const site = useMemo(() => makeSite(data), [data]);

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

// What client components use:   const site = useSite();   site.phoneUrl   site.whatsappUrl("Hi")
export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used inside <SiteProvider>");
  return site;
}