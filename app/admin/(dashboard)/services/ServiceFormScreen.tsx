'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { refreshPublic } from "@/lib/refresh";
import { createService, fetchServices, updateService } from "@/lib/servicesDb";
import { useSupabaseList } from "../../useSupabaseList";
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
  const { supabase, items: services, loading, error: loadError } = useSupabaseList(fetchServices);
  const [error, setError] = useState("");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const isEdit = Boolean(serviceId);
  const service = services.find((item) => item.id === serviceId);

  // Editing a service that does not exist
  if (isEdit && !service) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-foreground">
          {loadError || "This service was not found. It may have been deleted."}
        </p>
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

  // Runs when the form is valid: save to the database
  const handleSubmit = async (values: FormValues) => {
    setError("");
    const fields = serviceValuesToFields(values);
    let message: string | null;

    if (service) {
      // EDIT (the web address piece stays the same)
      message = await updateService(supabase, service.id, fields);
    } else {
      // ADD: make a web address piece from the title, and make sure it is not taken
      let slug = slugify(fields.title);
      if (services.some((item) => item.slug === slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      message = await createService(supabase, slug, fields);
    }

    if (message) {
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" }); // so the message is seen
      return;
    }

    await refreshPublic("services"); // the public website shows the change straight away
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

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

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