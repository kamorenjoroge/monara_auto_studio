import type { Metadata } from "next";

import { getPackages, getProducts } from "@/lib/api";
import ShopHero from "./ShopHero";
import PackageGrid from "./PackageGrid";
import ProductGrid from "./ProductGrid";

export const metadata: Metadata = {
  title: "Shop | Monara Auto Studio",
  description:
    "Service packages for tinting, PPF and detailing, plus accessories and spare parts. Order on WhatsApp.",
};

export default async function ShopPage() {
  // Get both lists at the same time
  const [packages, products] = await Promise.all([getPackages(), getProducts()]);

  return (
    <>
      <ShopHero />

      {/* ---------- 1. PACKAGES ---------- */}
      <section id="shop-list" className="scroll-mt-16 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              Service Packages
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground">
              Tinting, PPF &amp; Detailing
            </h2>
            <div className="mt-3 h-1 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
          </div>

          <PackageGrid packages={packages} />
        </div>
      </section>

      {/* ---------- 2. PRODUCTS ---------- */}
      <section id="products" className="scroll-mt-16 border-t border-border bg-muted/40 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              Shop
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground">
              Accessories &amp; Spare Parts
            </h2>
            <div className="mt-3 h-1 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}