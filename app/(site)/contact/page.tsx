import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getServices } from "@/lib/api";
import { getSite } from "@/lib/getSite";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Monara Auto Studio",
  description:
    "Call, WhatsApp, email or visit Monara Auto Studio in Nairobi. We respond fast during opening hours.",
};

export default async function ContactPage() {
  // The form's "What do you need?" dropdown uses our service names
  const services = await getServices();
  const serviceNames = services.map((service) => service.title);

  // The contact details, hours and links come from the database (Settings page)
  const site = await getSite();

  // The four small cards on the left
  const contactCards = [
    {
      icon: Phone,
      title: "Call Us",
      text: site.phoneDisplay,
      href: site.phoneUrl,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      text: "Chat with us instantly",
      href: site.whatsappUrl("Hi Monara Auto Studio! I'd like to chat about my car."),
    },
    {
      icon: Mail,
      title: "Email",
      text: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPin,
      title: "Visit the Studio",
      text: site.address,
      href: undefined, // not a link, just text
    },
  ];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/15 via-background to-accent/10">
        <div
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="container relative mx-auto px-4 py-16 sm:py-20">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Get In Touch
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-5xl">
            Contact <span className="text-brand-gradient">Us</span>
          </h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
          <p className="mt-5 max-w-2xl text-base text-foreground/75 sm:text-lg">
            Call, WhatsApp, email or drop by. We respond fast during opening hours.
          </p>
        </div>
      </section>

      {/* ---------- DETAILS + FORM ---------- */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* LEFT: contact cards + opening hours */}
            <div className="space-y-4 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {contactCards.map(({ icon: Icon, title, text, href }) => {
                  const content = (
                    <>
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                        <Icon className="h-5 w-5 text-primary-dark" />
                      </span>
                      <h2 className="mt-3 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                        {title}
                      </h2>
                      <p className="mt-1 break-words text-sm text-muted-foreground">{text}</p>
                    </>
                  );

                  const cardClass =
                    "block rounded-2xl border border-border bg-card p-5 transition-all";

                  // Cards with a link get a hover effect, the address card does not
                  return href ? (
                    <a
                      key={title}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className={`${cardClass} hover:-translate-y-1 hover:border-primary hover:glow-gold`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={title} className={cardClass}>
                      {content}
                    </div>
                  );
                })}
              </div>

              {/* Opening hours (from the database) */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary-dark" />
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                    Opening Hours
                  </h2>
                </div>
                <dl className="mt-4 divide-y divide-border text-sm">
                  {site.hours.map((row) => (
                    <div key={row.days} className="flex justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">{row.days}</dt>
                      <dd className="font-semibold text-foreground">{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* RIGHT: enquiry form */}
            <div className="lg:col-span-3">
              <ContactForm services={serviceNames} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}