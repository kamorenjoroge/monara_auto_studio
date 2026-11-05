'use client';

import { useState } from "react";
import Link from "next/link";
import { Pencil, RotateCcw, Search, Star, Trash2 } from "lucide-react";

import { packagesStore } from "@/lib/adminStore";
import { formatKES } from "@/lib/types";
import type { Package } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// Save this file as app/admin/(dashboard)/packages/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function AdminPackagesPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <PackagesContent />
    </RoleGuard>
  );
}

function PackagesContent() {
  const { items: packages, loading, update, remove, reset } = useLocalStore(packagesStore);

  // What the admin typed or picked in the filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // The package waiting for "Are you sure?" (null = no pop-up)
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // Apply the search and the category filter
  const query = search.trim().toLowerCase();
  const visiblePackages = packages.filter((pkg) => {
    if (query && !`${pkg.name} ${pkg.description}`.toLowerCase().includes(query)) return false;
    if (categoryFilter !== "all" && pkg.category !== categoryFilter) return false;
    return true;
  });

  // The columns of the table
  const columns: Column<Package>[] = [
    {
      key: "package",
      header: "Package",
      render: (pkg) => (
        <div>
          <p className="flex items-center gap-2 font-semibold text-foreground">
            {pkg.name}
            {pkg.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                <Star className="h-3 w-3 fill-current" />
                Popular
              </span>
            )}
          </p>
          <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-muted-foreground">
            {pkg.description}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (pkg) => (
        <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
          {pkg.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (pkg) => (
        <div>
          <p className="font-bold text-foreground">{formatKES(pkg.price)}</p>
          {pkg.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">{formatKES(pkg.originalPrice)}</p>
          )}
        </div>
      ),
    },
    {
      key: "duration",
      header: "Time",
      render: (pkg) => <span className="text-muted-foreground">{pkg.duration}</span>,
    },
    {
      key: "features",
      header: "Features",
      render: (pkg) => <span className="text-muted-foreground">{pkg.features.length}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Packages"
        description="The tinting, protection and detailing packages shown in the website's Shop."
        actionLabel="Add package"
        actionHref="/admin/packages/new"
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={selectClass}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option value="Window Tinting">Window Tinting</option>
            <option value="Paint Protection">Paint Protection</option>
            <option value="Detailing">Detailing</option>
          </select>
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{visiblePackages.length}</span>{" "}
          {visiblePackages.length === 1 ? "package" : "packages"} shown
        </p>

        <DataTable
          columns={columns}
          rows={visiblePackages}
          emptyMessage="No packages match your search."
          actions={(pkg) => (
            <div className="flex items-center justify-end gap-4">
              {/* A quick way to add or remove the gold "Most popular" ribbon */}
              <button
                onClick={() => update(pkg.id, { popular: !pkg.popular })}
                className="text-sm font-semibold text-secondary hover:underline"
              >
                {pkg.popular ? "Remove popular" : "Mark popular"}
              </button>

              <Link
                href={`/admin/packages/${pkg.id}/edit`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-secondary hover:underline"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <button
                onClick={() => setPackageToDelete(pkg)}
                aria-label={`Delete ${pkg.name}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        />

        {/* Demo helper: bring the sample packages back */}
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
        open={packageToDelete !== null}
        title="Delete this package?"
        message={`"${packageToDelete?.name ?? ""}" will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setPackageToDelete(null)}
        onConfirm={() => {
          if (packageToDelete) remove(packageToDelete.id);
          setPackageToDelete(null);
        }}
      />

      {/* "Are you sure?" pop-up for reset */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All packages you added, edited or deleted here will be replaced by the original sample packages."
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