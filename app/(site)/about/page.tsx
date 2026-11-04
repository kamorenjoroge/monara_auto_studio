import type { Metadata } from "next";
import Link from "next/link";
import { Diamond, HeartHandshake, MessageCircle, Phone, Target } from "lucide-react";

import { phoneUrl, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Monara Auto Studio Nairobi",
  description:
    "Monara Auto Studio is Nairobi's premium car studio for imports, sales, styling, wraps, PPF and window tinting. Your Car. Your Style. Your Legacy.",
};

// The three value cards on the right
const values = [
  {
    icon: Diamond,
    title: "Craft over shortcuts",
    text: "Proper fitment, correct films, torque specs respected. If it isn't right, it doesn't leave the shop.",
  },
  {
    icon: HeartHandshake,
    title: "Honesty first",
    text: "Real mileage, real history, real costs. We'd rather lose a sale than a reputation.",
  },
  {
    icon: Target,
    title: "Obsessed with detail",
    text: "Edge wrapping, gap lines, finish quality. The details are the difference you can see.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-primary/15">
        <div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="container relative mx-auto px-4 py-16 sm:py-20">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Our Story
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-5xl">
            About <span className="text-brand-gradient">Monara Auto Studio</span>
          </h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
        </div>
      </section>

      {/* ---------- STORY + VALUES ---------- */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* LEFT: the story */}
            <div className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                Monara Auto Studio started with a simple frustration: in Kenya, buying and
                personalising a car too often meant guesswork. Inflated mileage, surprise duty
                bills and workmanship you couldn&apos;t hold anyone to.
              </p>
              <p>
                So we built the studio we wanted to buy from. One roof on Mombasa Road where you
                can import a car, buy one from our inspected stock, wrap it, protect it with PPF,
                tint the glass and fit the accessories, all with photos, paperwork and pricing
                laid out before you commit.
              </p>
              <p>
                Today our clients drive Monara imports and Monara builds across Nairobi and
                beyond. Every one of them knows exactly what they paid for, because we told them,
                and then we delivered it.
              </p>
              <p className="pt-2 font-heading text-lg font-bold uppercase tracking-wide text-brand-gradient">
                Your Car. Your Style. Your Legacy.
              </p>
            </div>

            {/* RIGHT: the values */}
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {values.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:glow-gold"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <h2 className="mt-4 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CALL TO ACTION ---------- */}
      <section className="border-t border-border bg-gradient-to-r from-primary/15 via-background to-secondary/15 py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-foreground sm:text-3xl">
            Ready to transform your ride?
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
          <p className="mx-auto mt-4 max-w-xl text-foreground/75">
            Talk to the team today. Tell us about your car and we&apos;ll take it from there.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={phoneUrl}
              className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a
              href={whatsappUrl("Hi Monara Auto Studio! I'd like to chat about my car.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}