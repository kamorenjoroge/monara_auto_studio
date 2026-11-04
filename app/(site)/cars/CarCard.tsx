import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Cog, Fuel, Gauge } from "lucide-react";

import { formatKES, formatMileage } from "@/lib/types";
import type { Car, CarStatus } from "@/lib/types";

// Color of the status label for each status
const statusStyles: Record<CarStatus, string> = {
  Available: "bg-primary text-primary-foreground",
  Reserved: "bg-secondary text-secondary-foreground",
  Sold: "bg-foreground/80 text-white",
  Incoming: "bg-accent text-accent-foreground",
};

// This component draws ONE car card.
interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:glow-gold"
    >
      {/* Photo with two labels on top */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={car.images[0]}
          alt={car.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status label (top left) */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${statusStyles[car.status]}`}
        >
          {car.status}
        </span>

        {/* Condition label (top right) */}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          {car.condition}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-base font-bold uppercase tracking-wide text-card-foreground">
          {car.title}
        </h3>

        {/* Four quick specs */}
        <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary-dark" />
            {car.year}
          </li>
          <li className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4 text-primary-dark" />
            {formatMileage(car.mileage)}
          </li>
          <li className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4 text-primary-dark" />
            {car.fuel}
          </li>
          <li className="flex items-center gap-1.5">
            <Cog className="h-4 w-4 text-primary-dark" />
            {car.transmission}
          </li>
        </ul>

        {/* Price and "View Details" (pinned to the bottom of the card) */}
        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-heading text-lg font-bold text-foreground">
              {formatKES(car.price)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-all group-hover:gap-2.5">
            View Details
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;