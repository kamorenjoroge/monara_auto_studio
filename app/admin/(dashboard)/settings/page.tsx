'use client';

import { useState } from "react";
import { CheckCircle2, Info, RotateCcw } from "lucide-react";

import { settingsStore } from "@/lib/adminStore";
import { useLocalStore } from "../../useLocalStore";
import AdminPageHeader from "../../AdminPageHeader";
import ConfirmDialog from "../../ConfirmDialog";
import EntityForm, { type FormValues } from "../../EntityForm";
import RoleGuard from "../../RoleGuard";
import {
  getSettingsFields,
  settingsToFormValues,
  settingsValuesToFields,
} from "../../settingsFields";

// Save this file as app/admin/(dashboard)/settings/page.tsx
// The whole page is wrapped in RoleGuard, so only the admin can open it.
export default function SettingsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <SettingsContent />
    </RoleGuard>
  );
}

function SettingsContent() {
  const { items, loading, update, reset } = useLocalStore(settingsStore);

  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [formKey, setFormKey] = useState(0); // changing it makes the form start fresh

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  // The settings are one record: the first (and only) item of the list
  const settings = items[0];
  if (!settings) return <p className="text-muted-foreground">No settings found.</p>;

  const handleSubmit = (values: FormValues) => {
    update(settings.id, settingsValuesToFields(values));
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Settings"
        description="The contact details used across the website: the phone and WhatsApp buttons, the footer and the Contact page."
      />

      {/* Honest note about the design phase */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
        <p>
          While we are designing with sample data, your changes are saved in this dashboard only.
          The website still uses the numbers in <span className="font-semibold">lib/site.ts</span>.
          Once the real database is connected, saving here updates every page at once.
        </p>
      </div>

      {saved && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-whatsapp/40 bg-whatsapp/10 p-4 text-sm text-foreground">
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-whatsapp-dark" />
            Settings saved.
          </p>
          <button
            onClick={() => setSaved(false)}
            className="shrink-0 font-semibold text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      <EntityForm
        key={`${settings.id}-${formKey}`}
        fields={getSettingsFields()}
        initialValues={settingsToFormValues(settings)}
        submitLabel="Save settings"
        cancelHref="/admin"
        onSubmit={handleSubmit}
      />

      {/* Demo helper: go back to the original values */}
      <div>
        <button
          onClick={() => setConfirmReset(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset demo data
        </button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset settings?"
        message="The settings will go back to the original values from lib/site.ts."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset();
          setFormKey((key) => key + 1);
          setSaved(false);
          setConfirmReset(false);
        }}
      />
    </div>
  );
}