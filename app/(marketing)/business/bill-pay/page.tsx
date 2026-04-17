import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function BusinessBillPayPage() {
  return (
    <ContentPage
      eyebrow="Business Banking"
      title={<>Business <em>Bill Pay</em></>}
      subtitle="Business Bill Pay is essential for small business success. Take control and put more time back in your day."
      imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Business bill payment"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="Business Bill Pay"
            title="Organize, Schedule & Pay from One Place"
            subtitle="Business Bill Pay gives you more control over organizing, scheduling, paying and even receiving your bills from one convenient location."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Business Bill Pay Features">
              <FeatureList items={[
                "Pay bills directly from your Business Online Banking account",
                "No more writing checks or payments getting lost in the mail",
                "Pay all your bills in one place with one password",
                "Ease of use — just click who to pay, enter a few bill details and select a payment date",
                "Schedule one-time and recurring payments in advance",
                "Receive your bills electronically with eBill",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <InfoCard title="Why Business Bill Pay?">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Managing business payments takes time. Bill Pay centralizes all your payables so you can focus on running your business, not chasing checks.</p>
                  <p>Schedule payments days or weeks in advance, set up recurring bills, and keep a full digital record of every payment.</p>
                </div>
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                alt="Business finance"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1600&q=80"
          alt="Business payment processing"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Save Time on Bill Payments?</h2>
          <p className="mt-2 text-sm opacity-70">For more information on Business Bill Pay, contact us during regular banking hours. We are ready to help!</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
