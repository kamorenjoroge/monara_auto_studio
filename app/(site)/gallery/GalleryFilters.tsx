import type { GalleryCategory } from "@/lib/types";

// The value of the filter: either "All" or one of the gallery categories
export type GalleryFilterValue = "All" | GalleryCategory;

// The buttons, in the order they appear
const CATEGORIES: GalleryFilterValue[] = [
  "All",
  "Wraps",
  "PPF",
  "Tinting",
  "Styling",
  "Imports",
  "Detailing",
];

// It does NOT filter anything itself. It only shows the buttons
// and tells its parent which category was clicked.
interface GalleryFiltersProps {
  active: GalleryFilterValue; // the category that is selected right now
  onChange: (category: GalleryFilterValue) => void; // runs when a button is clicked
}

const GalleryFilters = ({ active, onChange }: GalleryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery by category">
      {CATEGORIES.map((category) => {
        const isActive = category === active;

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            role="tab"
            aria-selected={isActive}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "bg-gold-gradient text-primary-foreground shadow-md"
                : "border border-border bg-card text-foreground/70 hover:border-primary hover:text-secondary"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default GalleryFilters;