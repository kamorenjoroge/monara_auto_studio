'use client';

import { useState } from "react";

import type { GalleryItem } from "@/lib/types";
import GalleryFilters, { type GalleryFilterValue } from "./GalleryFilters";
import GalleryGrid from "./GalleryGrid";

// The "brain" that connects the buttons to the grid:
//   1. remembers which category is selected
//   2. keeps only the photos from that category
//   3. gives that shorter list to the grid
interface GalleryExplorerProps {
  items: GalleryItem[];
}

const GalleryExplorer = ({ items }: GalleryExplorerProps) => {
  // 1. Which category is selected (starts with "All")
  const [active, setActive] = useState<GalleryFilterValue>("All");

  // 2. "All" keeps everything, otherwise keep only the matching category
  const visibleItems =
    active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <div className="space-y-8">
      <GalleryFilters active={active} onChange={setActive} />

      <p className="text-sm text-muted-foreground">
        <span className="font-bold text-foreground">{visibleItems.length}</span>{" "}
        {visibleItems.length === 1 ? "photo" : "photos"}
      </p>

      {/* 3. The grid draws only the photos that passed the filter */}
      <GalleryGrid items={visibleItems} />
    </div>
  );
};

export default GalleryExplorer;