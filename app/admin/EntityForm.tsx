'use client';

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { ImagePlus, Plus, X } from "lucide-react";

import { uploadImage, validateImageFile } from "@/lib/uploadImage";

// ============================================================
// A REUSABLE FORM for every "add" and "edit" page.
// You describe the fields in a list (FieldConfig[]) and this form draws them,
// checks them, and gives you the values when the user presses the button.
//
// PHOTOS: the user chooses photos from their device and sees them at once (a preview, still only
// on this page). Nothing is sent anywhere until they press Save. Then the form uploads the photos
// to Cloudinary, waits for the links, and only then hands the values (with the links) to onSubmit.
// ============================================================

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "image" // ONE photo, chosen from the device
  | "images" // SEVERAL photos, chosen from the device
  | "list";

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
  wide?: boolean; // take the full width
  section?: string; // draws a heading ABOVE this field, to start a new group
  validate?: (value: string) => string | null; // extra check for text boxes: return a message if wrong
  folder?: string; // for "image" and "images": where to upload (cars, services, products...)
}

// Text, number, select and image values are kept as text. Images and list are lists of text. Checkbox is true/false.
export type FormValues = Record<string, string | string[] | boolean>;

interface EntityFormProps {
  fields: FieldConfig[];
  initialValues: FormValues; // empty values for "add", the saved values for "edit"
  submitLabel: string; // e.g. "Add car"
  cancelHref: string; // where the Cancel button goes
  onSubmit: (values: FormValues) => void | Promise<void>; // runs when everything is valid and the photos are uploaded
}

// A photo the user has chosen but that has NOT been uploaded yet
interface PendingPhoto {
  file: File;
  preview: string; // a temporary address so the browser can show the file
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 ${
    hasError ? "border-destructive" : "border-border focus:border-primary"
  }`;

// Turns the files the user picked into PendingPhoto items. Returns the good ones and a message for the bad ones.
function preparePhotos(files: FileList | null): { photos: PendingPhoto[]; problem: string } {
  const photos: PendingPhoto[] = [];
  let problem = "";

  for (const file of Array.from(files ?? [])) {
    const message = validateImageFile(file);
    if (message) problem = message;
    else photos.push({ file, preview: URL.createObjectURL(file) });
  }
  return { photos, problem };
}

// ---------- Field: ONE photo ----------
function ImageField({
  savedUrl,
  pending,
  onPick,
  onRemove,
  hasError,
  disabled,
}: {
  savedUrl: string; // the photo already saved (when editing)
  pending: PendingPhoto | undefined; // a newly chosen photo, not uploaded yet
  onPick: (photo: PendingPhoto) => void;
  onRemove: () => void;
  hasError: boolean;
  disabled: boolean;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const shown = pending?.preview ?? savedUrl;

  const handleFile = (files: FileList | null) => {
    const { photos, problem } = preparePhotos(files);
    setMessage(problem);
    if (photos[0]) onPick(photos[0]);
    if (inputRef.current) inputRef.current.value = ""; // so the same file can be chosen again
  };

  return (
    <div className="space-y-3">
      {shown && (
        <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="Chosen photo" className="h-full w-full object-cover" />
          {pending && (
            <span className="absolute bottom-2 left-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-secondary-foreground">
              New: uploads when you save
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove photo"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFile(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={`flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/5 disabled:opacity-60 ${
          hasError ? "border-destructive" : "border-border"
        }`}
      >
        <ImagePlus className="h-5 w-5 text-primary-dark" />
        {shown ? "Choose a different photo" : "Choose a photo from your device"}
      </button>
      {message && <p className="text-xs text-destructive">{message}</p>}
    </div>
  );
}

// ---------- Field: SEVERAL photos ----------
function ImagesField({
  savedUrls,
  pending,
  onPick,
  onRemoveSaved,
  onRemovePending,
  hasError,
  disabled,
}: {
  savedUrls: string[]; // photos already saved (when editing)
  pending: PendingPhoto[]; // newly chosen photos, not uploaded yet
  onPick: (photos: PendingPhoto[]) => void;
  onRemoveSaved: (url: string) => void;
  onRemovePending: (index: number) => void;
  hasError: boolean;
  disabled: boolean;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const { photos, problem } = preparePhotos(files);
    setMessage(problem);
    if (photos.length > 0) onPick(photos);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/5 disabled:opacity-60 ${
          hasError ? "border-destructive" : "border-border"
        }`}
      >
        <ImagePlus className="h-5 w-5 text-primary-dark" />
        Choose photos from your device
      </button>
      {message && <p className="text-xs text-destructive">{message}</p>}

      {savedUrls.length + pending.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Photos already saved */}
          {savedUrls.map((url, index) => (
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
                onClick={() => onRemoveSaved(url)}
                disabled={disabled}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Newly chosen photos (uploaded when the form is saved) */}
          {pending.map((photo, index) => (
            <div
              key={photo.preview}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-dashed border-secondary bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.preview} alt="New photo" className="h-full w-full object-cover" />
              {savedUrls.length + index === 0 && (
                <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                  Cover
                </span>
              )}
              <span className="absolute left-1 top-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-secondary-foreground">
                New
              </span>
              <button
                type="button"
                onClick={() => onRemovePending(index)}
                disabled={disabled}
                aria-label="Remove new photo"
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

  // The photos chosen but not uploaded yet, for each photo field
  const [pending, setPending] = useState<Record<string, PendingPhoto[]>>({});

  // What the Save button says while it works ("Uploading photos (2 of 5)..." or "Saving...")
  const [status, setStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const saving = status !== "";

  const setValue = (name: string, value: string | string[] | boolean) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const pendingOf = (name: string) => pending[name] ?? [];

  // Check every field. Returns true when everything is fine.
  const validate = () => {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      const value = values[field.name];

      if (field.type === "images") {
        const saved = Array.isArray(value) ? value.length : 0;
        if (field.required && saved + pendingOf(field.name).length === 0) {
          newErrors[field.name] = "Please add at least one photo.";
        }
        continue;
      }
      if (field.type === "list") {
        if (field.required && (!Array.isArray(value) || value.length === 0)) {
          newErrors[field.name] = "Please add at least one.";
        }
        continue;
      }
      if (field.type === "checkbox") continue;

      const text = String(value ?? "").trim();

      if (field.type === "image") {
        if (field.required && text === "" && pendingOf(field.name).length === 0) {
          newErrors[field.name] = "Please add a photo.";
        }
        continue;
      }

      if (field.required && text === "") {
        newErrors[field.name] = "This field is required.";
        continue;
      }

      // The field's own extra check (for example "is this an email?")
      if (field.validate && text !== "") {
        const message = field.validate(text);
        if (message) {
          newErrors[field.name] = message;
          continue;
        }
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

  // THE SAVE PROCEDURE:
  //   1. check the fields   2. upload the new photos to Cloudinary, one by one, and wait for the links
  //   3. only then hand the values (with the links) to onSubmit, which saves them in the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading
    if (saving) return;
    setSaveError("");
    if (!validate()) return;

    // Work on copies, so a failed upload does not lose the photos that already went through
    const working: FormValues = { ...values };
    const remaining: Record<string, PendingPhoto[]> = { ...pending };

    const totalToUpload = fields.reduce(
      (sum, field) =>
        field.type === "image" || field.type === "images" ? sum + pendingOf(field.name).length : sum,
      0,
    );
    let done = 0;

    for (const field of fields) {
      if (field.type !== "image" && field.type !== "images") continue;

      const folder = field.folder ?? "gallery";

      // Go through this field's waiting photos, always taking the first one
      while ((remaining[field.name] ?? []).length > 0) {
        const photo = remaining[field.name][0];
        setStatus(`Uploading photos (${done + 1} of ${totalToUpload})...`);

        const result = await uploadImage(photo.file, folder);

        if (!result.url) {
          // Keep what worked, show the problem, and stop. Nothing is saved to the database.
          setValues(working);
          setPending(remaining);
          setSaveError(result.error ?? "A photo could not be uploaded. Please try again.");
          setStatus("");
          return;
        }

        // The photo is uploaded: its link replaces the waiting file
        if (field.type === "image") working[field.name] = result.url;
        else working[field.name] = [...((working[field.name] as string[]) ?? []), result.url];

        URL.revokeObjectURL(photo.preview);
        remaining[field.name] = remaining[field.name].slice(1);
        done += 1;
      }
    }

    // All photos are uploaded: save everything
    setStatus("Saving...");
    setValues(working);
    setPending({});

    try {
      await onSubmit(working);
    } finally {
      setStatus("");
    }
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

      case "image":
        return (
          <ImageField
            savedUrl={typeof value === "string" ? value : ""}
            pending={pendingOf(field.name)[0]}
            onPick={(photo) => {
              // A new photo replaces any earlier choice
              pendingOf(field.name).forEach((old) => URL.revokeObjectURL(old.preview));
              setPending((previous) => ({ ...previous, [field.name]: [photo] }));
            }}
            onRemove={() => {
              pendingOf(field.name).forEach((old) => URL.revokeObjectURL(old.preview));
              setPending((previous) => ({ ...previous, [field.name]: [] }));
              setValue(field.name, "");
            }}
            hasError={hasError}
            disabled={saving}
          />
        );

      case "images":
        return (
          <ImagesField
            savedUrls={Array.isArray(value) ? value : []}
            pending={pendingOf(field.name)}
            onPick={(photos) =>
              setPending((previous) => ({
                ...previous,
                [field.name]: [...(previous[field.name] ?? []), ...photos],
              }))
            }
            onRemoveSaved={(url) =>
              setValue(
                field.name,
                (Array.isArray(value) ? value : []).filter((item) => item !== url),
              )
            }
            onRemovePending={(index) => {
              const list = pendingOf(field.name);
              if (list[index]) URL.revokeObjectURL(list[index].preview);
              setPending((previous) => ({
                ...previous,
                [field.name]: list.filter((_, position) => position !== index),
              }));
            }}
            hasError={hasError}
            disabled={saving}
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
            field.type === "image" ||
            field.type === "images" ||
            field.type === "list" ||
            field.type === "checkbox";

          return (
            <Fragment key={field.name}>
              {/* A heading that starts a new group of fields */}
              {field.section && (
                <div className="border-b border-border pb-2 pt-3 sm:col-span-2">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                    {field.section}
                  </h2>
                </div>
              )}

              <div className={isWide ? "sm:col-span-2" : ""}>
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
            </Fragment>
          );
        })}
      </div>

      {hasErrors && (
        <p className="mt-6 text-sm text-destructive">
          Please fix the fields marked in red, then try again.
        </p>
      )}
      {saveError && <p className="mt-6 text-sm text-destructive">{saveError}</p>}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="rounded-xl border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? status : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EntityForm;