import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock } from "lucide-react";

import { formatKES, getIcon } from "@/lib/types";
import type { Service } from "@/lib/types";

// This component draws ONE service card.
// It receives a single `service` (shaped by the Service type) and shows it.
interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Turn the icon name from the JSON (e.g. "Ship") into a real icon component
  const Icon = getIcon(service.icon);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:glow-gold">
      {/* Image + icon badge */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden="true"
        />
        <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient shadow-md">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-card-foreground">
          {service.title}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary">
          {service.tagline}
        </p>

        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {service.description}
        </p>

        {/* First 3 features */}
        <ul className="mt-4 space-y-2">
          {service.features.slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Price, duration and link (pinned to the bottom of the card) */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="font-bold text-foreground">
                {service.priceFrom ? formatKES(service.priceFrom) : "Contact us"}
              </p>
            </div>
            {service.duration && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 text-primary-dark" />
                {service.duration}
              </div>
            )}
          </div>

          <Link
            href={`/services/${service.slug}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-all hover:gap-3"
          >
            Learn more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;