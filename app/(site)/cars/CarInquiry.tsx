'use client';

import { useState } from "react";
import { CheckCircle2, MessageCircle, Phone, Send } from "lucide-react";

import { formatKES } from "@/lib/types";
import type { Car, CarStatus } from "@/lib/types";
import { phoneUrl, whatsappUrl } from "@/lib/site";

// Color of the status label for each status
const statusStyles: Record<CarStatus, string> = {
  Available: "bg-primary text-primary-foreground",
  Reserved: "bg-secondary text-secondary-foreground",
  Sold: "bg-foreground/80 text-white",
  Incoming: "bg-accent text-accent-foreground",
};

// Shared look for every input box
const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

interface CarInquiryProps {
  car: Car;
}

const CarInquiry = ({ car }: CarInquiryProps) => {
  // What the visitor has typed so far
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in the ${car.title}. Is it still available?`,
  });
  // Error messages to show under the boxes
  const [errors, setErrors] = useState<Record<string, string>>({});
  // True after the form is sent
  const [submitted, setSubmitted] = useState(false);

  // Update one box as the visitor types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Check the boxes. Returns true if everything is fine.
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (form.name.trim().length < 2) newErrors.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Please enter a valid email.";
    if (form.phone.replace(/\D/g, "").length < 9)
      newErrors.phone = "Please enter a valid phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading
    if (!validate()) return;

    // No backend yet: we only print the data. Later this will save to Supabase.
    console.log("New car inquiry:", { carId: car.id, carTitle: car.title, ...form });
    setSubmitted(true);
  };

  // The number comes from lib/site.ts, so only the message is written here
  const whatsappMessage = `Hi Monara, I'm interested in the ${car.title} (${car.year}) listed at ${formatKES(car.price)}.`;

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
      {/* Car summary */}
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyles[car.status]}`}
        >
          {car.status}
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground">
          {car.condition}
        </span>
      </div>

      <h1 className="font-heading text-2xl font-extrabold uppercase leading-tight tracking-wide text-foreground">
        {car.title}
      </h1>

      <div className="border-y border-border py-4">
        <p className="text-xs text-muted-foreground">Price</p>
        <p className="font-heading text-3xl font-bold text-foreground">
          {formatKES(car.price)}
        </p>
      </div>

      {/* Form, or the thank-you message after sending */}
      {submitted ? (
        <div className="rounded-xl bg-primary/10 p-5 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary-dark" />
          <h3 className="mt-3 font-heading text-base font-bold uppercase text-foreground">
            Thank you, {form.name.split(" ")[0]}!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We received your inquiry and will contact you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm font-semibold text-secondary hover:underline"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Inquire about this car
          </h2>

          {/* Full name */}
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-semibold text-muted-foreground">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Francis Njoroge"
              className={inputClass}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-muted-foreground">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="07XX XXX XXX"
              className={inputClass}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="mb-1 block text-xs font-semibold text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={form.message}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
          >
            <Send className="h-4 w-4" />
            Send Inquiry
          </button>
        </form>
      )}

      {/* Quick contact */}
      <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
        <a
          href={whatsappUrl(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-3 py-2.5 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp-dark"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={phoneUrl}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-secondary px-3 py-2.5 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
      </div>
    </div>
  );
};

export default CarInquiry;