import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function RemoteDepositPage() {
  return (
    <ContentPage
      eyebrow="Business Banking"
      title={<>Remote Deposit <em>Capture</em></>}
      subtitle="Discover the convenience of making deposits from your office anytime with Remote Deposit Capture. Simply scan your checks and they will be transmitted to Gainsburry Capital Bank for deposit into your business account."
      imageUrl="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Remote deposit scanning"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="Merchant Deposit Capture"
            title="Deposit Without Leaving Your Office"
            subtitle="Remote Deposit Capture (also called Merchant Deposit Capture) lets you scan checks and transmit them electronically for same-day deposit processing."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Merchant Deposit Capture Features">
              <FeatureList items={[
                "Make deposits anytime — no branch visit required",
                "Save time and money on transportation costs",
                "Manage your account more efficiently",
                "Improve profitability with faster deposit processing",
                "Consolidate deposits from multiple business locations",
                "Reduce the risk of check fraud",
                "Safe and secure transmission",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <InfoCard title="Who Benefits Most?">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Remote Deposit Capture is ideal for businesses that:</p>
                  <FeatureList items={[
                    "Receive a high volume of paper checks",
                    "Have multiple locations or remote employees",
                    "Want to reduce bank trips and armored car costs",
                    "Need faster access to deposited funds",
                  ]} />
                </div>
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                alt="Business office"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80"
          alt="Business scanning documents"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Interested in Remote Deposit Capture?</h2>
          <p className="mt-2 text-sm opacity-70">Contact us to learn how to set up Remote Deposit Capture for your business.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Contact Us</Link>
            <Link href="/business/online-banking" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Business Online Banking</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
