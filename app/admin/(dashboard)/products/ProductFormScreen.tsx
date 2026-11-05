'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { productsStore } from "@/lib/adminStore";
import type { Product } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getEmptyProductValues,
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
  const { items: products, loading, add, update } = useLocalStore(productsStore);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(productId);
  const product = products.find((item) => item.id === productId);

  // Editing a product that does not exist
  if (isEdit && !product) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">This product was not found. It may have been deleted.</p>
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

  // Runs when the form is valid
  const handleSubmit = (values: FormValues) => {
    const fields = productValuesToFields(values);

    if (product) {
      // EDIT: change the fields (the web address piece stays the same)
      update(product.id, fields);
    } else {
      // ADD: make a new product with its own id and web address piece
      let slug = slugify(fields.name);
      if (products.some((item) => item.slug === slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      const newProduct: Product = { id: `prd-${Date.now()}`, slug, ...fields };
      add(newProduct);
    }

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

      {/* key makes the form start fresh for each product */}
      <EntityForm
        key={product?.id ?? "new"}
        fields={getProductFields()}
        initialValues={product ? productToFormValues(product) : getEmptyProductValues()}
        submitLabel={isEdit ? "Save changes" : "Add product"}
        cancelHref="/admin/products"
        onSubmit={handleSubmit}
      />
    </div>
  );
}