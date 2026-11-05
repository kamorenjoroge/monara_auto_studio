'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Database, Pencil, Trash2 } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import { deleteService, fetchServices } from "@/lib/servicesDb";
import { formatKES, getIcon } from "@/lib/types";
import type { Service } from "@/lib/types";
import { useSupabaseList } from "../../useSupabaseList";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import DataTable, { type Column } from "../../DataTable";
import RoleGuard from "../../RoleGuard";

// Save this file as app/admin/(dashboard)/services/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin sees it.
// (The real protection is in the database: only the admin may change services.)
export default function AdminServicesPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <ServicesContent />
    </RoleGuard>
  );
}

function ServicesContent() {
  const { supabase, items, loading, error: loadError, reload } = useSupabaseList(fetchServices);

  // The service waiting for "Are you sure?" (null = no pop-up)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // Newest first
  const services = [...items].reverse();

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    const problem = await deleteService(supabase, serviceToDelete.id);
    setServiceToDelete(null);

    if (problem) {
      setMessage(problem);
      return;
    }
    setMessage("");
    await refreshPublic("services");
    await reload();
  };

 

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

  const errorText = message || loadError;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Services"
        description="The services shown on the website's Services page."
        actionLabel="Add service"
        actionHref="/admin/services/new"
      />

      {errorText && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {errorText}
        </div>
      )}

      {/* An empty database: offer to copy the sample services from services.json */}
      {services.length === 0 && !loadError && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Database className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-foreground">The database has no services yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy the sample services from services.json, or add your own with the button above.
          </p>
          {/* <button
            onClick={handleImport}
            disabled={importing}
            className="mt-5 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold disabled:opacity-60"
          >
            {importing ? "Importing..." : "Import the sample services"}
          </button> */}
        </div>
      )}

      {services.length > 0 && (
        <section className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{services.length}</span>{" "}
            {services.length === 1 ? "service" : "services"}
          </p>

          <DataTable
            columns={columns}
            rows={services}
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
        </section>
      )}

      {/* "Are you sure?" pop-up for delete */}
      <ConfirmDialog
        open={serviceToDelete !== null}
        title="Delete this service?"
        message={`"${serviceToDelete?.title ?? ""}" will be removed from the website. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setServiceToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}