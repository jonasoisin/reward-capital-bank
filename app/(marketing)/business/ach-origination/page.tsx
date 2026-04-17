import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function AchOriginationPage() {
  return (
    <ContentPage
      eyebrow="Business Banking"
      title={<>ACH <em>Origination</em></>}
      subtitle="Streamline and automate your payroll with ACH Origination. This is an easy and cost-effective way to make payroll disbursements via direct deposit and make and collect business-to-business payments."
      imageUrl="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Payroll and ACH processing"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="ACH Origination"
            title="Automate Payroll & Business Payments"
            subtitle="ACH Origination lets you submit payroll files and collect business-to-business payments electronically — directly through Business Online Banking."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="ACH Origination Features">
              <FeatureList items={[
                "Eliminate excessive check writing and handling costs",
                "Reduce account reconciliation time",
                "Eliminate expensive stop payment fees due to lost checks",
                "Reduce fraud exposure from lost or stolen checks",
                "More accurate cash flow projections",
                "Collect payments electronically from customers",
                "Use your own software or ours to create files",
                "Easily submit files from within Business Online Banking",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <InfoCard title="Common Use Cases">
                <FeatureList items={[
                  "Employee payroll direct deposits",
                  "Vendor and supplier payments",
                  "Customer payment collection (e.g., subscriptions)",
                  "Business-to-business invoice settlement",
                  "Tax payments",
                ]} />
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Business payroll"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80"
          alt="Business team finance"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Automate Your Payments?</h2>
          <p className="mt-2 text-sm opacity-70">Contact us to learn more about setting up ACH Origination for your business.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Contact Us</Link>
            <Link href="/business/online-banking" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Business Online Banking</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
