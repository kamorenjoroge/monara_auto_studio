'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";

import { useSite } from "./../components/SiteProvider";

const WHATSAPP_MESSAGE =
  "Hi Monara Auto Studio! I found you online and I'd like to chat about my car.";

const stats = [
  { value: "0+", label: "Years in business" },
  { value: "0", label: "Cars delivered" },
  { value: "9", label: "Specialist services" },
];

const Hero = () => {
  // The contact details come from the database, through the SiteProvider
  const site = useSite();

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-muted">
      {/* Background image */}
      <Image
        src="/image/hero1.png"
        alt="Luxury car in the Monara Auto Studio showroom"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Light overlay so dark text stays readable */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10"
        aria-hidden="true"
      />

      {/* Brand gradient line at the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 bg-brand-gradient"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Monara Auto Studio · Nairobi
          </p>

          <h1 className="font-heading text-4xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-5xl lg:text-6xl">
            Your Car.{" "}
            <span className="text-brand-gradient">Your Style.</span> Your Legacy.
          </h1>

          <p className="mt-5 max-w-xl text-base text-foreground/75 sm:text-lg">
            Imports, sales, styling, wraps, PPF and tinting. One studio for everything
            your car will ever need, handled properly every time.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
            >
              View Cars
            </Link>
            <a
              href={site.whatsappUrl(WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Stats */}
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-2xl font-bold text-secondary sm:text-3xl">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs text-foreground/70 sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* Scroll down arrow */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <a
          href="#services"
          aria-label="Scroll to services"
          className="flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-primary-dark/50 bg-white/70 text-primary-dark"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;