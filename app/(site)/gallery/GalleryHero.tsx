import { ChevronDown } from "lucide-react";

const GalleryHero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/15 via-background to-primary/15">
      {/* Soft decorative glows */}
      <div
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        {/* Small label above the title */}
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Our Work
        </p>

        {/* Title */}
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-5xl">
          Workshop <span className="text-brand-gradient">Gallery</span>
        </h1>

        {/* Gradient line */}
        <div
          className="mt-4 h-1 w-20 rounded-full bg-brand-gradient"
          aria-hidden="true"
        />

        {/* Description */}
        <p className="mt-5 max-w-2xl text-base text-foreground/75 sm:text-lg">
          A sample of what leaves our workshop every week. Your car could be next.
        </p>

        {/* Scroll-down button (goes to the filters and photos below) */}
        <a
          href="#gallery-list"
          aria-label="Scroll to gallery"
          className="mt-10 flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-primary-dark/50 bg-white/70 text-primary-dark"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default GalleryHero;