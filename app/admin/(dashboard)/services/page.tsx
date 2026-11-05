'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";

import { servicesStore } from "@/lib/adminStore";
import { formatKES, getIcon } from "@/lib/types";
import type { Service } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

// Save this file as app/admin/(dashboard)/services/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function AdminServicesPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <ServicesContent />
    </RoleGuard>
  );
}

function ServicesContent() {
  const { items: services, loading, remove, reset } = useLocalStore(servicesStore);

  // The service waiting for "Are you sure?" (null = no pop-up)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // The columns of the table
  const columns: Column<Service>[] = [
    {
      key: "service",
      header: "Service",
      render: (service) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {service.image && (
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{service.title}</p>
            <p className="text-xs text-muted-foreground">{service.tagline}</p>
          </div>
        </div>
      ),
    },
    {
      key: "icon",
      header: "Icon",
      render: (service) => {
        const Icon = getIcon(service.icon);
        return (
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Icon className="h-5 w-5 text-primary-dark" />
            {service.icon}
          </span>
        );
      },
    },
    {
      key: "price",
      header: "Starting price",
      render: (service) => (
        <span className="font-bold text-foreground">
          {service.priceFrom ? formatKES(service.priceFrom) : "Contact us"}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Time",
      render: (service) => <span className="text-muted-foreground">{service.duration ?? "-"}</span>,
    },
    {
      key: "features",
      header: "Features",
      render: (service) => <span className="text-muted-foreground">{service.features.length}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Services"
        description="The services shown on the website's Services page."
        actionLabel="Add service"
        actionHref="/admin/services/new"
      />

      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{services.length}</span>{" "}
          {services.length === 1 ? "service" : "services"}
        </p>

        <DataTable
          columns={columns}
          rows={services}
          emptyMessage="No services yet. Click Add service to create the first one."
          actions={(service) => (
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-secondary hover:underline"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <button
                onClick={() => setServiceToDelete(service)}
                aria-label={`Delete ${service.title}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        />

        {/* Demo helper: bring the sample services back */}
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
        open={serviceToDelete !== null}
        title="Delete this service?"
        message={`"${serviceToDelete?.title ?? ""}" will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setServiceToDelete(null)}
        onConfirm={() => {
          if (serviceToDelete) remove(serviceToDelete.id);
          setServiceToDelete(null);
        }}
      />

      {/* "Are you sure?" pop-up for reset */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All services you added, edited or deleted here will be replaced by the original sample services."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}