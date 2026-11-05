'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Database, Pencil, Search, Star, Trash2 } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import {
  deleteProduct,
  fetchProducts,
  setProductStock,
} from "@/lib/productsDb";
import { formatKES } from "@/lib/types";
import type { Product } from "@/lib/types";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// Save this file as app/admin/(dashboard)/products/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin sees it.
// (The real protection is in the database: only the admin may change products.)
export default function AdminProductsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <ProductsContent />
    </RoleGuard>
  );
}

function ProductsContent() {
  const { supabase, items: products, loading, error: loadError, reload } = useSupabaseList(fetchProducts);

  // What the admin typed or picked in the filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // The product waiting for "Are you sure?" (null = no pop-up)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
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
    await refreshPublic("products");
    await reload();
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const problem = await deleteProduct(supabase, productToDelete.id);
    setProductToDelete(null);
    await finish(problem);
  };

  const handleStock = async (product: Product) => {
    await finish(await setProductStock(supabase, product.id, !product.inStock));
  };

  // Newest first, then apply the search and the category filter
  const query = search.trim().toLowerCase();
  const visibleProducts = [...products].reverse().filter((product) => {
    if (query && !`${product.name} ${product.brand}`.toLowerCase().includes(query)) return false;
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false;
    return true;
  });

  const outOfStock = products.filter((product) => !product.inStock).length;

  // The columns of the table
  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product) => (
        <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
          {product.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (product) => <span className="font-bold text-foreground">{formatKES(product.price)}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            product.inStock ? "bg-whatsapp/15 text-whatsapp-dark" : "bg-foreground/10 text-foreground/70"
          }`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (product) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Star className="h-4 w-4 fill-primary text-primary" />
          {product.rating.toFixed(1)}
        </span>
      ),
    },
  ];

  const errorText = message || loadError;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Products"
        description="The accessories and spare parts shown in the website's Shop."
        actionLabel="Add product"
        actionHref="/admin/products/new"
      />

      {errorText && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {errorText}
        </div>
      )}

      {/* An empty database: offer to copy the sample products from products.json 
      {products.length === 0 && !loadError && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Database className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-foreground">The database has no products yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy the sample products from products.json, or add your own with the button above.
          </p>

          <button
            onClick={handleImport}
            disabled={importing}
            className="mt-5 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold disabled:opacity-60"
          >
            {importing ? "Importing..." : "Import the sample products"}
          </button>
        </div>
      )}  */}

      {products.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or brand..."
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
              <option value="Accessories">Accessories</option>
              <option value="Spare Parts">Spare Parts</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{visibleProducts.length}</span>{" "}
            {visibleProducts.length === 1 ? "product" : "products"} shown
            {outOfStock > 0 && ` · ${outOfStock} out of stock`}
          </p>

          <DataTable
            columns={columns}
            rows={visibleProducts}
            emptyMessage="No products match your search."
            actions={(product) => (
              <div className="flex items-center justify-end gap-4">
                {/* A quick way to change the stock without opening the form */}
                <button
                  onClick={() => handleStock(product)}
                  className="text-sm font-semibold text-secondary hover:underline"
                >
                  {product.inStock ? "Mark out of stock" : "Mark in stock"}
                </button>

                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-secondary hover:underline"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>

                <button
                  onClick={() => setProductToDelete(product)}
                  aria-label={`Delete ${product.name}`}
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
        open={productToDelete !== null}
        title="Delete this product?"
        message={`"${productToDelete?.name ?? ""}" will be removed from the Shop. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}