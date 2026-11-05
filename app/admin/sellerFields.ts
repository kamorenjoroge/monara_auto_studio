import type { SellerAccount } from "@/lib/sellersDb";
import type { SellerInput } from "@/lib/sellerActions";
import type { FieldConfig, FormValues } from "./EntityForm";

const checkPhone = (value: string) =>
  /^0\d{9}$/.test(value.replace(/\s/g, ""))
    ? null
    : "Use the local format with 10 digits, e.g. 0745093837.";

const checkEmail = (value: string) =>
  /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email address.";

const checkPassword = (value: string) =>
  value.length >= 8 ? null : "Use at least 8 characters.";

// THE LIST OF FIELDS for the seller form.
// When editing, the password can be left empty (it stays the same).
export function getSellerFields(isEdit: boolean): FieldConfig[] {
  return [
    { name: "name", section: "Seller details", label: "Full name", type: "text", required: true, placeholder: "e.g. Jane Wanjiku" },
    { name: "phone", label: "Phone number", type: "text", required: true, placeholder: "0745093837", validate: checkPhone },

    {
      name: "email",
      section: "Login details",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "jane@example.com",
      validate: checkEmail,
      help: "The seller logs in with this email.",
    },
    {
      name: "password",
      label: isEdit ? "New password" : "Password",
      type: "text",
      required: !isEdit,
      placeholder: isEdit ? "Leave empty to keep the current password" : "At least 8 characters",
      validate: checkPassword,
      help: "Shown as plain text so you can tell it to the seller. It is stored securely and cannot be read again.",
    },

    { name: "active", label: "Account is active (the seller can log in)", type: "checkbox" },
  ];
}

// What the form looks like before anything is typed (for "Add seller")
export function getEmptySellerValues(): FormValues {
  return { name: "", phone: "", email: "", password: "", active: true };
}

// A saved seller → the values to put in the form (the password box starts empty)
export function sellerToFormValues(seller: SellerAccount): FormValues {
  return {
    name: seller.name,
    phone: seller.phone,
    email: seller.email,
    password: "",
    active: seller.active,
  };
}

// The form's values → what the server action needs
export function sellerValuesToInput(values: FormValues): SellerInput {
  return {
    name: String(values.name).trim(),
    phone: String(values.phone).replace(/\s/g, ""),
    email: String(values.email).trim(),
    password: String(values.password),
    active: Boolean(values.active),
  };
}