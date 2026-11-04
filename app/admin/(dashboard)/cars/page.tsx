'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Car as CarIcon,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Key,
  Pencil,
  RotateCcw,
  Search,
  Ship,
  Trash2,
  XCircle,
} from "lucide-react";

import { formatKES } from "@/lib/types";
import type { ApprovalStatus, Car, CarStatus } from "@/lib/types";
import { useAuth } from "../../AuthProvider";
import { useAdminCars } from "../../useAdminCars";
import AdminPageHeader from "../../AdminPageHeader";
import ApprovalBadge from "../../ApprovalBadge";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import StatCard from "../../StatCard";

// Color of the availability label for each status
const availabilityStyles: Record<CarStatus, string> = {
  Available: "bg-primary/20 text-primary-dark",
  Reserved: "bg-secondary/15 text-secondary",
  Sold: "bg-foreground/10 text-foreground/70",
  Incoming: "bg-accent/15 text-accent",
};

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

// A car with no approvalStatus counts as approved
const approvalOf = (car: Car): ApprovalStatus => car.approvalStatus ?? "approved";

// Save this file as app/admin/(dashboard)/cars/page.tsx
export default function AdminCarsPage() {
  const { user } = useAuth();
  const { cars, loading, deleteCar, resetCars } = useAdminCars();

  // What the visitor typed or picked in the filters
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // The car waiting for "Are you sure?" (null = no pop-up)
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!user) return null; // the guard already handles this
  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isAdmin = user.role === "admin";

  // The admin sees every car. A seller sees only their own.
  const myCars = isAdmin ? cars : cars.filter((car) => car.sellerId === user.id);

  // Numbers for the small dashboard
  const countApproval = (status: ApprovalStatus) =>
    myCars.filter((car) => approvalOf(car) === status).length;
  const countAvailability = (status: CarStatus) =>
    myCars.filter((car) => car.status === status).length;

  // Apply the search and the two filters
  const query = search.trim().toLowerCase();
  const visibleCars = myCars.filter((car) => {
    if (query && !`${car.title} ${car.make} ${car.model} ${car.year}`.toLowerCase().includes(query))
      return false;
    if (approvalFilter !== "all" && approvalOf(car) !== approvalFilter) return false;
    if (availabilityFilter !== "all" && car.status !== availabilityFilter) return false;
    return true;
  });

  // The columns of the table
  const columns: Column<Car>[] = [
    {
      key: "car",
      header: "Car",
      render: (car) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {car.images[0] && (
              <Image
                src={car.images[0]}
                alt={car.title}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{car.title}</p>
            <p className="text-xs text-muted-foreground">
              {car.year} · {car.condition}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (car) => <span className="font-bold text-foreground">{formatKES(car.price)}</span>,
    },
    {
      key: "availability",
      header: "Availability",
      render: (car) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${availabilityStyles[car.status]}`}
        >
          {car.status}
        </span>
      ),
    },
    {
      key: "approval",
      header: "Approval",
      render: (car) => (
        <div>
          <ApprovalBadge status={approvalOf(car)} />
          {approvalOf(car) === "rejected" && car.rejectionReason && (
            <p className="mt-1 max-w-[220px] text-xs text-destructive">{car.rejectionReason}</p>
          )}
        </div>
      ),
    },
  ];

  // Only the admin needs to see who owns each car
  if (isAdmin) {
    columns.push({
      key: "owner",
      header: "Added by",
      render: (car) => (
        <span className="text-muted-foreground">
          {car.sellerId === "usr-admin" ? "Admin" : "Seller"}
        </span>
      ),
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={isAdmin ? "Cars" : "My Cars"}
        description={
          isAdmin
            ? "Every car in the system, from you and from your sellers."
            : "The cars you have added. New cars wait for approval before they go live."
        }
        actionLabel="Add car"
        actionHref="/admin/cars/new"
      />

      {/* Small dashboard: approval */}
      <section>
        <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Approval
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total cars" value={myCars.length} icon={CarIcon} />
          <StatCard label="Live on website" value={countApproval("approved")} icon={CheckCircle2} />
          <StatCard
            label="Waiting for approval"
            value={countApproval("pending")}
            icon={ClipboardCheck}
            highlight={countApproval("pending") > 0}
          />
          <StatCard label="Rejected" value={countApproval("rejected")} icon={XCircle} />
        </div>
      </section>

      {/* Small dashboard: availability */}
      <section>
        <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Availability
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Available" value={countAvailability("Available")} icon={Key} />
          <StatCard label="Reserved" value={countAvailability("Reserved")} icon={Clock} />
          <StatCard label="Sold" value={countAvailability("Sold")} icon={BadgeCheck} />
          <StatCard label="Incoming" value={countAvailability("Incoming")} icon={Ship} />
        </div>
      </section>

      {/* Search, filters and the table */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by make, model or year..."
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className={selectClass}
            aria-label="Filter by approval"
          >
            <option value="all">All approvals</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className={selectClass}
            aria-label="Filter by availability"
          >
            <option value="all">All availability</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Incoming">Incoming</option>
          </select>
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{visibleCars.length}</span>{" "}
          {visibleCars.length === 1 ? "car" : "cars"} shown
        </p>

        <DataTable
          columns={columns}
          rows={visibleCars}
          emptyMessage="No cars match your search."
          actions={(car) => (
            <div className="flex items-center justify-end gap-4">
              {/* Only approved cars have a public page to look at */}
              {approvalOf(car) === "approved" && (
                <Link
                  href={`/cars/${car.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                >
                  View
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}

              <Link
                href={`/admin/cars/${car.id}/edit`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-secondary hover:underline"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <button
                onClick={() => setCarToDelete(car)}
                aria-label={`Delete ${car.title}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        />

        {/* Demo helper: bring the sample cars back after deleting */}
        <div className="pt-2">
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset demo data
          </button>
        </div>
      </section>

      {/* "Are you sure?" pop-up for delete */}
      <ConfirmDialog
        open={carToDelete !== null}
        title="Delete this car?"
        message={`"${carToDelete?.title ?? ""}" will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setCarToDelete(null)}
        onConfirm={() => {
          if (carToDelete) deleteCar(carToDelete.id);
          setCarToDelete(null);
        }}
      />

      {/* "Are you sure?" pop-up for reset */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All cars you added, edited or deleted here will be replaced by the original sample cars."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetCars();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}