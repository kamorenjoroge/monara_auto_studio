import type { SiteSettings } from "@/lib/adminStore";
import type { FieldConfig, FormValues } from "./EntityForm";

// Extra checks for some of the boxes. Each returns a message if the value is wrong, otherwise null.
const checkPhone = (value: string) =>
  /^0\d{9}$/.test(value.replace(/\s/g, ""))
    ? null
    : "Use the local format with 10 digits, e.g. 0745093837.";

const checkWhatsapp = (value: string) =>
  /^\d{11,15}$/.test(value)
    ? null
    : "Digits only, with the country code and no plus sign, e.g. 254745093837.";

const checkEmail = (value: string) =>
  /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email address.";

const checkLink = (value: string) =>
  /^https?:\/\/\S+$/i.test(value) ? null : "Enter a full link that starts with https://";

// THE LIST OF FIELDS for the settings form. `section` starts a new group with a heading.
export function getSettingsFields(): FieldConfig[] {
  return [
    {
      name: "phone",
      section: "Contact",
      label: "Phone number",
      type: "text",
      required: true,
      placeholder: "0745093837",
      validate: checkPhone,
      help: "Used for every Call button on the website.",
    },
    {
      name: "whatsapp",
      label: "WhatsApp number",
      type: "text",
      required: true,
      placeholder: "254745093837",
      validate: checkWhatsapp,
      help: "Used for every WhatsApp button. Start with the country code (Kenya is 254), without 0 or +.",
    },
    { name: "email", label: "Email", type: "text", required: true, placeholder: "info@example.com", validate: checkEmail },
    { name: "address", label: "Address", type: "text", required: true, placeholder: "Mombasa Road, Nairobi, Kenya" },

    { name: "hoursWeekdays", section: "Opening hours", label: "Monday to Friday", type: "text", required: true, placeholder: "8:00 AM – 6:00 PM" },
    { name: "hoursSaturday", label: "Saturday", type: "text", required: true, placeholder: "9:00 AM – 5:00 PM" },
    { name: "hoursSunday", label: "Sunday", type: "text", required: true, placeholder: "10:00 AM – 3:00 PM or Closed" },

    { name: "instagram", section: "Social media (optional)", label: "Instagram link", type: "text", placeholder: "https://instagram.com/...", validate: checkLink },
    { name: "facebook", label: "Facebook link", type: "text", placeholder: "https://facebook.com/...", validate: checkLink },
    { name: "tiktok", label: "TikTok link", type: "text", placeholder: "https://tiktok.com/@...", validate: checkLink },
  ];
}

// The saved settings → the values to put in the form
export function settingsToFormValues(settings: SiteSettings): FormValues {
  return {
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    hoursWeekdays: settings.hoursWeekdays,
    hoursSaturday: settings.hoursSaturday,
    hoursSunday: settings.hoursSunday,
    instagram: settings.instagram,
    facebook: settings.facebook,
    tiktok: settings.tiktok,
  };
}

// The form's values → the fields of the settings (spaces in the numbers are removed)
export function settingsValuesToFields(values: FormValues): Omit<SiteSettings, "id"> {
  return {
    phone: String(values.phone).replace(/\s/g, ""),
    whatsapp: String(values.whatsapp).replace(/\s/g, ""),
    email: String(values.email).trim(),
    address: String(values.address).trim(),
    hoursWeekdays: String(values.hoursWeekdays).trim(),
    hoursSaturday: String(values.hoursSaturday).trim(),
    hoursSunday: String(values.hoursSunday).trim(),
    instagram: String(values.instagram).trim(),
    facebook: String(values.facebook).trim(),
    tiktok: String(values.tiktok).trim(),
  };
}