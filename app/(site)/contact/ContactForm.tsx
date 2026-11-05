'use client';

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useSite } from "./../components/SiteProvider"

// Shared look for every input box
const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

interface ContactFormProps {
  services: string[]; // names for the "What do you need?" dropdown
}

const ContactForm = ({ services }: ContactFormProps) => {
  // What the visitor has typed so far
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

   const site = useSite();
  // Error messages to show under the boxes
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update one box as the visitor types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Check the boxes. Returns true if everything is fine.
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (form.name.trim().length < 2) newErrors.name = "Please enter your name.";
    if (form.phone.replace(/\D/g, "").length < 9)
      newErrors.phone = "Please enter a valid phone number.";
    // Email is optional, but if it is filled in it must look like an email
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Please enter a valid email.";
    if (!form.service) newErrors.service = "Please choose a service.";
    if (form.message.trim().length < 5) newErrors.message = "Please write a short message.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading
    if (!validate()) return;

    // Build the WhatsApp message from what was typed
    const message = [
      "Hello Monara Auto Studio!",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : "",
      `I need: ${form.service}`,
      "",
      form.message,
    ]
      .filter((line, index) => line !== "" || index > 4) // drop the empty email line
      .join("\n");

    // Open WhatsApp with the message ready to send
    window.open(site.whatsappUrl(message), "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        Send an Enquiry
      </h2>
      <div className="mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />

      <div className="mt-6 space-y-5">
        {/* Name + Phone side by side */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-muted-foreground">
              Your name <span className="text-secondary">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Wanjiku"
              className={inputClass}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm text-muted-foreground">
              Phone <span className="text-secondary">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="07xx xxx xxx"
              className={inputClass}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>
        </div>

        {/* Email (optional) */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
            Email <span className="text-primary-dark">(optional)</span>
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

        {/* Service dropdown */}
        <div>
          <label htmlFor="service" className="mb-1 block text-sm text-muted-foreground">
            What do you need? <span className="text-secondary">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={form.service}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
          {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1 block text-sm text-muted-foreground">
            Message <span className="text-secondary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your car, budget or the service you need..."
            className={inputClass}
          />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3.5 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
        >
          <Send className="h-4 w-4" />
          Send via WhatsApp
        </button>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          Your enquiry opens in WhatsApp. Nothing is stored on this site.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;