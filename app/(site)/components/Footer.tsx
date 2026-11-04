import Link from "next/link";
import { Car, Clock, Mail, MapPin, Phone } from "lucide-react";
import { phoneUrl } from "@/lib/site";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "Imports", path: "/imports" },
    { name: "Services", path: "/services" },
    { name: "Shop", path: "/shop" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Car Imports", path: "/imports" },
    { name: "Car Sales", path: "/cars" },
    { name: "Car Wraps", path: "/services/wraps" },
    { name: "Paint Protection (PPF)", path: "/services/ppf" },
    { name: "Window Tinting", path: "/services/window-tinting" },
    { name: "Customization", path: "/services/custom-styling" },
  ];

  const socials = [
    { name: "Instagram", url: "#" },
    { name: "Facebook", url: "#" },
    { name: "TikTok", url: "#" },
  ];

  const hours = [
    { days: "Mon – Fri", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ];

  return (
    <footer className="border-t border-border bg-white">
      {/* Brand gradient line */}
      <div
        className="bg-brand-gradient h-1 w-full"
        aria-hidden="true"
      />

      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient">
              <Car className="h-5 w-5 text-primary-foreground" />
            </span>

            <span className="font-heading font-bold text-xl text-foreground">
              MONARA
            </span>

            <span className="font-heading text-xs tracking-[0.3em] text-muted-foreground">
              AUTO STUDIO
            </span>
          </Link>

          <p className="font-heading text-xs uppercase tracking-[0.2em] text-secondary">
            Your Car. Your Style. Your Legacy.
          </p>

          <p className="text-sm text-muted-foreground">
            Nairobi&apos;s home for car imports, sales, styling, wraps, PPF and
            tinting.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-primary hover:text-secondary"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Quick Links
          </h3>

          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Services
          </h3>

          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.name}>
                <Link
                  href={service.path}
                  className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Contact &amp; Hours
          </h3>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
              <a href={phoneUrl} className="hover:text-secondary">
                {phoneUrl.replace("tel:", "")}
              </a>
              
            </li>

            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
              <a
                href="mailto:info@monaraautostudio.co.ke"
                className="hover:text-secondary"
              >
                info@monaraautostudio.co.ke
              </a>
            </li>

            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
              Nairobi, Kenya
            </li>
          </ul>

          <div className="mt-5 space-y-2 rounded-xl border border-border bg-muted p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-dark" />

              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
                Opening Hours
              </span>
            </div>

            {hours.map((row) => (
              <div
                key={row.days}
                className="flex justify-between gap-2 text-xs text-muted-foreground"
              >
                <span>{row.days}</span>
                <span className="font-medium text-foreground/80">
                  {row.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 Monara Auto Studio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;