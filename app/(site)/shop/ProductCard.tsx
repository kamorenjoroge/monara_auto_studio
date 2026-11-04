import Image from "next/image";
import { MessageCircle, Star } from "lucide-react";

import { formatKES } from "@/lib/types";
import type { Product } from "@/lib/types";
import { whatsappUrl } from "@/lib/site";

// Draws ONE product card. Receives a single `product` (shaped by the Product type).
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // The WhatsApp message changes depending on whether the item is in stock
  const message = product.inStock
    ? `Hi Monara, I'd like to order the ${product.name} (${formatKES(product.price)}).`
    : `Hi Monara, is the ${product.name} available? When will it be back in stock?`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:glow-gold">
      {/* Photo with two labels on top */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category label (top left) */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          {product.category}
        </span>

        {/* Stock label (top right) */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
            product.inStock
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/80 text-white"
          }`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {product.brand}
        </p>
        <h3 className="mt-1 font-heading text-sm font-bold uppercase tracking-wide text-card-foreground">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Price + button (pinned to the bottom of the card) */}
        <div className="mt-auto pt-5">
          <p className="font-heading text-xl font-bold text-foreground">
            {formatKES(product.price)}
          </p>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp-dark"
          >
            <MessageCircle className="h-4 w-4" />
            {product.inStock ? "Order on WhatsApp" : "Ask about availability"}
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;