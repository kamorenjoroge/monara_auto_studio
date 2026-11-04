'use client';

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";

// ============================================================
// A REUSABLE FORM for every "add" and "edit" page.
// You describe the fields in a list (FieldConfig[]) and this form draws them,
// checks them, and gives you the values when the user presses the button.
// Cars use it now. Services, packages and products will use it too.
// ============================================================

export type FieldType = "text" | "number" | "textarea" | "select" | "checkbox" | "images" | "list";

export interface FieldConfig {
  name: string; // the key of the value, e.g. "price"
  label: string; // the title shown above the box
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for "select": the choices
  help?: string; // small grey hint under the box
  min?: number; // for "number": smallest allowed value
  max?: number; // for "number": biggest allowed value
  wide?: boolean; // take the full width (textarea, images and list are always wide)
}

// Text, number and select values are kept as text. Images and list are lists of text. Checkbox is true/false.
export type FormValues = Record<string, string | string[] | boolean>;

interface EntityFormProps {
  fields: FieldConfig[];
  initialValues: FormValues; // empty values for "add", the saved values for "edit"
  submitLabel: string; // e.g. "Add car"
  cancelHref: string; // where the Cancel button goes
  onSubmit: (values: FormValues) => void; // runs when everything is valid
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 ${
    hasError ? "border-destructive" : "border-border focus:border-primary"
  }`;

// ---------- Field: image links with preview ----------
function ImagesField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");

  const add = () => {
    const url = draft.trim();
    if (!/^https?:\/\/\S+$/i.test(url)) {
      setMessage("Paste a full image link that starts with https://");
      return;
    }
    if (value.includes(url)) {
      setMessage("That image is already added.");
      return;
    }
    onChange([...value, url]);
    setDraft("");
    setMessage("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // do not submit the whole form
              add();
            }
          }}
          placeholder="https://... (link to a photo)"
          className={inputClass(false)}
        />
        <button
          type="button"
          onClick={add}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary-dark"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {message && <p className="text-xs text-destructive">{message}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== url))}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Field: a list of short items (like car features) ----------
function ListField({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const item = draft.trim();
    if (!item || value.includes(item)) return;
    onChange([...value, item]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // do not submit the whole form
              add();
            }
          }}
          placeholder={placeholder}
          className={inputClass(false)}
        />
        <button
          type="button"
          onClick={add}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary-dark"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((other) => other !== item))}
                aria-label={`Remove ${item}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- The form itself ----------
const EntityForm = ({ fields, initialValues, submitLabel, cancelHref, onSubmit }: EntityFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (name: string, value: string | string[] | boolean) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  // Check every field. Returns true when everything is fine.
  const validate = () => {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      const value = values[field.name];

      if (field.type === "images" || field.type === "list") {
        if (field.required && (!Array.isArray(value) || value.length === 0)) {
          newErrors[field.name] = "Please add at least one.";
        }
        continue;
      }
      if (field.type === "checkbox") continue;

      const text = String(value ?? "").trim();
      if (field.required && text === "") {
        newErrors[field.name] = "This field is required.";
        continue;
      }

      if (field.type === "number" && text !== "") {
        const number = Number(text);
        if (Number.isNaN(number)) newErrors[field.name] = "Enter a number.";
        else if (field.min !== undefined && number < field.min)
          newErrors[field.name] = `Must be at least ${field.min}.`;
        else if (field.max !== undefined && number > field.max)
          newErrors[field.name] = `Must be at most ${field.max}.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading
    if (validate()) onSubmit(values);
  };

  // Draw the right kind of box for one field
  const renderControl = (field: FieldConfig) => {
    const value = values[field.name];
    const hasError = Boolean(errors[field.name]);

    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            id={field.name}
            type={field.type}
            value={String(value ?? "")}
            onChange={(e) => setValue(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className={inputClass(hasError)}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.name}
            rows={5}
            value={String(value ?? "")}
            onChange={(e) => setValue(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass(hasError)}
          />
        );

      case "select":
        return (
          <select
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => setValue(field.name, e.target.value)}
            className={inputClass(hasError)}
          >
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              id={field.name}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => setValue(field.name, e.target.checked)}
              className="h-4 w-4 accent-[#F5B800]"
            />
            {field.label}
          </label>
        );

      case "images":
        return (
          <ImagesField
            value={Array.isArray(value) ? value : []}
            onChange={(urls) => setValue(field.name, urls)}
          />
        );

      case "list":
        return (
          <ListField
            value={Array.isArray(value) ? value : []}
            onChange={(items) => setValue(field.name, items)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const isWide =
            field.wide ||
            field.type === "textarea" ||
            field.type === "images" ||
            field.type === "list" ||
            field.type === "checkbox";

          return (
            <div key={field.name} className={isWide ? "sm:col-span-2" : ""}>
              {/* A checkbox draws its own label */}
              {field.type !== "checkbox" && (
                <label htmlFor={field.name} className="mb-1.5 block text-sm font-semibold text-foreground">
                  {field.label}
                  {field.required && <span className="text-secondary"> *</span>}
                </label>
              )}

              {renderControl(field)}

              {field.help && !errors[field.name] && (
                <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>
              )}
              {errors[field.name] && (
                <p className="mt-1.5 text-xs text-destructive">{errors[field.name]}</p>
              )}
            </div>
          );
        })}
      </div>

      {hasErrors && (
        <p className="mt-6 text-sm text-destructive">
          Please fix the fields marked in red, then try again.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="rounded-xl border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EntityForm;