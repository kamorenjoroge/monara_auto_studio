'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Info, XCircle } from "lucide-react";

import { createCar, fetchAdminCars, updateCar, type CarInput } from "@/lib/carsDb";
import { refreshPublic } from "@/lib/refresh";
import { useAuth } from "../../AuthProvider";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import ApprovalBadge from "../../ApprovalBadge";
import EntityForm, { type FormValues } from "../../EntityForm";
import { carToFormValues, carValuesToFields, getCarFields, getEmptyCarValues } from "../../carFields";

// Turn a title into a web address piece: "Toyota Hilux 2021" becomes "toyota-hilux-2021"
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface CarFormScreenProps {
  carId?: string; // given = edit that car, missing = add a new one
}

// ONE screen for both "Add car" and "Edit car". Admin and sellers.
// Save this file as app/admin/(dashboard)/cars/CarFormScreen.tsx
export default function CarFormScreen({ carId }: CarFormScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { supabase, items: cars, loading, error: loadError } = useSupabaseList(fetchAdminCars);
  const [error, setError] = useState("");

  if (!user) return null; // the guard already handles this
  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isAdmin = user.role === "admin";
  const isEdit = Boolean(carId);
  const car = cars.find((item) => item.id === carId);

  // Editing a car that does not exist (or, for a seller, that is not theirs)
  if (isEdit && !car) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          {loadError || "This car was not found, or it is not yours to edit."}
        </p>
        <Link
          href="/admin/cars"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cars
        </Link>
      </div>
    );
  }

  const approval = car?.approvalStatus ?? "approved";

  // Runs when the form is valid and its photos are uploaded: save to the database
  const handleSubmit = async (values: FormValues) => {
    setError("");

    // Only the admin can feature a car on the Home page
    const input = {
      ...carValuesToFields(values, isAdmin),
      featured: isAdmin ? Boolean(values.featured) : false,
    } as CarInput;

    let message: string | null;

    if (car) {
      // EDIT. When a SELLER edits, the car goes back to the admin for approval.
      message = await updateCar(supabase, car.id, input, !isAdmin);
    } else {
      // ADD. The admin's cars are live at once, a seller's cars wait for approval.
      message = await createCar(supabase, {
        baseSlug: slugify(`${input.title} ${input.year}`),
        input,
        ownerId: user.id,
        isAdmin,
      });
    }

    if (message) {
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" }); // so the message is seen
      return;
    }

    await refreshPublic("cars"); // the public Cars pages show the change straight away
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

      <div className="flex flex-wrap items-center gap-3">
        <AdminPageHeader
          title={isEdit ? "Edit car" : "Add car"}
          description={car ? car.title : "Fill in the details and add photos of the car."}
        />
        {car && <ApprovalBadge status={approval} />}
      </div>

      {/* If the admin rejected this car, show the reason so the seller can fix it */}
      {car && approval === "rejected" && car.rejectionReason && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-bold">This car was rejected</p>
            <p className="mt-1">{car.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* A note that depends on the role */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
        {isAdmin
          ? isEdit
            ? "Your changes are saved straight away. The approval status stays as it is."
            : "Cars you add are approved automatically and go live straight away."
          : isEdit
            ? "When you save, the car goes back to the admin for approval, even if it was live before."
            : "New cars are checked by the admin first. You will see the car in your list as Pending until it is approved."}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

      {/* key makes the form start fresh for each car  */}
      <EntityForm
        key={car?.id ?? "new"}
        fields={getCarFields(isAdmin)}
        initialValues={car ? carToFormValues(car) : getEmptyCarValues()}
        submitLabel={isEdit ? "Save changes" : "Add car"}
        cancelHref="/admin/cars"
        onSubmit={handleSubmit}
      /> 
     
    </div>

  );
}