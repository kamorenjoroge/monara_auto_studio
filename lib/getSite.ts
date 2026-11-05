import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { DEFAULT_SITE_DATA, makeSite, type Site, type SiteData } from "./site";

// SERVER-SIDE: reads the settings row from Supabase for the public pages.
// It uses only the public (publishable) key, so it can read only what the rules allow:
// the settings table is public for reading.
//
// "use cache" tells Next.js to REMEMBER the result for a while, so pages do not wait for the
// database on every visit or navigation. That is what keeps navigation instant.
// The contact details change rarely, so a few minutes is fine.
// If anything goes wrong, the fallback values are used so the page still works.
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("minutes"); // remembered for about a minute, then refreshed in the background
  cacheTag("site-settings"); // a name, so we can refresh it on demand later

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase.from("settings").select("*").eq("id", "site").single();
    if (error || !data) return DEFAULT_SITE_DATA;

    return {
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address,
      hoursWeekdays: data.hours_weekdays,
      hoursSaturday: data.hours_saturday,
      hoursSunday: data.hours_sunday,
      instagram: data.instagram,
      facebook: data.facebook,
      tiktok: data.tiktok,
    };
  } catch {
    return DEFAULT_SITE_DATA;
  }
}

// What server components use:   const site = await getSite();   site.phoneUrl   site.whatsappUrl("Hi")
export async function getSite(): Promise<Site> {
  return makeSite(await getSiteData());
}