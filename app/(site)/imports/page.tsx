import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  FileCheck,
  FileText,
  Globe,
  Key,
  MessageCircle,
  Phone,
  Search,
  Ship,
} from "lucide-react";

import { getSite } from "@/lib/getSite";

export const metadata: Metadata = {
  title: "Car Imports from Japan, UK & UAE | Monara Auto Studio Nairobi",
  description:
    "Import your dream car to Kenya with Monara Auto Studio. Auction sourcing, shipping, Mombasa customs clearance and doorstep delivery.",
};

// The message that WhatsApp opens with on this page
const IMPORT_MESSAGE =
  "Hi Monara Auto Studio! I'd like to import a car. Can you help me?";

const whatWeNeed = [
  "Your budget and target models (or let us advise)",
  "Preferred year, mileage and colour range",
  "Timeline. Standard delivery is 6–10 weeks",
  "We handle the rest: auction bid, inspection, shipping, duty and registration",
];

const whatYouGet = [
  "Auction sheet translated and explained",
  "Pre-shipment inspection photos",
  "Duty & tax breakdown before you commit",
  "Weekly photo updates while the car is on the water",
  "Full customs clearance at Mombasa",
  "Number plates fitted and delivered ready to drive",
];

const steps = [
  {
    icon: Search,
    title: "Choose",
    text: "Tell us your budget and the car you want.",
  },
  {
    icon: Globe,
    title: "Source",
    text: "We find and bid on the best match at trusted auctions.",
  },
  {
    icon: Ship,
    title: "Ship",
    text: "Your car is inspected and shipped, with weekly updates.",
  },
  {
    icon: FileCheck,
    title: "Clear",
    text: "We handle duty and customs clearance at Mombasa.",
  },
  {
    icon: Key,
    title: "Deliver",
    text: "Registered, plated and handed over, ready to drive.",
  },
];

export default async function ImportsPage() {
  // Fetch dynamic site information
  const site = await getSite();

  // Generate WhatsApp URL using the site configuration
  const chatUrl = site.whatsappUrl(IMPORT_MESSAGE);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/20 via-background to-secondary/15">
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Import With Confidence
          </p>

          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-5xl">
            Your Dream Car,{" "}
            <span className="text-brand-gradient">
              Imported Properly
            </span>
          </h1>

          <div
            className="mt-4 h-1 w-20 rounded-full bg-brand-gradient"
            aria-hidden="true"
          />

          <p className="mt-5 max-w-2xl text-base text-foreground/75 sm:text-lg">
            We source from trusted auctions in Japan, the UK, UAE and Thailand,
            then handle shipping, duty and registration, and hand you the keys.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
            >
              Start My Import
            </Link>

            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ---------- WHAT WE NEED / WHAT YOU GET ---------- */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* What we need */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                <FileText className="h-5 w-5 text-primary-dark" />
                What we need from you
              </h2>

              <ul className="mt-5 space-y-3">
                {whatWeNeed.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What you get */}
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                <Ship className="h-5 w-5 text-primary-dark" />
                What you get
              </h2>

              <ul className="mt-5 space-y-3">
                {whatYouGet.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="border-t border-border bg-muted/40 py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              How It Works
            </p>

            <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground">
              From Auction To Your Driveway
            </h2>

            <div
              className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-gradient"
              aria-hidden="true"
            />
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className="relative rounded-2xl border border-border bg-card p-5 text-center"
              >
                <span className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {index + 1}
                </span>

                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </span>

                <h3 className="mt-4 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- CALL TO ACTION ---------- */}
      <section className="border-t border-border bg-gradient-to-r from-primary/15 via-background to-secondary/15 py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground sm:text-3xl">
            Ready to import your car?
          </h2>

          <div
            className="mx-auto mt-3 h-1 w-20 rounded-full bg-brand-gradient"
            aria-hidden="true"
          />

          <p className="mx-auto mt-4 max-w-xl text-foreground/75">
            Tell us what you&apos;re looking for and we&apos;ll send you options
            with a full cost breakdown, before you commit to anything.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {/* Phone */}
            <a
              href={site.phoneUrl}
              className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
            >
              <Phone className="h-4 w-4" />
              Call {site.phoneDisplay}
            </a>

            {/* WhatsApp */}
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}