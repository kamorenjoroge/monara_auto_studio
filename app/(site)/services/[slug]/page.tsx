import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, MessageCircle, Phone } from "lucide-react";

import { getServiceBySlug, getServices } from "@/lib/api";
import { formatKES, getIcon } from "@/lib/types";
import { whatsappUrl, phoneUrl, SITE } from "@/lib/site";
import ServiceCard from "./../ServicesCard";

interface ServiceDetailsPageProps {
  params: Promise<{ slug: string }>;
}

// STEP A: the page itself does NOT read the address.
// It just shows a placeholder while the real content loads.
export default function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  return (
    <Suspense fallback={<ServiceDetailsSkeleton />}>
      <ServiceDetails params={params} />
    </Suspense>
  );
}

// STEP B: read the address, find the service and draw the page.
async function ServiceDetails({ params }: ServiceDetailsPageProps) {
  // 1. Read the slug from the web address (e.g. "ppf")
  const { slug } = await params;

  // 2. Find that service in our data
  const service = await getServiceBySlug(slug);

  // 3. If there is no such service, show the 404 page
  if (!service) notFound();

  // 4. Other services for the bottom section (not this one)
  const allServices = await getServices();
  const otherServices = allServices.filter((s) => s.id !== service.id).slice(0, 3);

  // Turn the icon name from the JSON (e.g. "Shield") into a real icon
  const Icon = getIcon(service.icon);

  // The WhatsApp message includes the name of THIS service
  const message = `Hi Monara, I'd like to book or get a quote for ${service.title} at ${service.priceFrom ? formatKES(service.priceFrom) : ''}.`;

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* LEFT: photo, description, features (wide) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Photo with the icon badge */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-gradient shadow-md">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </span>
            </div>

            {/* Title + tagline + description */}
            <div>
              <h1 className="font-heading text-3xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-4xl">
                {service.title}
              </h1>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-secondary">
                {service.tagline}
              </p>
              <div className="mt-4 h-1 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
              <p className="mt-5 leading-relaxed text-foreground/80">{service.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
                What&apos;s included
              </h2>
              <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 rounded-xl border border-border bg-card p-4 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: price + booking (sticky) */}
          <aside className="lg:col-span-1">
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                Book this service
              </p>

              <div className="border-b border-border pb-4">
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="font-heading text-3xl font-bold text-foreground">
                  {service.priceFrom ? formatKES(service.priceFrom) : "Contact us"}
                </p>
              </div>

              {service.duration && (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <Clock className="h-5 w-5 text-primary-dark" />
                  Typical time: <span className="font-semibold">{service.duration}</span>
                </div>
              )}

              <div className="space-y-3">
                <a
                  href={whatsappUrl(message)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp-dark"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book on WhatsApp
                </a>
                <a
                  href={phoneUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
                >
                  <Phone className="h-4 w-4" />
                  Call {SITE.phoneDisplay}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* BOTTOM: other services */}
      {otherServices.length > 0 && (
        <section className="border-t border-border bg-muted/40 py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground">
              Other Services
            </h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherServices.map((other) => (
                <ServiceCard key={other.id} service={other} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// STEP C: the placeholder shown for a moment while the service loads.
function ServiceDetailsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="aspect-[16/9] animate-pulse rounded-2xl bg-muted" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </section>
  );
}