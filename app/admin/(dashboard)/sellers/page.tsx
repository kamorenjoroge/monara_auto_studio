'use client';

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";

import { deleteSeller, setSellerActive } from "@/lib/sellerActions";
import { fetchSellers, type SellerAccount } from "@/lib/sellersDb";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

// Save this file as app/admin/(dashboard)/sellers/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin sees it.
// (The real protection is on the server: only an admin can create, change or delete sellers.)
export default function AdminSellersPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <SellersContent />
    </RoleGuard>
  );
}

function SellersContent() {
  const { items: sellers, loading, error: loadError, reload } = useSupabaseList(fetchSellers);

  // The seller waiting for "Are you sure?" (null = no pop-up)
  const [sellerToDelete, setSellerToDelete] = useState<SellerAccount | null>(null);
  const [message, setMessage] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const activeCount = sellers.filter((seller) => seller.active).length;

  // After any change: show a problem if there was one, then read the list again
  const finish = async (problem: string | null) => {
    setMessage(problem ?? "");
    if (!problem) await reload();
  };

  const handleToggle = async (seller: SellerAccount) => {
    const result = await setSellerActive(seller.id, !seller.active);
    await finish(result.error);
  };

  const handleDelete = async () => {
    if (!sellerToDelete) return;
    const result = await deleteSeller(sellerToDelete.id);
    setSellerToDelete(null);
    await finish(result.error);
  };

  // The columns of the table
  const columns: Column<SellerAccount>[] = [
    {
      key: "seller",
      header: "Seller",
      render: (seller) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-primary-foreground">
            {seller.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-foreground">{seller.name}</p>
            <p className="text-xs text-muted-foreground">{seller.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (seller) => <span className="text-muted-foreground">{seller.phone}</span>,
    },
    {
      key: "status",
      header: "Account",
      render: (seller) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            seller.active ? "bg-whatsapp/15 text-whatsapp-dark" : "bg-foreground/10 text-foreground/70"
          }`}
        >
          {seller.active ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (seller) => <span className="text-muted-foreground">{seller.createdAt}</span>,
    },
  ];

  const errorText = message || loadError;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Sellers"
        description="Customers who sell their cars through Monara. You create their accounts and they log in with their email to add cars."
        actionLabel="Add seller"
        actionHref="/admin/sellers/new"
      />

      {errorText && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {errorText}
        </div>
      )}

      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{sellers.length}</span>{" "}
          {sellers.length === 1 ? "seller" : "sellers"} · {activeCount} active
        </p>

        <DataTable
          columns={columns}
          rows={sellers}
          emptyMessage="No sellers yet. Click Add seller to create the first account."
          actions={(seller) => (
            <div className="flex items-center justify-end gap-4">
              {/* A quick way to stop or allow a seller to log in */}
              <button
                onClick={() => handleToggle(seller)}
                className="text-sm font-semibold text-secondary hover:underline"
              >
                {seller.active ? "Disable" : "Enable"}
              </button>

              <Link
                href={`/admin/sellers/${seller.id}/edit`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-secondary hover:underline"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <button
                onClick={() => setSellerToDelete(seller)}
                aria-label={`Delete ${seller.name}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        />
      </section>

      {/* "Are you sure?" pop-up for delete */}
      <ConfirmDialog
        open={sellerToDelete !== null}
        title="Delete this seller?"
        message={`"${sellerToDelete?.name ?? ""}" will not be able to log in any more. Their cars stay in the system.`}
        confirmLabel="Delete"
        onCancel={() => setSellerToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}