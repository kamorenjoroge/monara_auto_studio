'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, RotateCcw, Search, Star, Trash2 } from "lucide-react";

import { productsStore } from "@/lib/adminStore";
import { formatKES } from "@/lib/types";
import type { Product } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// Save this file as app/admin/(dashboard)/products/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function AdminProductsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <ProductsContent />
    </RoleGuard>
  );
}

function ProductsContent() {
  const { items: products, loading, update, remove, reset } = useLocalStore(productsStore);

  // What the admin typed or picked in the filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // The product waiting for "Are you sure?" (null = no pop-up)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // Apply the search and the category filter
  const query = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
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

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Products"
        description="The accessories and spare parts shown in the website's Shop."
        actionLabel="Add product"
        actionHref="/admin/products/new"
      />

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
                onClick={() => update(product.id, { inStock: !product.inStock })}
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

        {/* Demo helper: bring the sample products back */}
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
        open={productToDelete !== null}
        title="Delete this product?"
        message={`"${productToDelete?.name ?? ""}" will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) remove(productToDelete.id);
          setProductToDelete(null);
        }}
      />

      {/* "Are you sure?" pop-up for reset */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All products you added, edited or deleted here will be replaced by the original sample products."
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