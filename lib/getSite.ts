import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

import { DEFAULT_SITE_DATA, makeSite, type Site, type SiteData } from "./site";

// SERVER-SIDE: reads the settings row from Supabase for the public pages.
// It uses only the public (publishable) key, so it can read only what the rules allow:
// the settings table is public for reading.
//
// `cache` makes the many calls on one page share ONE database read.
// If anything goes wrong, the fallback values are used so the page still works.
export const getSiteData = cache(async (): Promise<SiteData> => {
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
});

// What server components use:   const site = await getSite();   site.phoneUrl   site.whatsappUrl("Hi")
export async function getSite(): Promise<Site> {
  return makeSite(await getSiteData());
}