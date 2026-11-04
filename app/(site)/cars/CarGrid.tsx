import type { Car } from "@/lib/types";
import CarCard from "./CarCard";

interface CarGridProps {
  cars: Car[];
}

const CarGrid = ({ cars }: CarGridProps) => {
  // If there are no cars, show a message instead of an empty space
  if (cars.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No cars to show yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarGrid;