'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { sellersStore, type Seller } from "@/lib/adminStore";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getEmptySellerValues,
  getSellerFields,
  sellerToFormValues,
  sellerValuesToFields,
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
  const { items: sellers, loading, add, update } = useLocalStore(sellersStore);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(sellerId);
  const seller = sellers.find((item) => item.id === sellerId);

  // Editing a seller that does not exist
  if (isEdit && !seller) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">This seller was not found. They may have been deleted.</p>
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

  // Usernames that cannot be used: the admin's, and every other seller's
  const takenUsernames = [
    "qwerty",
    ...sellers.filter((item) => item.id !== sellerId).map((item) => item.username),
  ];

  // Runs when the form is valid
  const handleSubmit = (values: FormValues) => {
    const fields = sellerValuesToFields(values);

    if (seller) {
      // EDIT: change the fields (an empty password keeps the old one)
      update(seller.id, fields);
    } else {
      // ADD: make a new seller account
      const newSeller: Seller = {
        id: `usr-${Date.now()}`,
        name: fields.name ?? "",
        phone: fields.phone ?? "",
        username: fields.username ?? "",
        password: fields.password ?? "",
        active: fields.active ?? true,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      add(newSeller);
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

      {/* key makes the form start fresh for each seller */}
      <EntityForm
        key={seller?.id ?? "new"}
        fields={getSellerFields({ isEdit, takenUsernames })}
        initialValues={seller ? sellerToFormValues(seller) : getEmptySellerValues()}
        submitLabel={isEdit ? "Save changes" : "Create seller"}
        cancelHref="/admin/sellers"
        onSubmit={handleSubmit}
      />
    </div>
  );
}