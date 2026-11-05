'use client';

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import type { SiteSettings } from "@/lib/adminStore";
import { createClient } from "@/lib/supabase/client";
import { fetchSettings, saveSettings } from "@/lib/settingsDb";
import AdminPageHeader from "../../AdminPageHeader";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getSettingsFields,
  settingsToFormValues,
  settingsValuesToFields,
} from "../../settingsFields";

// Save this file as app/admin/(dashboard)/settings/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin sees it.
// (The real protection is in the database: only the admin may update the settings row.)
export default function SettingsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <SettingsContent />
    </RoleGuard>
  );
}

function SettingsContent() {
  const [supabase] = useState(() => createClient());

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Read the settings from the database when the page opens
  useEffect(() => {
    fetchSettings(supabase).then((found) => {
      setSettings(found);
      setLoading(false);
    });
  }, [supabase]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  if (!settings) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-foreground">
        The settings could not be loaded. Check that the settings row exists in the database.
      </div>
    );
  }

  // Runs when the form is valid: save to the database
  const handleSubmit = async (values: FormValues) => {
    setSaved(false);
    setError("");

    const fields = settingsValuesToFields(values);
    const message = await saveSettings(supabase, fields);

    if (message) {
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" }); // so the message is seen
      return;
    }

    setSettings({ ...settings, ...fields });
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Settings"
        description="The contact details used across the website: the phone and WhatsApp buttons, the footer and the Contact page."
      />

      <div className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
        <p>
          These settings are now saved in the database. The public website will start reading them
          in the next step. Until then, it still uses the numbers in{" "}
          <span className="font-semibold">lib/site.ts</span>.
        </p>
      </div>

      {saved && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-whatsapp/40 bg-whatsapp/10 p-4 text-sm text-foreground">
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-whatsapp-dark" />
            Settings saved to the database.
          </p>
          <button
            onClick={() => setSaved(false)}
            className="shrink-0 font-semibold text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          {error}
        </div>
      )}

      <EntityForm
        fields={getSettingsFields()}
        initialValues={settingsToFormValues(settings)}
        submitLabel="Save settings"
        cancelHref="/admin"
        onSubmit={handleSubmit}
      />
    </div>
  );
}