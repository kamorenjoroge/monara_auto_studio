'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { galleryStore } from "@/lib/adminStore";
import type { GalleryItem } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
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
  const { items, loading, add, update } = useLocalStore(galleryStore);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(itemId);
  const item = items.find((entry) => entry.id === itemId);

  // Editing a photo that does not exist
  if (isEdit && !item) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">This photo was not found. It may have been deleted.</p>
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

  // Runs when the form is valid
  const handleSubmit = (values: FormValues) => {
    const fields = galleryValuesToFields(values);

    if (item) {
      update(item.id, fields); // EDIT
    } else {
      const newItem: GalleryItem = { id: `gal-${Date.now()}`, ...fields }; // ADD
      add(newItem);
    }

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