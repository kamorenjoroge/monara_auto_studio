import type { Package } from "@/lib/types";
import PackageCard from "./PackageCard";

// Draws the grid. Receives a LIST of packages and draws a PackageCard for each.
interface PackageGridProps {
  packages: Package[];
}

const PackageGrid = ({ packages }: PackageGridProps) => {
  // Nothing to show? Say so.
  if (packages.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No packages to show yet.
      </p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
};

export default PackageGrid;