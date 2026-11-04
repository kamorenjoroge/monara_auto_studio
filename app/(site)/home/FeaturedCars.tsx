import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Car } from "@/lib/types";
import CarGrid from "../cars/CarGrid";

// A short, hand-picked list of cars for the Home page.
// It receives the featured cars and reuses the same CarGrid as the Cars page.
interface FeaturedCarsProps {
  cars: Car[];
}

const FeaturedCars = ({ cars }: FeaturedCarsProps) => {
  return (
    <section className="border-t border-border bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        {/* Heading + "view all" link on the same row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              Hand-Picked
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">
              Featured Cars
            </h2>
            <div
              className="mt-4 h-1 w-20 rounded-full bg-brand-gradient"
              aria-hidden="true"
            />
          </div>

          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-all hover:gap-3"
          >
            View all cars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Show at most 6 cars */}
        <div className="mt-10">
          <CarGrid cars={cars.slice(0, 6)} />
        </div>
        
      </div>
      
    </section>
  );
};

export default FeaturedCars;