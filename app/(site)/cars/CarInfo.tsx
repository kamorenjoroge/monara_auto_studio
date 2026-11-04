import { Check } from "lucide-react";

import { formatMileage } from "@/lib/types";
import type { Car } from "@/lib/types";

// Shows the written details of ONE car:
// description, features and a specifications table.
interface CarInfoProps {
  car: Car;
}

const CarInfo = ({ car }: CarInfoProps) => {
  // Each row of the specifications table: [label, value]
  const specs = [
    ["Make", car.make],
    ["Model", car.model],
    ["Year", String(car.year)],
    ["Body type", car.bodyType],
    ["Engine", car.engine],
    ["Transmission", car.transmission],
    ["Fuel", car.fuel],
    ["Drive", car.drive],
    ["Mileage", formatMileage(car.mileage)],
    ["Color", car.color],
    ["Condition", car.condition],
  ];

  return (
    <div className="space-y-10">
      {/* Description */}
      <div>
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
          About this car
        </h2>
        <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />
        <p className="mt-4 leading-relaxed text-foreground/80">{car.description}</p>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
          Features
        </h2>
        <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {car.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Specifications table */}
      <div>
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
          Specifications
        </h2>
        <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />
        <dl className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          {specs.map(([label, value], index) => (
            <div
              key={label}
              className={`flex justify-between gap-4 px-5 py-3 text-sm ${
                index % 2 === 0 ? "bg-card" : "bg-muted/60"
              }`}
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default CarInfo;