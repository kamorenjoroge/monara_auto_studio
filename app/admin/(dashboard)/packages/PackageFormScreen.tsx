'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import { createPackage, fetchPackages, updatePackage } from "@/lib/packagesDb";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getEmptyPackageValues,
  getPackageFields,
  packageToFormValues,
  packageValuesToFields,
} from "../../packageFields";

// Turn a name into a web address piece: "Ceramic Coating" becomes "ceramic-coating"
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface PackageFormScreenProps {
  packageId?: string; // given = edit that package, missing = add a new one
}

// ONE screen for both "Add package" and "Edit package". Admin only.
// Save this file as app/admin/(dashboard)/packages/PackageFormScreen.tsx
export default function PackageFormScreen({ packageId }: PackageFormScreenProps) {
  return (
    <RoleGuard roles={["admin"]}>
      <PackageFormContent packageId={packageId} />
    </RoleGuard>
  );
}

function PackageFormContent({ packageId }: PackageFormScreenProps) {
  const router = useRouter();
  const { supabase, items: packages, loading, error: loadError } = useSupabaseList(fetchPackages);

  // A message for a mistake that involves TWO fields, or for a problem saving
  const [error, setError] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(packageId);
  const pkg = packages.find((item) => item.id === packageId);

  // Editing a package that does not exist
  if (isEdit && !pkg) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          {loadError || "This package was not found. It may have been deleted."}
        </p>
        <Link
          href="/admin/packages"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to packages
        </Link>
      </div>
    );
  }

  // Runs when the form is valid: save to the database
  const handleSubmit = async (values: FormValues) => {
    const fields = packageValuesToFields(values);

    // The original price only makes sense if it is higher than the price
    // (the database refuses it too, but this gives a clearer message)
    if (fields.originalPrice !== null && fields.originalPrice <= fields.price) {
      setError("The original price must be higher than the price. Make it higher, or leave it empty.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError("");

    let message: string | null;

    if (pkg) {
      // EDIT (the web address piece stays the same)
      message = await updatePackage(supabase, pkg.id, fields);
    } else {
      // ADD: make a web address piece from the name, and make sure it is not taken
      let slug = slugify(fields.name);
      if (packages.some((item) => item.slug === slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      message = await createPackage(supabase, slug, fields);
    }

    if (message) {
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    await refreshPublic("packages"); // the public Shop shows the change straight away
    router.push("/admin/packages");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to packages
      </Link>

      <AdminPageHeader
        title={isEdit ? "Edit package" : "Add package"}
        description={pkg ? pkg.name : "A tinting, protection or detailing package customers can book."}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

      {/* key makes the form start fresh for each package */}
      <EntityForm
        key={pkg?.id ?? "new"}
        fields={getPackageFields()}
        initialValues={pkg ? packageToFormValues(pkg) : getEmptyPackageValues()}
        submitLabel={isEdit ? "Save changes" : "Add package"}
        cancelHref="/admin/packages"
        onSubmit={handleSubmit}
      />
    </div>
  );
}