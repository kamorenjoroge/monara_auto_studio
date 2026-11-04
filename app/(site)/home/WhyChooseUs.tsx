import {
  BadgeCheck,
  HeartHandshake,
  Ship,
  ShieldCheck,
  Wrench,
  Clock,
} from "lucide-react";

// The reasons shown on the Home page. To change a reason, edit this list.
const reasons = [
  {
    icon: Ship,
    title: "Trusted imports",
    text: "Direct auction sourcing from Japan, the UK and UAE, with full paperwork and weekly photo updates.",
  },
  {
    icon: ShieldCheck,
    title: "Inspected stock",
    text: "Real mileage and real history. Every car is checked before it is listed.",
  },
  {
    icon: Wrench,
    title: "Expert workmanship",
    text: "Wraps, PPF and tint fitted by trained installers using quality films.",
  },
  {
    icon: BadgeCheck,
    title: "Warranty you can trust",
    text: "We stand behind our work with a workmanship warranty on PPF and tinting.",
  },
  {
    icon: HeartHandshake,
    title: "Honest pricing",
    text: "Costs and duty explained before you commit. No surprises, no hidden fees.",
  },
  {
    icon: Clock,
    title: "One studio for everything",
    text: "Import, buy, style, protect and accessorize your car under one roof.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Why Monara
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">
            Why Choose Us
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-gradient"
            aria-hidden="true"
          />
          <p className="mt-5 text-muted-foreground">
            We built the studio we wanted to buy from: honest, careful and obsessed
            with the details.
          </p>
        </div>

        {/* Grid of reasons */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:glow-gold"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </span>
              <h3 className="mt-4 font-heading text-sm font-bold uppercase tracking-wide text-card-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default WhyChooseUs;