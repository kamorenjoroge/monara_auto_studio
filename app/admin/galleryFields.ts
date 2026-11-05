import type { GalleryCategory, GalleryItem } from "@/lib/types";
import type { FieldConfig, FormValues } from "./EntityForm";

// The categories must match the filter buttons on the website's Gallery page.
const CATEGORY_OPTIONS = ["Wraps", "PPF", "Tinting", "Styling", "Imports", "Detailing"];

// THE LIST OF FIELDS for the gallery form.
export function getGalleryFields(): FieldConfig[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Land Cruiser V8: Full PPF", wide: true },
    { name: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, help: "The visitor's filter buttons use this." },
    {
      name: "image",
      label: "Photo link",
      type: "text",
      required: true,
      placeholder: "https://... (link to a photo)",
      help: "Paste a link to a photo. (Real uploads come with Cloudinary later.)",
      wide: true,
    },
    {
      name: "description",
      label: "Short description",
      type: "textarea",
      required: true,
      placeholder: "One or two lines about the work shown in the photo...",
    },
  ];
}

// What the form looks like before anything is typed (for "Add photo")
export function getEmptyGalleryValues(): FormValues {
  return { title: "", category: "Wraps", image: "", description: "" };
}

// A saved item → the values to put in the form (for "Edit photo")
export function galleryToFormValues(item: GalleryItem): FormValues {
  return {
    title: item.title,
    category: item.category,
    image: item.image,
    description: item.description,
  };
}

// The form's values → the fields of a gallery item
export function galleryValuesToFields(values: FormValues): Omit<GalleryItem, "id"> {
  return {
    title: String(values.title).trim(),
    category: values.category as GalleryCategory,
    image: String(values.image).trim(),
    description: String(values.description).trim(),
  };
}