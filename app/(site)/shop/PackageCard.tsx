import { Check, Clock, MessageCircle } from "lucide-react";

import { formatKES } from "@/lib/types";
import type { Package } from "@/lib/types";
import { getSite } from "@/lib/getSite";

// Draws ONE package card. Receives a single `pkg` (shaped by the Package type).
interface PackageCardProps {
  pkg: Package;
}

const PackageCard = async ({ pkg }: PackageCardProps) => {
  // How much the customer saves, if there is an original price
  const site = await getSite();

  const saving = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;

  const message = `Hi Monara, I'd like to book the ${pkg.name} package (${formatKES(pkg.price)}).`;

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-gold ${
        pkg.popular ? "border-primary shadow-md" : "border-border hover:border-primary"
      }`}
    >
      {/* "Most popular" ribbon */}
      {pkg.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-gold-gradient px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
          Most popular
        </span>
      )}

      {/* Category */}
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
        {pkg.category}
      </p>

      {/* Name + description */}
      <h3 className="mt-1 font-heading text-lg font-bold uppercase tracking-wide text-card-foreground">
        {pkg.name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>

      {/* Price */}
      <div className="mt-5 border-y border-border py-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-heading text-2xl font-bold text-foreground">
            {formatKES(pkg.price)}
          </p>
          {pkg.originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              {formatKES(pkg.originalPrice)}
            </p>
          )}
        </div>
        {saving > 0 && (
          <p className="mt-1 text-xs font-semibold text-accent">
            Save {formatKES(saving)}
          </p>
        )}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-4 w-4 text-primary-dark" />
          {pkg.duration}
        </div>
      </div>

      {/* Features */}
      <ul className="mt-4 space-y-2">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Button (pinned to the bottom of the card) */}
      <div className="mt-auto pt-6">
        <a
          href={site.whatsappUrl(message)}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
        >
          <MessageCircle className="h-4 w-4" />
          Book on WhatsApp
        </a>
      </div>
    </article>
  );
};

export default PackageCard;