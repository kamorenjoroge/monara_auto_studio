'use client';

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import type { Car } from "@/lib/types";
import CarFilters, { defaultFilters, type CarFilterValues } from "./CarFilters";
import CarGrid from "./CarGrid";

// The "brain" that connects the filters to the grid:
//   1. remembers what the visitor chose
//   2. picks out the cars that match
//   3. gives that shorter list to the grid
interface CarsExplorerProps {
  cars: Car[];
}

const CarsExplorer = ({ cars }: CarsExplorerProps) => {
  // 1. What the visitor chose (starts with nothing chosen)
  const [filters, setFilters] = useState<CarFilterValues>(defaultFilters);

  // Dropdown options come from the cars themselves
  const makes = useMemo(() => Array.from(new Set(cars.map((c) => c.make))).sort(), [cars]);
  const bodyTypes = useMemo(
    () => Array.from(new Set(cars.map((c) => c.bodyType))).sort(),
    [cars],
  );
  const fuels = useMemo(() => Array.from(new Set(cars.map((c) => c.fuel))).sort(), [cars]);

  // Change ONE filter and keep the others as they were
  const handleChange = (key: keyof CarFilterValues, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  // Put everything back to "nothing chosen"
  const handleReset = () => setFilters(defaultFilters);

  // 2. Keep only the cars that match every filter, then sort them
  const filteredCars = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const matches = cars.filter((car) => {
      if (query) {
        const text = `${car.title} ${car.make} ${car.model} ${car.year}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      if (filters.make !== "all" && car.make !== filters.make) return false;
      if (filters.bodyType !== "all" && car.bodyType !== filters.bodyType) return false;
      if (filters.fuel !== "all" && car.fuel !== filters.fuel) return false;
      if (filters.transmission !== "all" && car.transmission !== filters.transmission)
        return false;
      if (filters.condition !== "all" && car.condition !== filters.condition) return false;
      if (filters.maxPrice !== "all" && car.price > Number(filters.maxPrice)) return false;
      return true; // passed every check
    });

    return [...matches].sort((a, b) => {
      switch (filters.sort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "year-new":
          return b.year - a.year;
        default:
          return b.createdAt.localeCompare(a.createdAt); // newest listed first
      }
    });
  }, [cars, filters]);

  return (
    <div className="space-y-8">
      <CarFilters
        filters={filters}
        onChange={handleChange}
        onReset={handleReset}
        resultCount={filteredCars.length}
        makes={makes}
        bodyTypes={bodyTypes}
        fuels={fuels}
      />

      {/* 3. Show the grid, or a message if nothing matches */}
      {filteredCars.length > 0 ? (
        <CarGrid cars={filteredCars} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-heading text-lg font-bold uppercase text-foreground">
            No cars match your filters
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try changing or clearing your filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CarsExplorer;