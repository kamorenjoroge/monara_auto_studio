'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, XCircle } from "lucide-react";

import type { Car } from "@/lib/types";
import { useAuth } from "../../AuthProvider";
import { useAdminCars } from "../../useAdminCars";
import AdminPageHeader from "../../AdminPageHeader";
import ApprovalBadge from "../../ApprovalBadge";
import EntityForm, { type FormValues } from "../../EntityForm";
import { carToFormValues, carValuesToFields, getCarFields } from "../../carFields";

// The edit screen for ONE car. It receives the car's id from the page.
// Save this file as app/admin/(dashboard)/cars/EditCarForm.tsx
export default function EditCarForm({ carId }: { carId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { cars, loading, updateCar } = useAdminCars();

  if (!user) return null; // the guard already handles this
  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isAdmin = user.role === "admin";
  const car = cars.find((item) => item.id === carId);

  // A message card for the two "cannot edit" cases
  const notice = (text: string) => (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
      <p className="text-foreground">{text}</p>
      <Link
        href="/admin/cars"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cars
      </Link>
    </div>
  );

  if (!car) return notice("This car was not found. It may have been deleted.");

  // A seller can only edit their own cars
  if (!isAdmin && car.sellerId !== user.id) return notice("You can only edit your own cars.");

  const approval = car.approvalStatus ?? "approved";

  // Runs when the form is valid
  const handleSubmit = (values: FormValues) => {
    const changes: Partial<Car> = carValuesToFields(values, isAdmin);

    // The rule we agreed: when a SELLER changes a car, it goes back to the admin for approval.
    // (When the admin edits, the approval status stays as it is.)
    if (!isAdmin) {
      changes.approvalStatus = "pending";
      changes.rejectionReason = undefined; // clear the old rejection reason
    }

    updateCar(car.id, changes);
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
        <AdminPageHeader title="Edit car" description={car.title} />
        <ApprovalBadge status={approval} />
      </div>

      {/* If the admin rejected this car, show the reason so the seller can fix it */}
      {approval === "rejected" && car.rejectionReason && (
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
          ? "Your changes are saved straight away. The approval status stays as it is."
          : "When you save, the car goes back to the admin for approval, even if it was live before."}
      </div>

      {/* key makes the form start fresh for each car */}
      <EntityForm
        key={car.id}
        fields={getCarFields(isAdmin)}
        initialValues={carToFormValues(car)}
        submitLabel="Save changes"
        cancelHref="/admin/cars"
        onSubmit={handleSubmit}
      />
    </div>
  );
}