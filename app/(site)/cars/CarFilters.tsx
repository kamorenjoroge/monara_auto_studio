'use client';

import { useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

// ---- 1. The shape of all the filter values ----
export interface CarFilterValues {
  search: string;
  make: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  condition: string;
  maxPrice: string; // "all" or a number written as text, e.g. "5000000"
  sort: string;
}

// ---- 2. What the filters look like when nothing is chosen ----
export const defaultFilters: CarFilterValues = {
  search: "",
  make: "all",
  bodyType: "all",
  fuel: "all",
  transmission: "all",
  condition: "all",
  maxPrice: "all",
  sort: "newest",
};

// ---- 3. Fixed dropdown options ----
const PRICE_OPTIONS = [
  { value: "all", label: "Any price" },
  { value: "3000000", label: "Up to KES 3M" },
  { value: "5000000", label: "Up to KES 5M" },
  { value: "8000000", label: "Up to KES 8M" },
  { value: "12000000", label: "Up to KES 12M" },
  { value: "20000000", label: "Up to KES 20M" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest listed" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "year-new", label: "Year: Newest first" },
];

const CONDITION_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Local", label: "Local" },
  { value: "Imported", label: "Imported" },
  { value: "Foreign Used", label: "Foreign Used" },
];

const TRANSMISSION_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Automatic", label: "Automatic" },
  { value: "Manual", label: "Manual" },
];

// Turns ["Toyota", "BMW"] into [{ value: "all", label: "All" }, { value: "BMW", ... }, ...]
const toOptions = (list: string[]) => [
  { value: "all", label: "All" },
  ...list.map((item) => ({ value: item, label: item })),
];

// ---- 4. One small reusable dropdown ----
interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FilterSelect = ({ label, value, onChange, options }: FilterSelectProps) => (
  <label className="block">
    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

// ---- 5. The filter bar ----
// It does NOT filter anything itself. It only shows the controls
// and tells its parent (CarsExplorer) when the visitor changes something.
interface CarFiltersProps {
  filters: CarFilterValues;
  onChange: (key: keyof CarFilterValues, value: string) => void;
  onReset: () => void;
  resultCount: number;
  makes: string[];
  bodyTypes: string[];
  fuels: string[];
}

const CarFilters = ({
  filters,
  onChange,
  onReset,
  resultCount,
  makes,
  bodyTypes,
  fuels,
}: CarFiltersProps) => {
  // On phones the dropdowns are hidden until the "Show filters" button is tapped
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Search box + phone toggle button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by make, model or year..."
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {open ? "Hide filters" : "Show filters"}
        </button>
      </div>

      {/* Dropdowns */}
      <div
        className={`mt-4 grid-cols-2 gap-4 md:grid-cols-4 ${open ? "grid" : "hidden"} lg:grid`}
      >
        <FilterSelect
          label="Make"
          value={filters.make}
          onChange={(v) => onChange("make", v)}
          options={toOptions(makes)}
        />
        <FilterSelect
          label="Body type"
          value={filters.bodyType}
          onChange={(v) => onChange("bodyType", v)}
          options={toOptions(bodyTypes)}
        />
        <FilterSelect
          label="Fuel"
          value={filters.fuel}
          onChange={(v) => onChange("fuel", v)}
          options={toOptions(fuels)}
        />
        <FilterSelect
          label="Transmission"
          value={filters.transmission}
          onChange={(v) => onChange("transmission", v)}
          options={TRANSMISSION_OPTIONS}
        />
        <FilterSelect
          label="Condition"
          value={filters.condition}
          onChange={(v) => onChange("condition", v)}
          options={CONDITION_OPTIONS}
        />
        <FilterSelect
          label="Max price"
          value={filters.maxPrice}
          onChange={(v) => onChange("maxPrice", v)}
          options={PRICE_OPTIONS}
        />
        <FilterSelect
          label="Sort by"
          value={filters.sort}
          onChange={(v) => onChange("sort", v)}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Result count + reset */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{resultCount}</span>{" "}
          {resultCount === 1 ? "car" : "cars"} found
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default CarFilters;