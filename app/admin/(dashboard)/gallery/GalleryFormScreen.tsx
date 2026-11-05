'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import { createGalleryItem, fetchGallery, updateGalleryItem } from "@/lib/galleryDb";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  galleryToFormValues,
  galleryValuesToFields,
  getEmptyGalleryValues,
  getGalleryFields,
} from "../../galleryFields";

interface GalleryFormScreenProps {
  itemId?: string; // given = edit that photo, missing = add a new one
}

// ONE screen for both "Add photo" and "Edit photo". Admin only.
// Save this file as app/admin/(dashboard)/gallery/GalleryFormScreen.tsx
export default function GalleryFormScreen({ itemId }: GalleryFormScreenProps) {
  return (
    <RoleGuard roles={["admin"]}>
      <GalleryFormContent itemId={itemId} />
    </RoleGuard>
  );
}

function GalleryFormContent({ itemId }: GalleryFormScreenProps) {
  const router = useRouter();
  const { supabase, items, loading, error: loadError } = useSupabaseList(fetchGallery);
  const [error, setError] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(itemId);
  const item = items.find((entry) => entry.id === itemId);

  // Editing a photo that does not exist
  if (isEdit && !item) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          {loadError || "This photo was not found. It may have been deleted."}
        </p>
        <Link
          href="/admin/gallery"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to gallery
        </Link>
      </div>
    );
  }

  // Runs when the form is valid and its photo is uploaded: save to the database
  const handleSubmit = async (values: FormValues) => {
    setError("");
    const fields = galleryValuesToFields(values);

    const message = item
      ? await updateGalleryItem(supabase, item.id, fields)
      : await createGalleryItem(supabase, fields);

    if (message) {
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" }); // so the message is seen
      return;
    }

    await refreshPublic("gallery"); // the public Gallery shows the change straight away
    router.push("/admin/gallery");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to gallery
      </Link>

      <AdminPageHeader
        title={isEdit ? "Edit photo" : "Add photo"}
        description={item ? item.title : "A photo of the work that leaves your workshop."}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

      {/* key makes the form start fresh for each photo */}
      <EntityForm
        key={item?.id ?? "new"}
        fields={getGalleryFields()}
        initialValues={item ? galleryToFormValues(item) : getEmptyGalleryValues()}
        submitLabel={isEdit ? "Save changes" : "Add photo"}
        cancelHref="/admin/gallery"
        onSubmit={handleSubmit}
      />
    </div>
  );
}