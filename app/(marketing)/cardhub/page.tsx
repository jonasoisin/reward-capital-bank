import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function CardHubPage() {
  return (
    <ContentPage
      eyebrow="Digital Solutions"
      title={<>Card<em>Hub®</em></>}
      subtitle="Your card, your way. Control your debit card usage, and stay informed about your debit card activity with CardHub®."
      imageUrl="https://images.unsplash.com/photo-1548613053-22087dd8edb8?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Debit card management"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="CardHub®"
            title="Full Control Over Your Debit Card"
            subtitle="CardHub® is an easy to use app for your iPhone® or Android™ phone with powerful tools that allow you to control your debit card usage and stay informed of any suspicious activity."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="CardHub® Features">
              <FeatureList items={[
                "Turn your debit card on or off instantly",
                "Establish transaction controls for dollar amount limits",
                "Restrict by merchant categories and geographic locations",
                "Receive real-time alerts when your debit card is used or approved",
                "Alerts when your card exceeds transaction controls you've set",
                "Stay informed of potential fraud with declined transaction alerts",
                "Get updated balances for your accounts",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <InfoCard title="Get Started Today">
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Download the CardHub® app for your Apple iPhone® or Android™ phone.",
                    "Read and accept the terms and conditions of use.",
                    "Add your cards to the CardHub® App — you will be asked to enter your card information and validate your identity during registration.",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80"
                alt="Card management on phone"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80"
          alt="Credit and debit card"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Download CardHub® Today</h2>
          <p className="mt-2 text-sm opacity-70">Available for iPhone® and Android™. Take control of your debit card security.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
