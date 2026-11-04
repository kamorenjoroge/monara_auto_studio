import { whatsappLink } from "./types";

// ============================================================
// SITE SETTINGS: change the phone number HERE, and only here.
// ============================================================
const PHONE = "0745093837"; // local format, starting with 0

export const SITE = {
  name: "Monara Auto Studio",
  tagline: "Your Car. Your Style. Your Legacy.",

  phone: PHONE,                                                     // for tel: links
  phoneDisplay: `${PHONE.slice(0, 4)} ${PHONE.slice(4, 7)} ${PHONE.slice(7)}`, // "0745 093 837"
  whatsapp: `254${PHONE.slice(1)}`,                                 // "254745093837"

  email: "info@monaraautostudio.co.ke",
  address: "Mombasa Road, Nairobi, Kenya",
};

// Ready-made links, so pages don't build them by hand
export const phoneUrl = `tel:${SITE.phone}`;

export function whatsappUrl(message: string) {
  return whatsappLink(SITE.whatsapp, message);
}