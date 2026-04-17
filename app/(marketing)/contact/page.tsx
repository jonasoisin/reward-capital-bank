"use client";

import { useState } from "react";
import { ContentPage, SectionHeading, InfoCard } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";

const HOURS = [
  { day: "Monday – Friday",  hours: "8:00 AM – 5:00 PM" },
  { day: "Saturday",          hours: "8:00 AM – 12:00 PM" },
  { day: "Sunday",            hours: "Closed" },
];

const LOCATIONS = [
  { name: "Main Branch — Schertz",  address: "1090 FM 78, Schertz, TX 78154",         phone: "(210) 658-1661" },
  { name: "Kirby Branch",           address: "5330 Binz-Engleman Rd, Kirby, TX 78219", phone: "(210) 658-1661" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <ContentPage
      eyebrow="Contact Information"
      title={<>Contact <em>Us</em></>}
      subtitle="We're here to help. Reach us by phone, email, or visit one of our branches in Schertz or Kirby."
      imageUrl="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Bank customer service"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

        {/* Contact Form */}
        <FadeIn>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">Message Sent!</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Thank you for reaching out. A member of our team will respond within one business day.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-lg font-semibold text-foreground">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "First Name", name: "firstName", placeholder: "John" },
                      { label: "Last Name",  name: "lastName",  placeholder: "Smith" },
                    ].map(({ label, name, placeholder }) => (
                      <div key={name} className="flex flex-col gap-1.5">
                        <label className="text-13 font-medium text-foreground">{label}</label>
                        <input name={name} placeholder={placeholder} required
                          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    ))}
                  </div>
                  {[
                    { label: "Email",   name: "email",   type: "email", placeholder: "john@example.com" },
                    { label: "Phone",   name: "phone",   type: "tel",   placeholder: "(210) 555-0000" },
                    { label: "Subject", name: "subject", type: "text",  placeholder: "How can we help?" },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-13 font-medium text-foreground">{label}</label>
                      <input type={type} name={name} placeholder={placeholder} required
                        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-13 font-medium text-foreground">Message</label>
                    <textarea name="message" rows={4} placeholder="Tell us how we can help..." required
                      className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </FadeIn>

        {/* Info panel */}
        <FadeIn delay={80}>
          <div className="space-y-6">

            {/* Phone & Email */}
            <InfoCard title="Get in Touch">
              <div className="space-y-4">
                <a href="tel:+12106581661" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  (210) 658-1661
                </a>
                <a href="mailto:info@gainsburrybank.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  info@gainsburrybank.com
                </a>
              </div>
            </InfoCard>

            {/* Hours */}
            <InfoCard title="Banking Hours">
              <div className="space-y-2">
                {HOURS.map(({ day, hours }) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary" /> {day}
                    </span>
                    <span className={`font-medium ${hours === "Closed" ? "text-red-500" : "text-foreground"}`}>{hours}</span>
                  </div>
                ))}
              </div>
            </InfoCard>

            {/* Locations */}
            <InfoCard title="Our Locations">
              <div className="space-y-5">
                {LOCATIONS.map(({ name, address, phone }) => (
                  <div key={name} className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" /> {address}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-primary" /> {phone}
                    </p>
                  </div>
                ))}
              </div>
            </InfoCard>

          </div>
        </FadeIn>
      </div>
    </ContentPage>
  );
}
