import { ContentPage, SectionHeading, InfoCard, FeatureList, RateTable } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function BusinessCheckingPage() {
  return (
    <ContentPage
      eyebrow="Business Banking"
      title={<>Business <em>Accounts</em></>}
      subtitle="We offer a variety of business accounts to fit your banking needs. Our New Accounts representatives are ready to help."
      imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Business banking"
      ctaHref="/open-account"
      ctaLabel="Apply Now"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Comparison table */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Compare" title="Business Checking Accounts" />
          <RateTable
            headers={["Account Type", "Interest", "Monthly Fee", "Key Features"]}
            rows={[
              ["Economy Business",   "No",  "$20.00", "Waived with 150 or fewer transactions/month · e-Statements · Debit card · Online banking"],
              ["Regal Business",     "No",  "$20.00", "Waived with $10,000 avg monthly balance or $35,000 combined · 400 items free/month"],
              ["Business Money Market", "Yes", "$20.00", "Waived with $2,500 daily balance · 6 transfers/month limit"],
            ]}
            note="For more information or to open an account, please contact us today. Our New Accounts representatives are ready to help!"
          />
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
            alt="Business meeting" className="h-56 w-full rounded-2xl object-cover" />
          <img src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=800&q=80"
            alt="Business banking" className="h-56 w-full rounded-2xl object-cover" />
        </div>
      </FadeIn>

      {/* Account details */}
      <FadeIn delay={100}>
        <div className="mb-12 space-y-6">
          <SectionHeading eyebrow="Account Details" title="Business Checking Options" />

          <InfoCard title="Economy Business Checking">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="eyebrow mb-1">Requirements</p>
                  <p className="text-muted-foreground">$100.00 minimum balance to open.</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Monthly Maintenance Fee</p>
                  <p className="text-muted-foreground">$20.00 per month — waived with 150 or fewer transactions per month (total debits + credits).</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">Features</p>
                <FeatureList items={[
                  "Free e-Statements",
                  "Free Online Banking",
                  "Business Debit Card (first card free per account signer; $5.00 fee for employee cards or reorders)",
                  "One safe deposit box rental free for one year (Main Branch in Schertz and Kirby Branch only)",
                ]} />
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Regal Business Checking">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="eyebrow mb-1">Requirements</p>
                  <p className="text-muted-foreground">$100.00 minimum balance to open.</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Monthly Maintenance Fee</p>
                  <p className="text-muted-foreground">$20.00 per month — waived with an average monthly balance of $10,000.00, or $35,000.00 average monthly balance when combined with a personal checking balance.</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">Features</p>
                <FeatureList items={[
                  "400 items free per month (debits and credits), then $0.25 per item",
                  "e-Statements only",
                  "First order of Value Pack checks free (150 single/duplicate safety checks, premier binder, 100 duplicate deposit slips, endorsement stamp)",
                  "Business Debit Card (first card free per signer; $5.00 fee for employee cards or reorders)",
                  "One safe deposit box rental free for one year, then 35% off normal rates",
                ]} />
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Business Money Market Checking">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="eyebrow mb-1">Requirements</p>
                  <p className="text-muted-foreground">$100.00 minimum balance to open.</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Service Charge</p>
                  <p className="text-muted-foreground">$20.00 monthly — waived with a minimum daily balance of $2,500.00. $5.00 excessive debit fee per debit in excess of 6 per month. Limited to 6 transfers per calendar month.</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">Features</p>
                <FeatureList items={[
                  "Interest-bearing account",
                  "Rate and APY determined at our discretion",
                  "Interest compounded monthly and credited each statement cycle",
                  "Daily balance method for interest calculation",
                ]} />
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      {/* Business Savings */}
      <FadeIn delay={140}>
        <div id="savings" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Business Savings" title="Business Savings Account" />
          <InfoCard title="Business Savings Account">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="eyebrow mb-1">Requirements</p>
                  <p className="text-muted-foreground">$100.00 minimum balance to open.</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Service Charge</p>
                  <p className="text-muted-foreground">$7.00 monthly fee if balance falls below $100.00 any day of the calendar month. $3.00 excessive withdrawal fee for each withdrawal in excess of 3 per month. Transfers limited to 6 per month.</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">Features</p>
                <FeatureList items={[
                  "Interest-bearing account",
                  "Interest compounded daily and credited each statement cycle",
                  "Daily balance method for interest calculation",
                  "Interest begins to accrue on business day of non-cash deposit",
                ]} />
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      {/* Other Products */}
      <FadeIn delay={160}>
        <div className="mb-12">
          <SectionHeading eyebrow="Also Available" title="Other Products & Services" subtitle="Once you open a business account with Gainsburry Capital Bank, you may also be interested in:" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Merchant Services", href: "/business/merchant-services" },
              { label: "ACH Origination",   href: "/business/ach-origination" },
              { label: "Business Loans",    href: "/loans#commercial" },
              { label: "Online Banking",    href: "/business/online-banking" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary">
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={180}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Open a Business Account?</h2>
          <p className="mt-2 text-sm opacity-70">Our New Accounts representatives are ready to help you find the right account for your business.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/open-account" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Apply Now</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
