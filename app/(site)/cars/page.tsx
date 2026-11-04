import { getCars } from "@/lib/api";
import CarsHero from "./CarsHero";
import CarsExplorer from "./CarsExplorer";

export default async function CarsPage() {
  const cars = await getCars();

  return (
    <>
      <CarsHero />
      <section id="car-listings" className="scroll-mt-16 py-12">
        <div className="container mx-auto px-4">
          <CarsExplorer cars={cars} />
        </div>
      </section>
    </>
  );
}