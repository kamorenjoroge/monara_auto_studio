'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import { createProduct, fetchProducts, updateProduct } from "@/lib/productsDb";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getProductFields,
  productToFormValues,
  productValuesToFields,
} from "../../productFields";

// Turn a name into a web address piece: "LED Kit" becomes "led-kit"
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface ProductFormScreenProps {
  productId?: string; // given = edit that product, missing = add a new one
}

// ONE screen for both "Add product" and "Edit product". Admin only.
// Save this file as app/admin/(dashboard)/products/ProductFormScreen.tsx
export default function ProductFormScreen({ productId }: ProductFormScreenProps) {
  return (
    <RoleGuard roles={["admin"]}>
      <ProductFormContent productId={productId} />
    </RoleGuard>
  );
}

function ProductFormContent({ productId }: ProductFormScreenProps) {
  const router = useRouter();
  const { supabase, items: products, loading, error: loadError } = useSupabaseList(fetchProducts);
  const [error, setError] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(productId);
  const product = products.find((item) => item.id === productId);

  // Editing a product that does not exist
  if (isEdit && !product) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          {loadError || "This product was not found. It may have been deleted."}
        </p>
        <Link
          href="/admin/products"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </div>
    );
  }

  // Runs when the form is valid and its photo is uploaded: save to the database
  const handleSubmit = async (values: FormValues) => {
    setError("");
    const fields = productValuesToFields(values);
    let message: string | null;

    if (product) {
      // EDIT (the web address piece stays the same)
      message = await updateProduct(supabase, product.id, fields);
    } else {
      // ADD: make a web address piece from the name, and make sure it is not taken
      let slug = slugify(fields.name);
      if (products.some((item) => item.slug === slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      message = await createProduct(supabase, slug, fields);
    }

    if (message) {
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" }); // so the message is seen
      return;
    }

    await refreshPublic("products"); // the public Shop shows the change straight away
    router.push("/admin/products");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <AdminPageHeader
        title={isEdit ? "Edit product" : "Add product"}
        description={product ? product.name : "An accessory or spare part customers can order."}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

      {/* key makes the form start fresh for each product 
      <EntityForm
        key={product?.id ?? "new"}
        fields={getProductFields()}
        initialValues={product ? productToFormValues(product) : getEmptyProductValues()}
        submitLabel={isEdit ? "Save changes" : "Add product"}
        cancelHref="/admin/products"
        onSubmit={handleSubmit}
      />
      */}
    </div>
  );
}