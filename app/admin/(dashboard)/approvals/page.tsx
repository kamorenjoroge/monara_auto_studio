'use client';

import { useState } from "react";
import { CheckCircle2, ClipboardCheck, XCircle } from "lucide-react";

import { formatKES, formatMileage } from "@/lib/types";
import type { ApprovalStatus, Car } from "@/lib/types";
import { useAdminCars } from "../../useAdminCars";
import AdminPageHeader from "../../AdminPageHeader";
import ApprovalBadge from "../../ApprovalBadge";
import ConfirmDialog from "../../ConfirmDialog";
import RoleGuard from "../../RoleGuard";

const ADMIN_ID = "usr-admin";

// A car with no approvalStatus counts as approved
const approvalOf = (car: Car): ApprovalStatus => car.approvalStatus ?? "approved";

// Who added the car (later this will be the seller's real name)
const ownerLabel = (car: Car) =>
  car.sellerId === ADMIN_ID ? "Admin" : car.sellerId === "usr-seller-demo" ? "Demo Seller" : "Seller";

// Save this file as app/admin/(dashboard)/approvals/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function ApprovalsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <ApprovalsContent />
    </RoleGuard>
  );
}

function ApprovalsContent() {
  const { cars, loading, updateCar } = useAdminCars();

  // The car being rejected (null = no pop-up) and the reason typed in the pop-up
  const [carToReject, setCarToReject] = useState<Car | null>(null);
  const [reason, setReason] = useState("");

  // A short message after approving or rejecting
  const [notice, setNotice] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // Oldest first: the car that has waited longest is at the top
  const pending = cars
    .filter((car) => approvalOf(car) === "pending")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  // Seller cars that were already decided
  const reviewed = cars.filter(
    (car) => car.sellerId !== ADMIN_ID && approvalOf(car) !== "pending",
  );

  const approve = (car: Car) => {
    updateCar(car.id, { approvalStatus: "approved", rejectionReason: undefined });
    setNotice(`"${car.title}" was approved and is now live.`);
  };

  const closeRejectDialog = () => {
    setCarToReject(null);
    setReason("");
  };

  const reject = () => {
    if (!carToReject) return;
    updateCar(carToReject.id, {
      approvalStatus: "rejected",
      rejectionReason: reason.trim(),
    });
    setNotice(`"${carToReject.title}" was rejected. The seller can see your reason.`);
    closeRejectDialog();
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Approvals"
        description="Check the cars your sellers added. Approved cars go live. Rejected cars go back to the seller with your reason."
      />

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-whatsapp/40 bg-whatsapp/10 p-4 text-sm text-foreground">
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            className="shrink-0 font-semibold text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ---------- WAITING FOR REVIEW ---------- */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          <ClipboardCheck className="h-5 w-5 text-accent" />
          Waiting for review ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-whatsapp" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing to review. You are all caught up.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {pending.map((car) => (
              <article
                key={car.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Photos */}
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {car.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3">
                    {car.images.slice(1).map((url, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={url}
                        src={url}
                        alt={`${car.title} photo ${index + 2}`}
                        className="h-16 w-24 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Details */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-base font-bold uppercase tracking-wide text-foreground">
                        {car.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Added by {ownerLabel(car)} on {car.createdAt}
                      </p>
                    </div>
                    <p className="shrink-0 font-heading text-lg font-bold text-foreground">
                      {formatKES(car.price)}
                    </p>
                  </div>

                  {/* Spec chips */}
                  <ul className="mt-4 flex flex-wrap gap-2 text-xs">
                    {[
                      String(car.year),
                      formatMileage(car.mileage),
                      car.fuel,
                      car.transmission,
                      car.bodyType,
                      car.engine,
                      car.drive,
                      car.color,
                      car.condition,
                      car.status,
                    ].map((chip) => (
                      <li
                        key={chip}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-foreground/80"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                    {car.description}
                  </p>

                  {car.features.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Features:</span>{" "}
                      {car.features.join(", ")}
                    </p>
                  )}

                  {/* Decision buttons (pinned to the bottom of the card) */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    <button
                      onClick={() => approve(car)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => setCarToReject(car)}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-destructive px-4 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ---------- ALREADY REVIEWED ---------- */}
      {reviewed.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Already reviewed ({reviewed.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {reviewed.map((car) => (
                <li
                  key={car.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{car.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ownerLabel(car)} · {formatKES(car.price)}
                    </p>
                    {approvalOf(car) === "rejected" && car.rejectionReason && (
                      <p className="mt-1 text-xs text-destructive">{car.rejectionReason}</p>
                    )}
                  </div>
                  <ApprovalBadge status={approvalOf(car)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- REJECT POP-UP (asks for a reason) ---------- */}
      <ConfirmDialog
        open={carToReject !== null}
        title="Reject this car?"
        message={`Tell the seller why "${carToReject?.title ?? ""}" was rejected, so they can fix it.`}
        confirmLabel="Reject car"
        confirmDisabled={reason.trim().length < 5}
        onCancel={closeRejectDialog}
        onConfirm={reject}
      >
        <label htmlFor="reject-reason" className="mb-1.5 block text-sm font-semibold text-foreground">
          Reason <span className="text-secondary">*</span>
        </label>
        <textarea
          id="reject-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. The photos are too dark. Please upload clearer pictures."
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </ConfirmDialog>
    </div>
  );
}