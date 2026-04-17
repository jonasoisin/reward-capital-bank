import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function BusinessOnlineBankingPage() {
  return (
    <ContentPage
      eyebrow="Business Banking"
      title={<>Business <em>Online Banking</em></>}
      subtitle="With Gainsburry Capital Bank's Business Online Banking, you can save time, improve your cash flow, and streamline your cash management procedures all in a fully secure environment."
      imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Business online banking"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="Business Online Banking"
            title="Complete Business Banking Control"
            subtitle="This service is available to any bank customer with a business account. Businesses can also grant full or limited use of Business Online Banking to their employees."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Business Online Banking Features">
              <FeatureList items={[
                "24-hour access to your accounts",
                "View real-time account balances",
                "View check images and detailed transaction history",
                "View and print your statements",
                "Export transaction history",
                "Make loan payments",
                "Transfer funds between accounts",
                "Pay Bills Online",
                "Initiate stop payments",
                "Make deposits from your office with Remote Deposit Capture",
                "Submit payroll files or collect payments with ACH Origination",
                "QuickBooks Financial Software compatible",
              ]} />
            </InfoCard>

            <div className="space-y-6">
              <InfoCard title="e-Statements — Features Include" >
                <div id="estatements" className="scroll-mt-24">
                  <FeatureList items={[
                    "Fast, easy and secure",
                    "View, download and print at your convenience",
                    "Receive your statements earlier than paper mail",
                    "Lower exposure to identity theft",
                    "Environmentally friendly",
                    "FREE images and FREE Bill Pay with enrollment!",
                  ]} />
                </div>
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80"
                alt="Business dashboard"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80"
          alt="Business team banking"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="Also Available" title="Expand Your Business Banking" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Business Bill Pay",       href: "/business/bill-pay",       desc: "Pay vendors and suppliers from one convenient location." },
              { label: "ACH Origination",          href: "/business/ach-origination",desc: "Automate payroll and business-to-business payments." },
              { label: "Remote Deposit Capture",   href: "/business/remote-deposit", desc: "Deposit checks from your office without a branch visit." },
            ].map(({ label, href, desc }) => (
              <Link key={label} href={href} className="rounded-xl border border-border bg-card p-5 transition hover:border-primary">
                <p className="font-medium text-foreground">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Get Started with Business Online Banking</h2>
          <p className="mt-2 text-sm opacity-70">Already a business customer? Sign in. Need an account? Open one today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In</Link>
            <Link href="/open-account" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Open an Account</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
