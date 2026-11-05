'use client';

import { useState } from "react";
// at the top, with the other imports
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Car, Phone } from "lucide-react";
import { useSite } from "./SiteProvider";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const site = useSite();

  // Active route check (also works for nested pages like /cars/[slug])
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "Imports", path: "/imports" },
    { name: "Services", path: "/services" },
    { name: "Shop", path: "/shop" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Shared link styles (desktop + mobile)
  const linkClass = (path: string) =>
    `text-sm transition-colors hover:text-secondary ${
      isActive(path)
        ? "text-foreground font-bold underline decoration-primary decoration-2 underline-offset-8"
        : "text-foreground/70 font-medium"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient">
              <Car className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-heading font-bold text-xl text-foreground">
              MONARA
            </span>
            <span className="hidden sm:inline font-heading text-xs tracking-[0.3em] text-muted-foreground">
              AUTO STUDIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={linkClass(link.path)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={site.phoneUrl}
              className="flex items-center gap-2 bg-gold-gradient text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold transition hover:glow-gold"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-border mt-2">
            <nav className="flex flex-col items-start gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${linkClass(link.path)} px-2 py-1`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="tel:0745093837"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 bg-gold-gradient text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </nav>
          </div>
        )}
      </div>
      <div
        className="bg-brand-gradient h-1 w-full"
        aria-hidden="true"
      />
    </header>
  );
};

export default NavBar;