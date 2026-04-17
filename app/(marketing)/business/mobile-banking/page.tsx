import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function BusinessMobileBankingPage() {
  return (
    <ContentPage
      eyebrow="Business Banking"
      title={<>Business <em>Mobile Banking</em></>}
      subtitle="Your mobile cash management solution! Gainsburry Capital Bank's Mobile Business Banking allows you to manage your business finances from almost anywhere your business takes you."
      imageUrl="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Business mobile banking"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Mobile Business Banking" title="Manage Your Business From Anywhere" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Mobile Business Banking Features">
              <FeatureList items={[
                "View account balances",
                "Review transaction history",
                "View check images",
                "Transfer money between accounts",
                "Make approvals (ACH, Transfers, Bill Payments)",
                "Real-time alerts for approvals",
                "Multifactor authentication and secure login",
                "Built-in smartphone biometrics (fingerprint & facial recognition)",
              ]} />
            </InfoCard>

            <InfoCard title="Requirements">
              <FeatureList items={[
                "Have a business account or loan with Gainsburry Capital Bank",
                "Be enrolled for Business Online Banking",
                "Have an Internet-enabled Apple® or Android® mobile phone",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">Message and data rates from your carrier may apply.</p>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1600&q=80"
          alt="Business mobile banking"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Mobile Deposit */}
      <FadeIn delay={100}>
        <div id="deposit" className="mb-12 scroll-mt-24">
          <SectionHeading
            eyebrow="Business Mobile Deposit"
            title="Deposit Checks Without Leaving the Office"
            subtitle="Save time and gas by easily depositing your checks wherever you may be. Mobile Deposit allows you to make secure deposits anytime, anywhere, using supported Apple® and Android™ devices."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="How Mobile Deposit Works">
              <div className="space-y-4 text-sm text-muted-foreground">
                {[
                  "Select the Deposit button/tab in the Business Banking app",
                  "Select Deposit a Check",
                  "Select the account you'd like the check deposited to",
                  "Enter the check amount",
                  "Endorse check: \"For Mobile Deposit Only\"",
                  "Take a clear photo of the front and back of the check",
                  "Submit — you'll receive a confirmation screen with pending status",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Endorsement Requirements">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>For the check to be accepted, the back must be properly endorsed with:</p>
                <FeatureList items={[
                  "Payee's signature (your endorsement)",
                  "The words \"For Mobile Deposit Only\"",
                  "The last four digits of your account number",
                ]} />
                <p className="text-xs">We reserve the right to reject improperly endorsed checks.</p>
              </div>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Download the Business Banking App</h2>
          <p className="mt-2 text-sm opacity-70">Available for iPhone® and Android™. Use your Business Online Banking credentials.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
