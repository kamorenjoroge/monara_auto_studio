import type { Car } from "@/lib/types";
import CarGrid from "./CarGrid";

interface SimilarCarsProps {
  cars: Car[];
}

const SimilarCars = ({ cars }: SimilarCarsProps) => {
  // Nothing to show? Then show nothing at all.
  if (cars.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/40 py-14">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground">
          You May Also Like
        </h2>
        <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />

        <div className="mt-8">
          <CarGrid cars={cars} />
        </div>
      </div>
    </section>
  );
};

export default SimilarCars;