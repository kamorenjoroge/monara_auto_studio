import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCarBySlug, getSimilarCars } from "@/lib/api";
import CarGallery from "./../CarGallery";
import CarInfo from "../CarInfo";
import CarInquiry from "../CarInquiry";
import SimilarCars from "../SimilarCars";

interface CarDetailsPageProps {
  params: Promise<{ slug: string }>;
}

// STEP A: the page itself does NOT read the address.
// It just shows a placeholder (the skeleton) while the real content loads.
export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  return (
    <Suspense fallback={<CarDetailsSkeleton />}>
      <CarDetails params={params} />
    </Suspense>
  );
}

// STEP B: this component reads the address, finds the car and draws the page.
async function CarDetails({ params }: CarDetailsPageProps) {
  // 1. Read the slug from the web address
  const { slug } = await params;

  // 2. Find that car in our data
  const car = await getCarBySlug(slug);

  // 3. If there is no such car, show the 404 page
  if (!car) notFound();

  // 4. Find cars similar to this one (for "You May Also Like")
  const similarCars = await getSimilarCars(car);

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT: photos, description, features (wide) */}
          <div className="space-y-8 lg:col-span-2">
            <CarGallery images={car.images} title={car.title} />
            <CarInfo car={car} />
          </div>

          {/* RIGHT: price + inquiry (sticky) */}
          <aside className="lg:col-span-1">
            <CarInquiry car={car} />
          </aside>
        </div>
      </section>

      {/* BOTTOM: You May Also Like */}
      <SimilarCars cars={similarCars} />
    </>
  );
}

// STEP C: the placeholder shown for a moment while the car loads.
// It has the same two-column shape as the real page, so nothing jumps.
function CarDetailsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="aspect-[16/10] animate-pulse rounded-2xl bg-muted" />
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="space-y-4 lg:col-span-1">
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </section>
  );
}