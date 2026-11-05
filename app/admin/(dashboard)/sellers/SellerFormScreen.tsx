'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { createSeller, updateSeller } from "@/lib/sellerActions";
import { fetchSellers } from "@/lib/sellersDb";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getEmptySellerValues,
  getSellerFields,
  sellerToFormValues,
  sellerValuesToInput,
} from "../../sellerFields";

interface SellerFormScreenProps {
  sellerId?: string; // given = edit that seller, missing = add a new one
}

// ONE screen for both "Add seller" and "Edit seller". Admin only.
// Save this file as app/admin/(dashboard)/sellers/SellerFormScreen.tsx
export default function SellerFormScreen({ sellerId }: SellerFormScreenProps) {
  return (
    <RoleGuard roles={["admin"]}>
      <SellerFormContent sellerId={sellerId} />
    </RoleGuard>
  );
}

function SellerFormContent({ sellerId }: SellerFormScreenProps) {
  const router = useRouter();
  const { items: sellers, loading, error: loadError } = useSupabaseList(fetchSellers);
  const [error, setError] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(sellerId);
  const seller = sellers.find((item) => item.id === sellerId);

  // Editing a seller that does not exist
  if (isEdit && !seller) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          {loadError || "This seller was not found. They may have been deleted."}
        </p>
        <Link
          href="/admin/sellers"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sellers
        </Link>
      </div>
    );
  }

  // Runs when the form is valid: the SERVER creates or updates the account
  const handleSubmit = async (values: FormValues) => {
    setError("");
    const input = sellerValuesToInput(values);

    const result = seller ? await updateSeller(seller.id, input) : await createSeller(input);

    if (result.error) {
      setError(result.error);
      window.scrollTo({ top: 0, behavior: "smooth" }); // so the message is seen
      return;
    }

    router.push("/admin/sellers");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/sellers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sellers
      </Link>

      <AdminPageHeader
        title={isEdit ? "Edit seller" : "Add seller"}
        description={
          seller
            ? seller.name
            : "Create an account for a customer who wants to sell their cars through Monara."
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

      {/* key makes the form start fresh for each seller */}
      <EntityForm
        key={seller?.id ?? "new"}
        fields={getSellerFields(isEdit)}
        initialValues={seller ? sellerToFormValues(seller) : getEmptySellerValues()}
        submitLabel={isEdit ? "Save changes" : "Create seller"}
        cancelHref="/admin/sellers"
        onSubmit={handleSubmit}
      />
    </div>
  );
}