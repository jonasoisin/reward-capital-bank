import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function MobileBankingPage() {
  return (
    <ContentPage
      eyebrow="Digital Solutions"
      title={<>Mobile Banking <em>&amp; Mobile Deposit</em></>}
      subtitle="Take us wherever you are with our Mobile Banking app! Optimized for iOS and Android devices and available 24/7 using your existing Online Banking credentials."
      imageUrl="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Mobile banking on smartphone"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Mobile Banking Features */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Mobile Banking" title="Banking On the Go" subtitle="Our Mobile Banking app is the ultimate in on-demand service. First time user? No problem — enroll directly on our Mobile app using your smartphone." />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="With Mobile Banking You Can">
              <FeatureList items={[
                "Check your account balances",
                "View recent transactions",
                "View images of cleared checks and deposit slips",
                "Transfer money between your accounts",
                "Pay Bills",
                "Deposit Checks (restrictions apply)",
                "Find ATMs and branch locations",
                "Manage your debit cards at the touch of a button",
                "Use Instant Balance to view balance without logging in",
                "Login using your fingerprint or facial recognition",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <InfoCard title="Security">
                <p className="text-sm text-muted-foreground">
                  Your security is our priority — Mobile data transmissions are safeguarded by 128-bit SSL (Secure Socket Layer) to prevent unauthorized access. We will never transmit your account number, and no personal or financial data is stored on your phone or tablet.
                </p>
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80"
                alt="Smartphone banking"
                className="h-44 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1600&q=80"
          alt="Mobile banking experience"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Mobile Deposit */}
      <FadeIn delay={100} >
        <div id="mobile-deposit" className="mb-12 scroll-mt-24">
          <SectionHeading
            eyebrow="Mobile Deposit"
            title="Deposit Checks From Anywhere"
            subtitle="Save time and gas by easily depositing your checks wherever you may be. Mobile Deposit allows you to make secure deposits anytime, anywhere, using supported Apple® and Android™ devices."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="How Mobile Deposit Works">
              <div className="space-y-4 text-sm text-muted-foreground">
                {[
                  "Select the Deposit button/tab in the app",
                  "Select Deposit a Check",
                  "Select the account you'd like the check deposited to",
                  "Enter the check amount",
                  "Endorse the check: \"For Mobile Deposit Only\"",
                  "Take a photo of the front and back of the check",
                  "Submit — you'll receive a confirmation screen with pending status",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Tips for Best Results">
              <FeatureList items={[
                "Place check on a dark, plain, well-lit surface",
                "Position camera directly above the check (not at an angle)",
                "Fit all four corners within the camera guides",
                "Endorse with your signature, \"For Mobile Deposit Only\", and the last 4 digits of your account number",
              ]} />
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Download the App Today</h2>
          <p className="mt-2 text-sm opacity-70">Available for iPhone® and Android™ devices. Use your existing Online Banking credentials.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/open-account" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Open an Account</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
