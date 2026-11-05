import type { Package, PackageCategory } from "@/lib/types";
import type { FieldConfig, FormValues } from "./EntityForm";

// THE LIST OF FIELDS for the package form.
export function getPackageFields(): FieldConfig[] {
  return [
    { name: "name", label: "Package name", type: "text", required: true, placeholder: "e.g. 9H Ceramic Coating", wide: true },
    { name: "category", label: "Category", type: "select", options: ["Window Tinting", "Paint Protection", "Detailing"] },
    { name: "duration", label: "How long it takes", type: "text", required: true, placeholder: "e.g. 2–3 days" },
    { name: "price", label: "Price (KES)", type: "number", required: true, min: 1, placeholder: "e.g. 45000" },
    {
      name: "originalPrice",
      label: "Original price (KES)",
      type: "number",
      min: 1,
      placeholder: "e.g. 55000",
      help: "Optional. Fill it in to show a crossed-out price and a 'Save...' line. It must be higher than the price.",
    },
    { name: "features", label: "What's included", type: "list", required: true, placeholder: "e.g. 9H hardness (press Enter to add)" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Describe the package for customers...",
    },
    { name: "popular", label: "Mark as most popular (gold ribbon on the card)", type: "checkbox" },
  ];
}

// What the form looks like before anything is typed (for "Add package")
export function getEmptyPackageValues(): FormValues {
  return {
    name: "",
    category: "Window Tinting",
    duration: "",
    price: "",
    originalPrice: "",
    features: [],
    description: "",
    popular: false,
  };
}

// A saved package → the values to put in the form (for "Edit package")
export function packageToFormValues(pkg: Package): FormValues {
  return {
    name: pkg.name,
    category: pkg.category,
    duration: pkg.duration,
    price: String(pkg.price),
    originalPrice: pkg.originalPrice === null ? "" : String(pkg.originalPrice),
    features: [...pkg.features],
    description: pkg.description,
    popular: pkg.popular,
  };
}

// The form's values → the fields of a package (an empty original price becomes null)
export function packageValuesToFields(values: FormValues): Omit<Package, "id" | "slug"> {
  const originalText = String(values.originalPrice).trim();

  return {
    name: String(values.name).trim(),
    category: values.category as PackageCategory,
    duration: String(values.duration).trim(),
    price: Number(values.price),
    originalPrice: originalText === "" ? null : Number(originalText),
    features: values.features as string[],
    description: String(values.description).trim(),
    popular: Boolean(values.popular),
  };
}