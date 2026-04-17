import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function CDsIRAsPage() {
  return (
    <ContentPage
      eyebrow="Personal Banking"
      title={<>Certificates of Deposit <em>&amp; IRAs</em></>}
      subtitle="Gainsburry Capital Bank offers fixed rate, simple interest CDs for different terms and rates. CDs are automatically renewable. Different rates are offered for Jumbo CDs ($100,000 or more)."
      imageUrl="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Certificate of deposit and savings"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Regular CDs */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="Certificates of Deposit"
            title="Regular CDs"
            subtitle="A Certificate of Deposit is a non-negotiable, interest-bearing instrument with which a customer promises to keep funds on deposit for a specified length of time, thereby earning a guaranteed rate of return."
          />
          <InfoCard title="Regular CDs — Minimum to open: $1,000">
            <div className="space-y-3 text-sm text-muted-foreground">
              {[
                { term: "Three Month CD",       interest: "Paid at term back to CD",     penalty: "1 month's interest" },
                { term: "Six Month CD",          interest: "Paid at term back to CD",     penalty: "1 month's interest" },
                { term: "12 Month – 24 Month CD", interest: "Paid quarterly back to CD", penalty: "3 months' interest" },
                { term: "3 Year – 5 Year CD",    interest: "Paid quarterly back to CD",  penalty: "6 months' interest" },
              ].map(({ term, interest, penalty }) => (
                <div key={term} className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground">{term}</p>
                  <p className="mt-1 text-xs">Interest: {interest}</p>
                  <p className="text-xs">Early withdrawal penalty: {penalty}</p>
                  <p className="mt-1 text-xs text-primary">Automatically renewable · Redeemable on maturity or within 10 days after — no penalty</p>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80"
          alt="Investment planning"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Jumbo CDs */}
      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="Certificates of Deposit" title="Jumbo CDs" />
          <InfoCard title="Jumbo CDs — Minimum to open: $100,000">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Features</p>
                <FeatureList items={[
                  "Automatically renewable",
                  "Terms up to 60 months",
                  "Interest paid quarterly on 1-year and higher terms",
                ]} />
              </div>
              <div>
                <p className="eyebrow mb-2">Early Withdrawal Penalties</p>
                <FeatureList items={[
                  "1-month CD, 3-month CD, 6-month CD → 1 month's interest",
                  "12-month CD, 24-month CD → 3 months' interest",
                  "3-year to 5-year CD → 6 months' interest",
                ]} />
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=800&q=80"
              alt="Financial planning"
              className="mt-6 h-40 w-full rounded-xl object-cover"
            />
          </InfoCard>
        </div>
      </FadeIn>

      {/* IRAs */}
      <FadeIn delay={140}>
        <div className="mb-12">
          <SectionHeading eyebrow="Retirement" title="Individual Retirement Accounts" />
          <InfoCard title="IRA Options — Minimum to open: $1,000 (Variable Rate IRA: $100)">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">We Offer</p>
                <FeatureList items={["Fixed Rate IRAs", "Variable Rate IRAs"]} />
              </div>
              <div>
                <p className="text-muted-foreground">
                  Contact our New Accounts Department for further information on terms, rates, interest payments, and penalties on fixed rate or variable rate IRAs.
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={180}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">View Current Rates</h2>
          <p className="mt-2 text-sm opacity-70">See our competitive rates on CDs, Jumbo CDs, and IRAs.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/rates" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">View Rates</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
