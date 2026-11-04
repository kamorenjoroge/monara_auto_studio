import { ChevronDown } from "lucide-react";

const ShopHero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/20 via-background to-accent/10">
      {/* Soft decorative glows */}
      <div
        className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        {/* Small label above the title */}
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Accessories &amp; Spare Parts
        </p>

        {/* Title */}
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold uppercase leading-tight tracking-wide text-foreground sm:text-5xl">
          Monara <span className="text-brand-gradient">Shop</span>
        </h1>

        {/* Gradient line */}
        <div
          className="mt-4 h-1 w-20 rounded-full bg-brand-gradient"
          aria-hidden="true"
        />

        {/* Description */}
        <p className="mt-5 max-w-2xl text-base text-foreground/75 sm:text-lg">
          Quality accessories and genuine spare parts for your car, with fitting
          available in-store. Order in seconds on WhatsApp.
        </p>

        {/* Small tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {["Genuine parts", "In-store fitting", "Order on WhatsApp"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary-dark/40 bg-white/70 px-4 py-1.5 text-xs font-semibold text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Scroll-down button (goes to the filters and products below) */}
        <a
          href="#shop-list"
          aria-label="Scroll to products"
          className="mt-10 flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-primary-dark/50 bg-white/70 text-primary-dark"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default ShopHero;