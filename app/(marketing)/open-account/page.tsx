"use client";

import { useState } from "react";
import { ContentPage, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { CheckCircle2, Loader2 } from "lucide-react";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada",
  "Chile","China","Colombia","Croatia","Czech Republic","Denmark","Egypt","Finland","France","Germany","Ghana",
  "Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Philippines","Poland",
  "Portugal","Romania","Russia","Saudi Arabia","Senegal","Singapore","South Africa","South Korea","Spain","Sweden",
  "Switzerland","Tanzania","Thailand","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Vietnam","Zimbabwe",
];

export default function OpenAccountPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <ContentPage
      eyebrow="Personal Banking"
      title="Open an Account With Us"
      subtitle="Enjoy the benefits of Mobile Banking, Online Banking, daily checking, savings, and more. Send us a request and our team will reach out within one business day."
      imageUrl="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Bank representative helping a customer"
    >
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        {/* Form */}
        <FadeIn>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">Request Received!</h2>
                <p className="text-sm text-muted-foreground prose-width-sm">
                  Thank you for your interest in opening an account with Gainsburry Capital Bank.
                  A representative will contact you within one business day to complete your application.
                </p>
                <a
                  href="/sign-up"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Open an online account now
                </a>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-lg font-semibold text-foreground">Account Opening Request</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {[
                    { label: "Full Name",      name: "name",    type: "text",  placeholder: "Enter full name" },
                    { label: "Email",          name: "email",   type: "email", placeholder: "Enter email address" },
                    { label: "Address",        name: "address", type: "text",  placeholder: "Enter residence address" },
                    { label: "Mobile Number",  name: "phone",   type: "tel",   placeholder: "Enter mobile number" },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-13 font-medium text-foreground">{label}</label>
                      <input
                        type={type} name={name} placeholder={placeholder} required
                        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  ))}

                  {[
                    { label: "Country", name: "country", options: COUNTRIES },
                    { label: "Gender",  name: "gender",  options: ["Male", "Female", "Prefer not to say"] },
                    { label: "Account Type", name: "accountType", options: ["Savings", "Checking", "Money Market", "Business"] },
                  ].map(({ label, name, options }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-13 font-medium text-foreground">{label}</label>
                      <select
                        name={name} required
                        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}

                  <button
                    type="submit" disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
                  >
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Account Opening Request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </FadeIn>

        {/* e-Statements info */}
        <FadeIn delay={80}>
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-foreground">e-Statements</h3>
              <p className="mb-4 text-sm text-muted-foreground">Features include</p>
              <FeatureList items={[
                "Fast, easy and secure",
                "View, download and print at your convenience",
                "Receive your statements earlier",
                "Lower exposure to identity theft",
                "Environmentally friendly",
                "FREE images and FREE Bill Pay with enrollment!",
              ]} />
            </div>
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
              alt="Savings and banking"
              className="w-full rounded-2xl object-cover h-52"
            />
          </div>
        </FadeIn>
      </div>
    </ContentPage>
  );
}
