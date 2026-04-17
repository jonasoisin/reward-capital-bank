import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function eStatementsPage() {
  return (
    <ContentPage
      eyebrow="Digital Solutions"
      title={<><em>e-Statements</em></>}
      subtitle="Go paperless with e-Statements. Fast, easy and secure — access your statements anytime, anywhere."
      imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Digital statements on tablet"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="e-Statements" title="Go Paperless" subtitle="With e-Statements, your monthly account statements are delivered securely to your Online Banking portal instead of your mailbox." />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Features Include">
              <FeatureList items={[
                "Fast, easy and secure",
                "View, download and print at your convenience",
                "Receive your statements earlier than paper mail",
                "Lower exposure to identity theft",
                "Environmentally friendly",
                "FREE check images included",
                "FREE Bill Pay with enrollment!",
              ]} />
            </InfoCard>

            <InfoCard title="How to Enroll">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                  <div>
                    <p className="font-medium text-foreground">Sign in to Online Banking</p>
                    <p>Log in at our website or through the mobile app.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                  <div>
                    <p className="font-medium text-foreground">Go to Account Settings</p>
                    <p>Navigate to Statements & Documents in your profile.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                  <div>
                    <p className="font-medium text-foreground">Opt in to e-Statements</p>
                    <p>Select your preferred accounts and confirm enrollment.</p>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
          alt="Digital banking paperless"
          className="mb-12 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Go Paperless?</h2>
          <p className="mt-2 text-sm opacity-70">Sign in to your Online Banking account to enroll in e-Statements today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Sign In to Enroll</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
