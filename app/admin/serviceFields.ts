import type { Service } from "@/lib/types";
import type { FieldConfig, FormValues } from "./EntityForm";

// The icon names a service can use. They must match the ones in getIcon() in lib/types.ts.
const ICON_OPTIONS = [
  "Ship",
  "Car",
  "CarFront",
  "Sparkles",
  "Palette",
  "Shield",
  "ShieldCheck",
  "Contrast",
  "Wrench",
  "Settings",
  "Sun",
];

// THE LIST OF FIELDS for the service form.
export function getServiceFields(): FieldConfig[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. PPF: Paint Protection Film", wide: true },
    { name: "tagline", label: "Tagline", type: "text", required: true, placeholder: "e.g. Invisible armour for your paint.", wide: true },
    { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, help: "Shown on the service card." },
    { name: "priceFrom", label: "Starting price (KES)", type: "number", min: 0, placeholder: "Leave empty for 'Contact us'" },
    { name: "duration", label: "Typical time", type: "text", placeholder: "e.g. 2–4 days" },
   {
  name: "image",
  label: "Photo",
  type: "image",
  folder: "services",
  required: true,
  help: "Choose a photo from your device. JPG, PNG or WebP, up to 10 MB.",
  wide: true,
},
    { name: "features", label: "What's included", type: "list", required: true, placeholder: "e.g. Self-healing film (press Enter to add)" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Describe the service for customers...",
    },
  ];
}

// What the form looks like before anything is typed (for "Add service")
export function getEmptyServiceValues(): FormValues {
  return {
    title: "",
    tagline: "",
    icon: "Wrench",
    priceFrom: "",
    duration: "",
    image: "",
    features: [],
    description: "",
  };
}

// A saved service → the values to put in the form (for "Edit service")
export function serviceToFormValues(service: Service): FormValues {
  return {
    title: service.title,
    tagline: service.tagline,
    icon: service.icon,
    priceFrom: service.priceFrom === null ? "" : String(service.priceFrom),
    duration: service.duration ?? "",
    image: service.image,
    features: [...service.features],
    description: service.description,
  };
}

// The form's values → the fields of a service (an empty price or time becomes null)
export function serviceValuesToFields(values: FormValues): Omit<Service, "id" | "slug"> {
  const priceText = String(values.priceFrom).trim();
  const durationText = String(values.duration).trim();

  return {
    title: String(values.title).trim(),
    tagline: String(values.tagline).trim(),
    icon: String(values.icon),
    priceFrom: priceText === "" ? null : Number(priceText),
    duration: durationText === "" ? null : durationText,
    image: String(values.image).trim(),
    features: values.features as string[],
    description: String(values.description).trim(),
  };
}