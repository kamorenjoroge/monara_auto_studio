import Link from "next/link";
import { Plus } from "lucide-react";

// The top of every admin page: title, short description and an optional "Add" button.
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string; // text of the button, e.g. "Add car"
  actionHref?: string; // where the button goes
}

const AdminPageHeader = ({ title, description, actionLabel, actionHref }: AdminPageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground">
          {title}
        </h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-brand-gradient" aria-hidden="true" />
        {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default AdminPageHeader;