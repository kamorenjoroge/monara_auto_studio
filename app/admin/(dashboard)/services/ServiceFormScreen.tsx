'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { servicesStore } from "@/lib/adminStore";
import type { Service } from "@/lib/types";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getEmptyServiceValues,
  getServiceFields,
  serviceToFormValues,
  serviceValuesToFields,
} from "../../serviceFields";

// Turn a title into a web address piece: "PPF Film" becomes "ppf-film"
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface ServiceFormScreenProps {
  serviceId?: string; // given = edit that service, missing = add a new one
}

// ONE screen for both "Add service" and "Edit service". Admin only.
// Save this file as app/admin/(dashboard)/services/ServiceFormScreen.tsx
export default function ServiceFormScreen({ serviceId }: ServiceFormScreenProps) {
  return (
    <RoleGuard roles={["admin"]}>
      <ServiceFormContent serviceId={serviceId} />
    </RoleGuard>
  );
}

function ServiceFormContent({ serviceId }: ServiceFormScreenProps) {
  const router = useRouter();
  const { items: services, loading, add, update } = useLocalStore(servicesStore);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(serviceId);
  const service = services.find((item) => item.id === serviceId);

  // Editing a service that does not exist
  if (isEdit && !service) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">This service was not found. It may have been deleted.</p>
        <Link
          href="/admin/services"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>
      </div>
    );
  }

  // Runs when the form is valid
  const handleSubmit = (values: FormValues) => {
    const fields = serviceValuesToFields(values);

    if (service) {
      // EDIT: change the fields (the web address piece stays the same)
      update(service.id, fields);
    } else {
      // ADD: make a new service with its own id and web address piece
      let slug = slugify(fields.title);
      if (services.some((item) => item.slug === slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      const newService: Service = { id: `svc-${Date.now()}`, slug, ...fields };
      add(newService);
    }

    router.push("/admin/services");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </Link>

      <AdminPageHeader
        title={isEdit ? "Edit service" : "Add service"}
        description={service ? service.title : "Describe the service customers can book."}
      />

      {/* key makes the form start fresh for each service */}
      <EntityForm
        key={service?.id ?? "new"}
        fields={getServiceFields()}
        initialValues={service ? serviceToFormValues(service) : getEmptyServiceValues()}
        submitLabel={isEdit ? "Save changes" : "Add service"}
        cancelHref="/admin/services"
        onSubmit={handleSubmit}
      />
    </div>
  );
}