'use client';

import { useState } from "react";
import Link from "next/link";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";

import { carsStore, sellersStore, type Seller } from "@/lib/adminStore";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

// Save this file as app/admin/(dashboard)/sellers/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function AdminSellersPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <SellersContent />
    </RoleGuard>
  );
}

function SellersContent() {
  const { items: sellers, loading, update, remove, reset } = useLocalStore(sellersStore);
  const { items: cars, loading: carsLoading } = useLocalStore(carsStore);

  // The seller waiting for "Are you sure?" (null = no pop-up)
  const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading || carsLoading) return <p className="text-muted-foreground">Loading...</p>;

  const activeCount = sellers.filter((seller) => seller.active).length;

  // The columns of the table
  const columns: Column<Seller>[] = [
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
            <p className="text-xs text-muted-foreground">@{seller.username}</p>
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
      key: "cars",
      header: "Cars",
      render: (seller) => {
        const sellerCars = cars.filter((car) => car.sellerId === seller.id);
        const pending = sellerCars.filter((car) => car.approvalStatus === "pending").length;
        return (
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">{sellerCars.length}</span>
            {pending > 0 && <span className="ml-2 text-xs text-accent">{pending} pending</span>}
          </div>
        );
      },
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

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Sellers"
        description="Customers who sell their cars through Monara. You create their accounts and they log in to add cars."
        actionLabel="Add seller"
        actionHref="/admin/sellers/new"
      />

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
                onClick={() => update(seller.id, { active: !seller.active })}
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

        {/* Demo helper: go back to just the demo seller */}
        <div className="pt-2">
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset demo data
          </button>
        </div>
      </section>

      {/* "Are you sure?" pop-up for delete */}
      <ConfirmDialog
        open={sellerToDelete !== null}
        title="Delete this seller?"
        message={`"${sellerToDelete?.name ?? ""}" will not be able to log in any more. Their cars stay in the system.`}
        confirmLabel="Delete"
        onCancel={() => setSellerToDelete(null)}
        onConfirm={() => {
          if (sellerToDelete) remove(sellerToDelete.id);
          setSellerToDelete(null);
        }}
      />

      {/* "Are you sure?" pop-up for reset */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All sellers you created, edited or deleted here will be replaced by the single demo seller."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}