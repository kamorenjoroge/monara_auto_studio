'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Database, Pencil, Search, Trash2 } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import { deleteGalleryItem, fetchGallery } from "@/lib/galleryDb";
import type { GalleryItem } from "@/lib/types";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// Save this file as app/admin/(dashboard)/gallery/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin sees it.
// (The real protection is in the database: only the admin may change the gallery.)
export default function AdminGalleryPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <GalleryContent />
    </RoleGuard>
  );
}

function GalleryContent() {
  const { supabase, items, loading, error: loadError, reload } = useSupabaseList(fetchGallery);

  // What the admin typed or picked in the filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // The photo waiting for "Are you sure?" (null = no pop-up)
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
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
    await refreshPublic("gallery");
    await reload();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const problem = await deleteGalleryItem(supabase, itemToDelete.id);
    setItemToDelete(null);
    await finish(problem);
  };

  

  // Newest first, then apply the search and the category filter
  const query = search.trim().toLowerCase();
  const visibleItems = [...items].reverse().filter((item) => {
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

  const errorText = message || loadError;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Gallery"
        description="The photos shown on the website's Gallery page."
        actionLabel="Add photo"
        actionHref="/admin/gallery/new"
      />

      {errorText && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {errorText}
        </div>
      )}

      {/* An empty database: offer to copy the sample photos from gallery.json 
      {items.length === 0 && !loadError && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Database className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-foreground">The database has no gallery photos yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy the sample photos from gallery.json, or add your own with the button above.
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="mt-5 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold disabled:opacity-60"
          >
            {importing ? "Importing..." : "Import the sample photos"}
          </button>
        </div>
      )} */}

      {items.length > 0 && (
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
        </section>
      )}

      {/* "Are you sure?" pop-up for delete */}
      <ConfirmDialog
        open={itemToDelete !== null}
        title="Delete this photo?"
        message={`"${itemToDelete?.title ?? ""}" will be removed from the gallery. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}