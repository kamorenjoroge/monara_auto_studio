import type { Product, ProductCategory } from "@/lib/types";
import type { FieldConfig, FormValues } from "./EntityForm";

// THE LIST OF FIELDS for the product form.
export function getProductFields(): FieldConfig[] {
  return [
    { name: "name", label: "Product name", type: "text", required: true, placeholder: "e.g. LED Headlight Conversion Kit", wide: true },
    { name: "brand", label: "Brand", type: "text", required: true, placeholder: "e.g. Philips" },
    { name: "category", label: "Category", type: "select", options: ["Accessories", "Spare Parts"] },
    { name: "price", label: "Price (KES)", type: "number", required: true, min: 1, placeholder: "e.g. 18500" },
    { name: "rating", label: "Rating (0 to 5)", type: "number", required: true, min: 0, max: 5, help: "Shown as a star rating on the product card." },
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
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Describe the product: what it does, what it fits, fitting options...",
    },
    { name: "inStock", label: "In stock", type: "checkbox" },
  ];
}

// What the form looks like before anything is typed (for "Add product")
export function getEmptyProductValues(): FormValues {
  return {
    name: "",
    brand: "",
    category: "Accessories",
    price: "",
    rating: "4.5",
    image: "",
    description: "",
    inStock: true,
  };
}

// A saved product → the values to put in the form (for "Edit product")
export function productToFormValues(product: Product): FormValues {
  return {
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: String(product.price),
    rating: String(product.rating),
    image: product.image,
    description: product.description,
    inStock: product.inStock,
  };
}

// The form's values → the fields of a product (numbers become real numbers)
export function productValuesToFields(values: FormValues): Omit<Product, "id" | "slug"> {
  return {
    name: String(values.name).trim(),
    brand: String(values.brand).trim(),
    category: values.category as ProductCategory,
    price: Number(values.price),
    rating: Number(values.rating),
    image: String(values.image).trim(),
    description: String(values.description).trim(),
    inStock: Boolean(values.inStock),
  };
}