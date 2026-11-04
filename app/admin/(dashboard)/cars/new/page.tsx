'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";

import type { Car, CarCondition, CarStatus } from "@/lib/types";
import { useAuth } from "../../../AuthProvider";
import { useAdminCars } from "../../../useAdminCars";
import AdminPageHeader from "../../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../../EntityForm";
import { getCarFields, getEmptyCarValues } from "../../../carFields";

// Turn a title into a web address piece: "Toyota Hilux 2021" becomes "toyota-hilux-2021"
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Save this file as app/admin/(dashboard)/cars/new/page.tsx
export default function NewCarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cars, loading, addCar } = useAdminCars();

  if (!user) return null; // the guard already handles this
  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isAdmin = user.role === "admin";

  // Runs when the form is valid: build the car, save it, go back to the list
  const handleSubmit = (values: FormValues) => {
    const title = String(values.title).trim();
    const year = Number(values.year);

    // Make sure the web address piece is not already used by another car
    let slug = slugify(`${title} ${year}`);
    if (cars.some((car) => car.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCar: Car = {
      id: `car-${Date.now()}`,
      slug,
      title,
      make: String(values.make).trim(),
      model: String(values.model).trim(),
      year,
      price: Number(values.price),
      mileage: Number(values.mileage),
      fuel: String(values.fuel),
      transmission: String(values.transmission),
      bodyType: String(values.bodyType),
      engine: String(values.engine).trim(),
      drive: String(values.drive),
      color: String(values.color).trim(),
      condition: values.condition as CarCondition,
      status: values.status as CarStatus,
      featured: isAdmin ? Boolean(values.featured) : false,
      images: values.images as string[],
      features: values.features as string[],
      description: String(values.description).trim(),
      createdAt: new Date().toISOString().slice(0, 10),

      // Who owns it, and whether it needs approval:
      // the admin's cars are live at once, a seller's cars wait for the admin.
      sellerId: user.id,
      approvalStatus: isAdmin ? "approved" : "pending",
    };

    addCar(newCar);
    router.push("/admin/cars");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/cars"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cars
      </Link>

      <AdminPageHeader
        title="Add car"
        description="Fill in the details and add photos of the car."
      />

      {/* A note that depends on the role */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
        {isAdmin
          ? "Cars you add are approved automatically and go live straight away."
          : "New cars are checked by the admin first. You will see the car in your list as Pending until it is approved."}
      </div>

      <EntityForm
        fields={getCarFields(isAdmin)}
        initialValues={getEmptyCarValues()}
        submitLabel="Add car"
        cancelHref="/admin/cars"
        onSubmit={handleSubmit}
      />
    </div>
  );
}