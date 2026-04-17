import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function CreditCardsPage() {
  return (
    <ContentPage
      eyebrow="Other Services"
      title={<>Credit <em>Cards</em></>}
      subtitle="We make it easy to choose the credit card that is right for you — Low Rate or Preferred Points Rewards. It's the only card you need for everything you need to do."
      imageUrl="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Credit cards"
      ctaHref="/open-account"
      ctaLabel="Apply Now"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Personal Cards */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Personal" title="Personal Credit Cards" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Low Rate Card">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="eyebrow mb-2">MasterCard® Benefits Include</p>
                  <FeatureList items={[
                    "Concierge Service",
                    "Price Protection",
                    "Baggage Delay Insurance",
                    "Car Rental Collision Damage Waiver Insurance",
                    "Extended Warranty",
                    "Travel Assistance & Roadside Assistance",
                    "Purchase Assurance",
                    "Travel Accident Insurance",
                  ]} />
                </div>
                <div>
                  <p className="eyebrow mb-2">Features</p>
                  <FeatureList items={[
                    "No annual fee",
                    "Low introductory rate for the first six months",
                    "Competitive ongoing APR",
                    "25-day interest-free grace period on all purchases",
                    "No grace period on cash advances",
                    "Same APR for purchases and cash advances",
                  ]} />
                </div>
                <div>
                  <p className="eyebrow mb-2">Benefits</p>
                  <FeatureList items={[
                    "24-hour toll-free live customer assistance at 800-367-7576",
                    "Online account information available 24/7",
                    "Rental car collision damage waiver protection",
                  ]} />
                </div>
              </div>
            </InfoCard>

            <InfoCard title="World Card — Points Rewards">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="eyebrow mb-2">Features</p>
                  <FeatureList items={[
                    "Earn 1 point for each dollar spent (up to 10,000 points/month)",
                    "Low introductory rate for first six months",
                    "Competitive ongoing APR",
                    "No annual fee",
                    "25-day interest-free grace period on all purchases",
                  ]} />
                </div>
                <div>
                  <p className="eyebrow mb-2">Rewards Redemption</p>
                  <FeatureList items={[
                    "Cash-back awards",
                    "Retail gift cards",
                    "Travel rewards",
                    "Electronics, cameras, sporting equipment and more",
                  ]} />
                </div>
                <p className="text-xs text-muted-foreground">To view or redeem rewards points, visit mypreferredpoints.com or call 866-678-5191.</p>
              </div>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
          alt="Credit card payments"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Business Cards */}
      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="Business" title="Business Credit Cards" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Standard Business Card">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="eyebrow mb-2">MasterCard® Benefits</p>
                  <FeatureList items={[
                    "Car Rental Collision Damage Waiver",
                    "Extended Warranty & Purchase Protection",
                    "Travel Accident Insurance & Travel Assistance",
                    "Roadside Assistance",
                    "Baggage Delay Insurance",
                  ]} />
                </div>
                <div>
                  <p className="eyebrow mb-2">Features</p>
                  <FeatureList items={[
                    "No annual fee",
                    "Competitive ongoing APR",
                    "25-day interest-free grace period on purchases",
                    "Individual and summary billing options",
                  ]} />
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Preferred Points Rewards — Business">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="eyebrow mb-2">Features</p>
                  <FeatureList items={[
                    "Earn 1 reward point per dollar spent (up to 10,000/month)",
                    "Low annual fee of $49.00 per account",
                    "Competitive ongoing APR",
                    "25-day interest-free grace period on purchases",
                    "Individual billing option",
                  ]} />
                </div>
                <div>
                  <p className="eyebrow mb-2">Rewards</p>
                  <FeatureList items={[
                    "Cash-back, gift cards, travel, merchandise and more",
                    "Visit mypreferredpoints.com to redeem",
                  ]} />
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      {/* How to Apply */}
      <FadeIn delay={140}>
        <div className="mb-12">
          <SectionHeading eyebrow="Apply" title="How to Apply" />
          <InfoCard title="Application Instructions">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Personal Cards</p>
                <div className="space-y-3 text-muted-foreground">
                  <p>1. Download the Personal Credit Card Application PDF.</p>
                  <p>2. Complete and print the application (cannot save digitally — print an extra copy for yourself).</p>
                  <p>3. Fax to Card Service Center: <strong className="text-foreground">877-809-9162</strong></p>
                  <p className="text-xs">Or mail to: Card Service Center, PO Box 569120, Dallas, TX 75356-9120</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">Business Cards</p>
                <div className="space-y-3 text-muted-foreground">
                  <p>1. Download the Business Credit Card Application PDF.</p>
                  <p>2. Complete and print the application.</p>
                  <p>3. Fax to Card Service Center: <strong className="text-foreground">877-809-9162</strong></p>
                  <p className="text-xs">Or mail to: Card Service Center, PO Box 569120, Dallas, TX 75356-9120</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Other fees may be charged. Please see application for information about current APRs and fees. Certain restrictions apply.</p>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={180}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Apply?</h2>
          <p className="mt-2 text-sm opacity-70">Contact us today and our team will guide you through the application process.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/open-account" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Apply Now</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
