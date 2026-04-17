import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function DebitCardsPage() {
  return (
    <ContentPage
      eyebrow="Other Services"
      title={<>Debit <em>Cards</em></>}
      subtitle="Your Gainsburry Capital Bank Debit Card gives you the convenience of a credit card with the discipline of using your own money. Shop in-store, online, and withdraw cash at any of our ATMs."
      imageUrl="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Debit card"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Debit Card" title="Convenience at Every Swipe" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Debit Card Features">
              <FeatureList items={[
                "Free with all personal checking accounts",
                "Use anywhere Mastercard® or Visa® is accepted",
                "No ATM fee at our ATMs",
                "First debit card is free for each account signer",
                "Automatic replacement at no fee during expiration month",
                "Manage your card instantly through CardHub®",
                "Real-time transaction alerts",
                "Freeze or unfreeze your card at any time",
              ]} />
            </InfoCard>

            <InfoCard title="Debit Card Security">
              <FeatureList items={[
                "EMV chip technology for in-store purchases",
                "128-bit encryption for online transactions",
                "Zero liability on unauthorized transactions",
                "Real-time fraud monitoring 24/7",
                "Instant card controls via CardHub® app",
                "Set geographic and merchant category restrictions",
              ]} />
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1548613053-22087dd8edb8?auto=format&fit=crop&w=1600&q=80"
          alt="Debit card payment"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="CardHub®" title="Manage Your Card Digitally" subtitle="Download CardHub® to control your debit card usage and stay informed about your account activity in real time." />
          <InfoCard title="CardHub® Features">
            <div className="grid gap-6 md:grid-cols-2">
              <FeatureList items={[
                "Turn your debit card on or off instantly",
                "Set spending limits by dollar amount",
                "Restrict by merchant category (e.g., gambling, entertainment)",
              ]} />
              <FeatureList items={[
                "Get real-time alerts on all transactions",
                "Receive alerts on declined or suspicious activity",
                "View account balances at a glance",
              ]} />
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Get Your Debit Card Today</h2>
          <p className="mt-2 text-sm opacity-70">Debit cards are included with all personal checking accounts. Open an account to get started.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/open-account" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Open an Account</Link>
            <Link href="/cardhub" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Learn About CardHub®</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
