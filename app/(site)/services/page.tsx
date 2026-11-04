import type { Metadata } from "next";

import { getServices } from "@/lib/api";
import ServicesHero from "./ServicesHero";
import ServiceCard from "./ServicesCard";

export const metadata: Metadata = {
  title: "Services | Monara Auto Studio",
  description:
    "Car imports, sales, styling, wraps, PPF, window tinting and customization at Monara Auto Studio in Nairobi.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <ServicesHero />

      <section id="services-list" className="scroll-mt-16 py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}