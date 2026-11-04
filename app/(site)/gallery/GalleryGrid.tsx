import Image from "next/image";

import type { GalleryItem } from "@/lib/types";

// Draws the grid. Receives a LIST of gallery items and draws one card for each.
interface GalleryGridProps {
  items: GalleryItem[];
}

const GalleryGrid = ({ items }: GalleryGridProps) => {
  // Nothing to show? Say so.
  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No photos in this category yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure
          key={item.id}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted"
        >
          {/* Photo */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark fade at the bottom so the white text is easy to read */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            aria-hidden="true"
          />

          {/* Text on top of the photo */}
          <figcaption className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              {item.category}
            </span>
            <h3 className="mt-2 font-heading text-base font-bold uppercase tracking-wide text-white">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-white/80">
              {item.description}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default GalleryGrid;