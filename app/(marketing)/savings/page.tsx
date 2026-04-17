import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function SavingsPage() {
  return (
    <ContentPage
      eyebrow="Personal Banking"
      title={<>Personal <em>Savings</em> Accounts</>}
      subtitle="We offer a variety of personal savings accounts. Take a look at our options to find the one that best fits your needs."
      imageUrl="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Savings and financial growth"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Savings Account */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Savings" title="Savings Account" />
          <InfoCard title="Requirements & Fees">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="eyebrow mb-1">Requirements</p>
                  <p className="text-muted-foreground">Minimum deposit of $100.00 to open.</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Service Charge</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>$5.00 monthly charge</li>
                    <li>Waived with $100.00 minimum daily balance</li>
                    <li>Limited to 6 transfers per calendar month</li>
                    <li>$3.00 excessive debit fee after 3 debits/month</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="eyebrow mb-2">Features</p>
                  <FeatureList items={[
                    "Free Internet Banking",
                    "Free Mobile Banking",
                    "Free Online Bill Pay",
                    "Quarterly statements (monthly transcript available with auto deposits/payments)",
                    "Interest compounded daily, credited quarterly",
                    "Daily balance method for interest calculation",
                  ]} />
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80"
          alt="Financial investment"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* CDs */}
      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="Certificates of Deposit" title="Certificate of Deposit" subtitle="A non-negotiable, interest-bearing instrument with which a customer promises to keep funds on deposit for a specified length of time, earning a guaranteed rate of return." />

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <InfoCard title="Regular CDs (Minimum: $1,000)">
              <div className="space-y-4 text-sm text-muted-foreground">
                {[
                  { term: "3-Month CD",     penalty: "1 month's interest", interest: "Paid at term back to CD" },
                  { term: "6-Month CD",     penalty: "1 month's interest", interest: "Paid at term back to CD" },
                  { term: "12–24 Month CD", penalty: "3 months' interest", interest: "Paid quarterly back to CD" },
                  { term: "3–5 Year CD",    penalty: "6 months' interest", interest: "Paid quarterly back to CD" },
                ].map(({ term, penalty, interest }) => (
                  <div key={term} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-foreground">{term}</p>
                    <p className="mt-1 text-xs">Interest: {interest}</p>
                    <p className="text-xs">Early withdrawal penalty: {penalty}</p>
                    <p className="text-xs text-primary">Redeemable on maturity or within 10 days after — no penalty</p>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Jumbo CDs (Minimum: $100,000)">
              <div className="space-y-3 text-sm text-muted-foreground">
                <FeatureList items={[
                  "Automatically renewable",
                  "Terms up to 60 months",
                  "Interest paid quarterly on 1-year and higher",
                  "1-month penalty: 1, 3, or 6-month CDs",
                  "3-month penalty: 12 or 24-month CDs",
                  "6-month penalty: 3–5 year CDs",
                ]} />
                <img
                  src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=800&q=80"
                  alt="Investment planning"
                  className="mt-4 h-36 w-full rounded-xl object-cover"
                />
              </div>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      {/* IRAs */}
      <FadeIn delay={140}>
        <div className="mb-12">
          <SectionHeading eyebrow="Retirement" title="Individual Retirement Accounts" />
          <InfoCard title="IRA Options">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">We Offer</p>
                <FeatureList items={["Fixed Rate IRAs", "Variable Rate IRAs"]} />
              </div>
              <div>
                <p className="text-muted-foreground">
                  Contact our New Accounts Department for further information on terms, rates, interest payments, and penalties on fixed or variable rate IRAs.
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      {/* View Rates CTA */}
      <FadeIn delay={180}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">View Current Rates</h2>
          <p className="mt-2 text-sm opacity-70">See our competitive rates on savings accounts, CDs, Jumbo CDs, and IRAs.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/rates" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90">View Rates</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
