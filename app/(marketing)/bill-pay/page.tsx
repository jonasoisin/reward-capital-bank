import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function BillPayPage() {
  return (
    <ContentPage
      eyebrow="Digital Solutions"
      title={<>Bill Pay <em>&amp; Zelle®</em></>}
      subtitle="Bill Pay and Zelle® make paying your bills, sending, requesting and receiving money easy and hassle free."
      imageUrl="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Bill payment and digital banking"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Bill Pay */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Bill Pay" title="Pay All Your Bills in One Place" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Bill Pay Features">
              <FeatureList items={[
                "Pay bills directly from your online banking account",
                "No more writing checks or payments getting lost in the mail",
                "Pay all your bills in one place with one password",
                "Just click who to pay, enter a few bill details and select a payment date",
                "Schedule one-time and recurring payments in advance",
                "Pay bills with our Mobile and Tablet Banking apps",
                "Digitize paper bills with Bill Capture",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
                alt="Bill payment"
                className="h-44 w-full rounded-2xl object-cover"
              />
              <InfoCard title="Get Started">
                <p className="text-sm text-muted-foreground">Bill Pay is available at no extra charge through your Personal Online Banking account. Sign in or open an account to get started.</p>
              </InfoCard>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80"
          alt="Digital payments"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Zelle */}
      <FadeIn delay={100}>
        <div id="zelle" className="mb-12 scroll-mt-24">
          <SectionHeading
            eyebrow="Zelle®"
            title="Send Money Fast with Zelle®"
            subtitle="The Zelle® personal payment service lets you send, request and receive money to or from friends, family or just about anyone, online or through your mobile device."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Zelle® is the Fast and Easy Way To">
              <FeatureList items={[
                "Send money securely to anyone with a bank account",
                "Request money in a snap",
                "Split an expense or collect from groups",
              ]} />
            </InfoCard>

            <InfoCard title="Common Uses for Zelle®">
              <FeatureList items={[
                "Repay a friend for your portion of a dinner bill",
                "Send money to your child at college",
                "Send a gift to family and friends",
                "Send rent to your landlord or roommates",
              ]} />
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Start Using Bill Pay &amp; Zelle®</h2>
          <p className="mt-2 text-sm opacity-70">Available through your Online Banking and Mobile Banking accounts.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
