import { whatsappLink } from "./types";

// ============================================================
// THE SITE'S CONTACT DETAILS.
// The real values live in the database (the `settings` table), and the admin changes them
// on the Settings page. This file only describes their shape, and holds fallback values
// that are used if the database cannot be reached.
// ============================================================

// The plain values, exactly as saved in the database
export interface SiteData {
  phone: string; // local format, e.g. 0745093837
  whatsapp: string; // with country code, e.g. 254745093837
  email: string;
  address: string;
  hoursWeekdays: string;
  hoursSaturday: string;
  hoursSunday: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

// The same values plus ready-made helpers that pages use
export interface Site extends SiteData {
  name: string;
  tagline: string;
  phoneDisplay: string; // "0745 093 837"
  phoneUrl: string; // "tel:0745093837"
  whatsappUrl: (message: string) => string; // the full WhatsApp link with the message attached
  hours: { days: string; time: string }[];
  socials: { name: string; url: string }[]; // only the links that are filled in
}

// Used when the database cannot be reached, so the website never breaks
export const DEFAULT_SITE_DATA: SiteData = {
  phone: "0745093837",
  whatsapp: "254745093837",
  email: "info@monaraautostudio.co.ke",
  address: "Mombasa Road, Nairobi, Kenya",
  hoursWeekdays: "8:00 AM – 6:00 PM",
  hoursSaturday: "9:00 AM – 5:00 PM",
  hoursSunday: "10:00 AM – 3:00 PM",
  instagram: "",
  facebook: "",
  tiktok: "",
};

// Turns the plain values into the full Site object. It works on the server AND in the browser.
export function makeSite(data: SiteData): Site {
  const { phone } = data;

  return {
    ...data,
    name: "Monara Auto Studio",
    tagline: "Your Car. Your Style. Your Legacy.",
    phoneDisplay: `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`.trim(),
    phoneUrl: `tel:${phone}`,
    whatsappUrl: (message: string) => whatsappLink(data.whatsapp, message),
    hours: [
      { days: "Monday – Friday", time: data.hoursWeekdays },
      { days: "Saturday", time: data.hoursSaturday },
      { days: "Sunday", time: data.hoursSunday },
    ],
    socials: [
      { name: "Instagram", url: data.instagram },
      { name: "Facebook", url: data.facebook },
      { name: "TikTok", url: data.tiktok },
    ].filter((social) => social.url !== ""),
  };
}

// ---------- THE OLD WAY (being phased out) ----------
// Files we have not converted yet still import these. They always use the fallback values,
// so they will NOT follow changes made in the admin Settings page.
// As we convert each file to the new way, these stop being used and we delete them.
const FALLBACK = makeSite(DEFAULT_SITE_DATA);

export const SITE = FALLBACK;
export const phoneUrl = FALLBACK.phoneUrl;
export function whatsappUrl(message: string) {
  return FALLBACK.whatsappUrl(message);
}