import type { Seller } from "@/lib/adminStore";
import type { FieldConfig, FormValues } from "./EntityForm";

const checkPhone = (value: string) =>
  /^0\d{9}$/.test(value.replace(/\s/g, ""))
    ? null
    : "Use the local format with 10 digits, e.g. 0745093837.";

const checkPassword = (value: string) =>
  value.length >= 6 ? null : "Use at least 6 characters.";

interface SellerFieldOptions {
  isEdit: boolean; // when editing, the password can be left empty (it stays the same)
  takenUsernames: string[]; // usernames that cannot be used again
}

// THE LIST OF FIELDS for the seller form.
export function getSellerFields({ isEdit, takenUsernames }: SellerFieldOptions): FieldConfig[] {
  return [
    { name: "name", section: "Seller details", label: "Full name", type: "text", required: true, placeholder: "e.g. Jane Wanjiku" },
    {
      name: "phone",
      label: "Phone number",
      type: "text",
      required: true,
      placeholder: "0745093837",
      validate: checkPhone,
    },

    {
      name: "username",
      section: "Login details",
      label: "Username",
      type: "text",
      required: true,
      placeholder: "e.g. jane_cars",
      help: "3 to 20 lowercase letters, numbers or underscores. The seller types this to log in.",
      validate: (value) => {
        if (!/^[a-z0-9_]{3,20}$/.test(value)) {
          return "Use 3 to 20 lowercase letters, numbers or underscores.";
        }
        if (takenUsernames.includes(value)) return "This username is already taken.";
        return null;
      },
    },
    {
      name: "password",
      label: isEdit ? "New password" : "Password",
      type: "text",
      required: !isEdit,
      placeholder: isEdit ? "Leave empty to keep the current password" : "At least 6 characters",
      help: "Shown as plain text so you can tell it to the seller.",
      validate: checkPassword,
    },

    { name: "active", label: "Account is active (the seller can log in)", type: "checkbox" },
  ];
}

// What the form looks like before anything is typed (for "Add seller")
export function getEmptySellerValues(): FormValues {
  return { name: "", phone: "", username: "", password: "", active: true };
}

// A saved seller → the values to put in the form (the password box starts empty)
export function sellerToFormValues(seller: Seller): FormValues {
  return {
    name: seller.name,
    phone: seller.phone,
    username: seller.username,
    password: "",
    active: seller.active,
  };
}

// The form's values → the fields of a seller (an empty password on edit means "keep the old one")
export function sellerValuesToFields(values: FormValues): Partial<Seller> {
  const password = String(values.password);

  return {
    name: String(values.name).trim(),
    phone: String(values.phone).replace(/\s/g, ""),
    username: String(values.username).trim(),
    active: Boolean(values.active),
    ...(password ? { password } : {}),
  };
}