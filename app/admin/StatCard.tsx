import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// One number box on the dashboard.
interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string; // makes the whole card a link
  highlight?: boolean; // draws attention (used for "waiting for approval")
}

const StatCard = ({ label, value, icon: Icon, href, highlight = false }: StatCardProps) => {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            highlight ? "bg-accent/15" : "bg-primary/15"
          }`}
        >
          <Icon className={`h-5 w-5 ${highlight ? "text-accent" : "text-primary-dark"}`} />
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-foreground">{value}</p>
    </>
  );

  const cardClass = `block rounded-2xl border bg-card p-5 transition-all ${
    highlight ? "border-accent/50" : "border-border"
  }`;

  return href ? (
    <Link href={href} className={`${cardClass} hover:-translate-y-0.5 hover:border-primary hover:shadow-md`}>
      {content}
    </Link>
  ) : (
    <div className={cardClass}>{content}</div>
  );
};

export default StatCard;