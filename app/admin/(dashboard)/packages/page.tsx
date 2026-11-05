'use client';

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Database, Pencil, Search, Star, Trash2 } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import {
  deletePackage,
  fetchPackages,
  setPackagePopular,
} from "@/lib/packagesDb";
import { formatKES } from "@/lib/types";
import type { Package } from "@/lib/types";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// Save this file as app/admin/(dashboard)/packages/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin sees it.
// (The real protection is in the database: only the admin may change packages.)
export default function AdminPackagesPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <PackagesContent />
    </RoleGuard>
  );
}

function PackagesContent() {
  const { supabase, items: packages, loading, error: loadError, reload } = useSupabaseList(fetchPackages);

  // What the admin typed or picked in the filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // The package waiting for "Are you sure?" (null = no pop-up)
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // After any change: clear the website's memory and read the list again
  const finish = async (problem: string | null) => {
    if (problem) {
      setMessage(problem);
      return;
    }
    setMessage("");
    await refreshPublic("packages");
    await reload();
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;
    const problem = await deletePackage(supabase, packageToDelete.id);
    setPackageToDelete(null);
    await finish(problem);
  };

  const handlePopular = async (pkg: Package) => {
    await finish(await setPackagePopular(supabase, pkg.id, !pkg.popular));
  };

 
  // Newest first, then apply the search and the category filter
  const query = search.trim().toLowerCase();
  const visiblePackages = [...packages].reverse().filter((pkg) => {
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

  const errorText = message || loadError;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Packages"
        description="The tinting, protection and detailing packages shown in the website's Shop."
        actionLabel="Add package"
        actionHref="/admin/packages/new"
      />

      {errorText && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {errorText}
        </div>
      )}

      {/* An empty database: offer to copy the sample packages from packages.json 
      {packages.length === 0 && !loadError && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Database className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-foreground">The database has no packages yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy the sample packages from packages.json, or add your own with the button above.
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="mt-5 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold disabled:opacity-60"
          >
            {importing ? "Importing..." : "Import the sample packages"}
          </button>
        </div>
      )}
        */}

      {packages.length > 0 && (
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
                  onClick={() => handlePopular(pkg)}
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
        </section>
      )}

      {/* "Are you sure?" pop-up for delete */}
      <ConfirmDialog
        open={packageToDelete !== null}
        title="Delete this package?"
        message={`"${packageToDelete?.name ?? ""}" will be removed from the Shop. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setPackageToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}