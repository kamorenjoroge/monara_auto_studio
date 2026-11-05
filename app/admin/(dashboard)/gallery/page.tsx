'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, RotateCcw, Search, Trash2 } from "lucide-react";

import { galleryStore } from "@/lib/adminStore";
import type { GalleryItem } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// Save this file as app/admin/(dashboard)/gallery/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function AdminGalleryPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <GalleryContent />
    </RoleGuard>
  );
}

function GalleryContent() {
  const { items, loading, remove, reset } = useLocalStore(galleryStore);

  // What the admin typed or picked in the filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // The photo waiting for "Are you sure?" (null = no pop-up)
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // Apply the search and the category filter
  const query = search.trim().toLowerCase();
  const visibleItems = items.filter((item) => {
    if (query && !`${item.title} ${item.description}`.toLowerCase().includes(query)) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    return true;
  });

  // The columns of the table
  const columns: Column<GalleryItem>[] = [
    {
      key: "photo",
      header: "Photo",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {item.image && (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <p className="font-semibold text-foreground">{item.title}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-dark">
          {item.category}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item) => (
        <p className="line-clamp-2 max-w-xs text-muted-foreground">{item.description}</p>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Gallery"
        description="The photos shown on the website's Gallery page."
        actionLabel="Add photo"
        actionHref="/admin/gallery/new"
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
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
            {["Wraps", "PPF", "Tinting", "Styling", "Imports", "Detailing"].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{visibleItems.length}</span>{" "}
          {visibleItems.length === 1 ? "photo" : "photos"} shown
        </p>

        <DataTable
          columns={columns}
          rows={visibleItems}
          emptyMessage="No photos match your search."
          actions={(item) => (
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/admin/gallery/${item.id}/edit`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-secondary hover:underline"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <button
                onClick={() => setItemToDelete(item)}
                aria-label={`Delete ${item.title}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        />

        {/* Demo helper: bring the sample photos back */}
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
        open={itemToDelete !== null}
        title="Delete this photo?"
        message={`"${itemToDelete?.title ?? ""}" will be removed from the gallery. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) remove(itemToDelete.id);
          setItemToDelete(null);
        }}
      />

      {/* "Are you sure?" pop-up for reset */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All photos you added, edited or deleted here will be replaced by the original sample photos."
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