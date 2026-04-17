import { ContentPage, SectionHeading, RateTable, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const INCLUDED = [
  "Free Internet Banking",
  "Free Mobile Banking",
  "Free Online Bill Pay",
  "Free Debit Card",
];

const COMPARISON_ROWS = [
  ["Advantage Checking",             "No",  "$8.00 / $10.00",  "$30,000 AD&D Insurance · 1 free box of checks/year"],
  ["Classic Advantage (age 62+)",    "No",  "$3.00 / $5.00",   "Combined Classic + Advantage features"],
  ["Basic Checking",                 "No",  "$5.00 / $7.00",   "Waivable with $15,000 deposit relationship"],
  ["Classic Checking (age 62+)",     "No",  "None",            "1 free box of checks/year · Discounted additional boxes"],
  ["Money Market Checking",          "Yes", "$8.00 / $10.00",  "Waivable with $2,500 daily balance"],
];

const accounts = [
  {
    id: "advantage",
    name: "Advantage Checking",
    req: "Deposit $100.00 to open",
    charge: "$8.00 e-statements · $10.00 paper statements",
    features: [
      "Unlimited check writing — no per-check fee",
      "First debit card free; auto-replacement at no fee",
      "No ATM fee at our ATMs",
      "One box of Advantage Checks per calendar year",
      "$30,000 AD&D Insurance (split among account signers)",
      "$100,000 AD&D Common Carrier Insurance",
      "Total Identity Monitoring (free enrollment)",
      "Vision Care Savings — save 10%–60%",
      "Shopping, Travel & Entertainment Discounts — up to 50% off",
      "Life Steps Living Family Journal estate organizer",
    ],
  },
  {
    id: "basic",
    name: "Basic Checking",
    req: "Deposit $100.00 to open",
    charge: "$5.00 e-statements · $7.00 paper statements (waived with $500 daily balance or $15,000 deposit relationship)",
    features: [
      "Unlimited check writing — no per-check fee",
      "First debit card free; auto-replacement at no fee",
      "No ATM fee at our ATMs",
    ],
  },
  {
    id: "classic",
    name: "Classic Checking",
    req: "Age 62 or older · Deposit $100.00 to open",
    charge: "No monthly service charge",
    features: [
      "Unlimited check writing — no per-check fee",
      "First debit card free; auto-replacement at no fee",
      "No ATM fee at our ATMs",
      "One free box of Classic checks per calendar year · Discounted additional boxes",
    ],
  },
  {
    id: "money-market",
    name: "Money Market Checking",
    req: "Deposit $100.00 to open",
    charge: "$8.00 e-statements · $10.00 paper (waived with $2,500 daily balance) · 6 transfers per month limit · $5.00 excess debit fee",
    features: [
      "Interest-bearing — rate set at our discretion",
      "Interest compounded monthly and credited monthly",
      "Daily balance method used to calculate interest",
      "First debit card free; auto-replacement at no fee",
      "No ATM fee at our ATMs",
    ],
  },
];

export default function CheckingPage() {
  return (
    <ContentPage
      eyebrow="Personal Banking"
      title={<>Personal <em>Checking</em> Accounts</>}
      subtitle="We offer a variety of personal checking accounts to fit your banking needs."
      imageUrl="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Debit card and banking"
      ctaHref="/open-account"
      ctaLabel="Apply Now"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Included in all */}
      <FadeIn>
        <div className="mb-16 rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">All Personal Checking Accounts Include:</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Comparison table */}
      <FadeIn delay={80}>
        <div className="mb-16">
          <SectionHeading eyebrow="Compare" title="Personal Checking Accounts" />
          <RateTable
            headers={["Account Type", "Interest", "Monthly Fee (e / paper)", "Key Features"]}
            rows={COMPARISON_ROWS}
            note="For more information or to open an account, please contact us. Our New Accounts representatives are ready to help."
          />
        </div>
      </FadeIn>

      {/* Images */}
      <FadeIn delay={120}>
        <div className="mb-16 grid gap-6 sm:grid-cols-2">
          <img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80"
            alt="Banking services" className="h-56 w-full rounded-2xl object-cover" />
          <img src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=800&q=80"
            alt="Mobile banking" className="h-56 w-full rounded-2xl object-cover" />
        </div>
      </FadeIn>

      {/* Account details */}
      <div className="space-y-8">
        {accounts.map((acct, i) => (
          <FadeIn key={acct.id} delay={i * 60}>
            <InfoCard title={acct.name}>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="eyebrow mb-1">Requirements</p>
                  <p className="text-muted-foreground">{acct.req}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Service Charge</p>
                  <p className="text-muted-foreground">{acct.charge}</p>
                </div>
                <div>
                  <p className="eyebrow mb-2">Features</p>
                  <FeatureList items={acct.features} />
                </div>
              </div>
            </InfoCard>
          </FadeIn>
        ))}
      </div>

      {/* CTA */}
      <FadeIn delay={240}>
        <div className="mt-12 rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to open your account?</h2>
          <p className="mt-2 text-sm opacity-70">Our New Accounts representatives are ready to help.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/open-account" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Apply Now</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
