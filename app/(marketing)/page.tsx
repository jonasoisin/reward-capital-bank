import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Landmark, CandlestickChart } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gainsburry Capital Bank — Texas Community Banking",
  description: "A small Texas state-chartered community bank headquartered in Schertz, TX. Providing personalized retail and business banking to the San Antonio area since 1913.",
  alternates: { canonical: "https://gainsboroughtcapital.com" },
};

export default function MarketingHome() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gainsboroughtcapital.com" },
    ],
  };

  return (
    <div className="font-inter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative flex h-[85vh] min-h-[650px] items-center justify-center overflow-hidden border-b border-border">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
          alt="Gainsburry Capital Bank — serving the San Antonio area"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Glassmorphic overlay — blurs + darkens the image */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <FadeIn>
            <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-10 sm:p-16 lg:p-20 shadow-[0_8px_64px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                <div className="space-y-6 lg:pr-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                    TEXAS STATE-CHARTERED BANK
                  </span>
                  <h1 className="text-white ds leading-[1.1] tracking-[-0.03em]">
                    Your community.
                    <br />
                    Your <span className="font-ibm-plex-serif italic font-normal">bank.</span>
                  </h1>
                </div>

                <div className="space-y-10 lg:pl-6 pt-4 lg:pt-0">
                  <p className="text-white text-[1.1rem] leading-relaxed">
                    Headquartered in Schertz, TX. Personalized local banking, competitive deposit rates, and business services tailored for the San Antonio area.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-black transition-all hover:bg-white/90 shadow-sm"
                    >
                      Open an account <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-white/20"
                    >
                      Member login
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-border lg:gap-0">
            <FadeIn delay={0} className="lg:pr-8">
              <dt className="stat-number text-foreground tracking-tight">1913</dt>
              <dd className="mt-2 feature-text text-muted-foreground uppercase tracking-widest font-medium">Roots Founded</dd>
            </FadeIn>
            <FadeIn delay={80} className="lg:px-8">
              <dt className="stat-number text-foreground tracking-tight">$881M</dt>
              <dd className="mt-2 feature-text text-muted-foreground uppercase tracking-widest font-medium">Total Assets</dd>
            </FadeIn>
            <FadeIn delay={160} className="lg:px-8">
              <dt className="stat-number text-foreground tracking-tight">$768M</dt>
              <dd className="mt-2 feature-text text-muted-foreground uppercase tracking-widest font-medium">Customer Deposits</dd>
            </FadeIn>
            <FadeIn delay={240} className="lg:pl-8">
              <dt className="stat-number text-foreground tracking-tight">$687M</dt>
              <dd className="mt-2 feature-text text-muted-foreground uppercase tracking-widest font-medium">Local Loans Funded</dd>
            </FadeIn>
          </dl>
        </div>
      </section>

      {/* Feature Split Layout */}
      <section className="border-b border-border py-20 canvas-grid">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-16 space-y-4">
            <span className="eyebrow">Banking Philosophy</span>
            <p>
              <span className="feature-heading text-foreground">Big bank capability. </span>
              <span className="feature-body text-muted-foreground">
                Small town hospitality. We offer digital-first convenience backed by the personal touch of a neighbor.
              </span>
            </p>
          </FadeIn>

          <div className="space-y-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <FadeIn delay={0} className="space-y-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="ds text-foreground">Secure & Reliable</h3>
                <p className="feature-text text-muted-foreground prose-width">
                  Your funds are protected. We are a Texas state-chartered institution, fully FDIC insured up to allowable limits for your peace of mind.
                </p>
                <ul className="space-y-3 pt-4">
                  {["FDIC Insured Deposits", "Local Board of Directors", "Equal Housing Lender"].map((item, i) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="feature-text text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn delay={100} className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm">
                 <div className="mb-4">
                   <h4 className="font-semibold text-foreground">Regulatory Excellence</h4>
                 </div>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Led by a 10-member local board of directors chaired by Roy W. Richard Jr. We proactively serve the Schertz, Cibolo, Guadalupe, Comal, Hays, and Bexar counties.
                 </p>
              </FadeIn>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:[&>*:first-child]:order-2">
              <FadeIn delay={0} className="space-y-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Landmark className="h-6 w-6 text-primary" />
                </div>
                <h3 className="ds text-foreground">Accounts Built for You</h3>
                <p className="feature-text text-muted-foreground prose-width">
                  From everyday spending to wealth storage, our multi-tiered checking and high-yield savings products work for you.
                </p>
                <ul className="space-y-3 pt-4">
                  {["Free e-Checking Options", "4.5% APY High-Yield Savings", "Business Operating Accounts"].map((item, i) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="feature-text text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn delay={100} className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-sm">
                 <div className="mb-6 flex items-baseline gap-2">
                   <span className="text-4xl font-light text-foreground tracking-tighter">4.50</span>
                   <span className="text-xl font-medium text-muted-foreground">% APY</span>
                 </div>
                 <p className="text-sm text-muted-foreground">
                   Earn exceptional returns on your idle funds with our preferred savings tier. <span className="text-xs opacity-70 block mt-2">*Terms apply. 6 withdrawals limit per month.</span>
                 </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Closing Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn delay={0}>
            <span className="eyebrow justify-center uppercase tracking-widest text-muted-foreground">Get started</span>
          </FadeIn>
          <FadeIn delay={80}>
            <h2 className="mt-4 ds text-foreground text-balance">
              Secure your wealth. Modernize your <em>banking.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="mx-auto mt-6 feature-text text-muted-foreground prose-width-sm">
              Discover the difference of a bank that puts Schertz and the surrounding communities first. Five minutes to apply online today.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Start free application <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <Link
                href="/locations"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-border bg-background px-8 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                Find a branch
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
