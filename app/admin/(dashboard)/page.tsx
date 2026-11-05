'use client';

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Images,
  ShoppingBag,
  Tag,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";

import { fetchAdminCars } from "@/lib/carsDb";
import { fetchContentCounts } from "@/lib/dashboardDb";
import { formatKES } from "@/lib/types";
import type { ApprovalStatus } from "@/lib/types";
import { useAuth } from "../AuthProvider";
import { useSupabaseList } from "../useSupabaseList";
import StatCard from "../StatCard";
import ApprovalBadge from "../ApprovalBadge";

// Save this file as app/admin/(dashboard)/page.tsx
export default function DashboardPage() {
  const { user } = useAuth();

  // The cars: the admin gets every car, a seller gets only their own (decided by the database)
  const { items: cars, loading, error: loadError } = useSupabaseList(fetchAdminCars);

  // The website content numbers (only shown to the admin)
  const { items: countList } = useSupabaseList(fetchContentCounts);

  if (!user) return null; // the guard already handles this
  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isAdmin = user.role === "admin";
  const counts = countList[0];

  // A car with no approvalStatus counts as approved
  const statusOf = (status: ApprovalStatus | undefined) => status ?? "approved";
  const live = cars.filter((car) => statusOf(car.approvalStatus) === "approved").length;
  const pending = cars.filter((car) => statusOf(car.approvalStatus) === "pending").length;
  const rejected = cars.filter((car) => statusOf(car.approvalStatus) === "rejected").length;

  // The 5 newest cars (the list already comes newest first)
  const latest = cars.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground">
          Dashboard
        </h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-brand-gradient" aria-hidden="true" />
        <p className="mt-4 text-foreground/80">
          Welcome back, <span className="font-bold">{user.name}</span>.
        </p>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {loadError}
        </div>
      )}

      {/* Alert: admin has cars to approve */}
      {isAdmin && pending > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-accent/40 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm text-foreground">
              <span className="font-bold">
                {pending} {pending === 1 ? "car is" : "cars are"}
              </span>{" "}
              waiting for your approval.
            </p>
          </div>
          <Link
            href="/admin/approvals"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
          >
            Review now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Alert: a seller has rejected cars */}
      {!isAdmin && rejected > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-foreground">
            {rejected} of your {rejected === 1 ? "car was" : "cars were"} rejected. Open{" "}
            <Link href="/admin/cars" className="font-bold text-secondary underline">
              Cars
            </Link>{" "}
            to see why, fix it and send it again.
          </p>
        </div>
      )}

      {/* Car numbers */}
      <section>
        <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          {isAdmin ? "All cars" : "My cars"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total cars" value={cars.length} icon={Car} href="/admin/cars" />
          <StatCard label="Live on website" value={live} icon={CheckCircle2} />
          <StatCard
            label="Waiting for approval"
            value={pending}
            icon={ClipboardCheck}
            href={isAdmin ? "/admin/approvals" : "/admin/cars"}
            highlight={pending > 0}
          />
          <StatCard label="Rejected" value={rejected} icon={XCircle} />
        </div>
      </section>

      {/* Website content numbers (admin only) */}
      {isAdmin && counts && (
        <section>
          <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Website content
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Sellers" value={counts.sellers} icon={Users} href="/admin/sellers" />
            <StatCard label="Services" value={counts.services} icon={Wrench} href="/admin/services" />
            <StatCard label="Packages" value={counts.packages} icon={Tag} href="/admin/packages" />
            <StatCard label="Products" value={counts.products} icon={ShoppingBag} href="/admin/products" />
            <StatCard label="Gallery photos" value={counts.gallery} icon={Images} href="/admin/gallery" />
          </div>
        </section>
      )}

      {/* Latest cars */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Latest cars
          </h2>
          <Link
            href="/admin/cars"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No cars yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {latest.map((car) => (
                <li
                  key={car.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{car.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {car.year}
                      {isAdmin && ` · Added by ${car.ownerName}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-foreground">{formatKES(car.price)}</p>
                    <ApprovalBadge status={statusOf(car.approvalStatus)} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}