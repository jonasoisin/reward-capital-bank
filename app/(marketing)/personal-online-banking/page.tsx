import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function PersonalOnlineBankingPage() {
  return (
    <ContentPage
      eyebrow="Digital Solutions"
      title={<>Personal <em>Online Banking</em></>}
      subtitle="With Gainsburry Capital Bank's Personal Online Banking service, you can enjoy a simple, convenient and secure way to manage your money — anytime of the day or night."
      imageUrl="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Online banking on laptop"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Features */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Online Banking" title="Everything You Need in One Place" subtitle="Online Banking delivers a highly intuitive user interface, responsive screens and great tools that simplify your financial life." />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Online Banking Features">
              <FeatureList items={[
                "24-hour access to all your personal accounts",
                "View real-time account balances",
                "View check images and detailed transaction history",
                "View and print your statements",
                "Export transaction history",
                "Make loan payments",
                "Transfer funds between accounts",
                "Pay bills online",
                "128-bit encryption for optimum security",
                "QuickBooks & Quicken compatible",
              ]} />
            </InfoCard>

            <InfoCard title="e-Statements — Features Include">
              <FeatureList items={[
                "Fast, easy and secure",
                "View, download and print at your convenience",
                "Receive your statements earlier than paper mail",
                "Lower exposure to identity theft",
                "Environmentally friendly",
                "FREE images and FREE Bill Pay with enrollment!",
              ]} />
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80"
            alt="Banking on laptop"
            className="h-56 w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            alt="Financial dashboard"
            className="h-56 w-full rounded-2xl object-cover"
          />
        </div>
      </FadeIn>

      {/* Security */}
      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="Security" title="Your Security is Our Priority" />
          <InfoCard title="How We Protect You">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Encryption</p>
                <p className="text-muted-foreground">All online banking sessions are protected with 128-bit SSL encryption — the same standard used by major financial institutions worldwide.</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Access Control</p>
                <p className="text-muted-foreground">Multi-factor authentication, automatic session timeouts, and real-time fraud monitoring keep your account safe around the clock.</p>
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Get Started with Online Banking</h2>
          <p className="mt-2 text-sm opacity-70">Already a customer? Sign in. New to Gainsburry? Open an account today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/open-account" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Open an Account</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
