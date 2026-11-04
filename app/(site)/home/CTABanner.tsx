import { MessageCircle, Phone } from "lucide-react";

import { phoneUrl, whatsappUrl, SITE } from "@/lib/site";

const CTABanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary-dark via-secondary to-accent">
      {/* Soft decorative glows */}
      <div
        className="absolute -left-16 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        {/* Small label */}
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
          Start Today
        </p>

        {/* Title */}
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold uppercase leading-tight tracking-wide text-white sm:text-5xl">
          Ready to build <span className="text-primary-light">your legacy?</span>
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
          Call, WhatsApp or visit the studio. We&apos;ll talk cars, options and timelines.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={phoneUrl}
            className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:glow-gold"
          >
            <Phone className="h-4 w-4" />
            Call {SITE.phoneDisplay}
          </a>
          <a
            href={whatsappUrl("Hi Monara Auto Studio! I'd like to talk about my car.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-secondary"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;