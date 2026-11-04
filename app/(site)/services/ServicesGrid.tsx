import Link from "next/link";

import type { Service } from "@/lib/types";
import ServiceCard from "./ServicesCard";

// This component draws the whole SECTION: heading + grid layout.
// It receives a LIST of services and draws one ServiceCard for each.
interface ServicesGridProps {
  services: Service[];
}

const ServicesGrid = ({ services }: ServicesGridProps) => {
  return (
    <section id="services" className="scroll-mt-16 bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            What We Do
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">
            Everything Your Car Needs
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-gradient"
            aria-hidden="true"
          />
          <p className="mt-5 text-muted-foreground">
            From importing your dream car to protecting and styling it, one studio
            handles it all.
          </p>
        </div>

        {/* Grid of cards */}
        {services.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            No services to show yet.
          </p>
        )}

        {/* View all button 
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-block rounded-xl bg-gold-gradient px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
          >
            View All Services
          </Link>
        </div>
        */}
      </div>
    </section>
  );
};

export default ServicesGrid;