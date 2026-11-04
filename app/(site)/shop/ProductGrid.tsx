import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// Draws the grid. Receives a LIST of products and draws a ProductCard for each.
interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  // Nothing to show? Say so.
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No products to show yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;