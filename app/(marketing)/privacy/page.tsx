import { ContentPage, SectionHeading, InfoCard } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Resources & Tools"
      title={<>Security <em>&amp; Privacy</em></>}
      subtitle="Your security is our highest priority. Learn how Gainsburry Capital Bank protects your personal and financial information."
      imageUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Digital security"
    >
      {/* Security Features */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Security" title="How We Protect You" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Lock,         title: "128-bit Encryption",    desc: "All online sessions are secured with SSL encryption — the banking industry standard." },
              { icon: Shield,       title: "FDIC Insured",          desc: "Deposits are insured up to allowable limits by the Federal Deposit Insurance Corporation." },
              { icon: Eye,          title: "Fraud Monitoring",      desc: "Real-time 24/7 monitoring detects and alerts you to suspicious account activity." },
              { icon: AlertTriangle,title: "Zero Liability",        desc: "You are not responsible for unauthorized debit card transactions when reported promptly." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <Icon className="h-6 w-6 text-primary mb-3" />
                <p className="font-semibold text-sm text-foreground">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Privacy Policy */}
      <FadeIn delay={80}>
        <div className="mb-12">
          <SectionHeading eyebrow="Privacy Policy" title="Your Information. Your Rights." />
          <div className="space-y-4">
            {[
              {
                title: "Information We Collect",
                body: "We collect information you provide when opening accounts, applying for loans, or using our services — including name, address, Social Security Number, income, and account activity. We also collect technical data from your use of our websites and mobile app.",
              },
              {
                title: "How We Use Your Information",
                body: "We use your information to process transactions, service your accounts, comply with legal requirements, prevent fraud, and communicate with you about your accounts and our services.",
              },
              {
                title: "Information Sharing",
                body: "We do not sell your personal information. We may share information with service providers who help us operate our business, and as required by law. You have the right to limit certain types of sharing — contact us for your options.",
              },
              {
                title: "Your Choices",
                body: "You can opt out of certain marketing communications at any time. To limit information sharing for marketing purposes, contact us by phone at (210) 658-1661 or visit any branch.",
              },
              {
                title: "Data Retention",
                body: "We retain your information for as long as your account is active and for additional periods as required by law or regulation.",
              },
            ].map(({ title, body }) => (
              <InfoCard key={title} title={title}>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </InfoCard>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Tips */}
      <FadeIn delay={120}>
        <div className="mb-12">
          <SectionHeading eyebrow="Stay Safe" title="Tips to Protect Yourself" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Never share your PIN, password, or full account number via email, text, or phone.",
              "Gainsburry will never call or email you asking for your full password or Social Security Number.",
              "Use a strong, unique password for Online Banking and change it regularly.",
              "Enable account alerts in your Online Banking to monitor activity in real time.",
              "Always log out of Online Banking when using a shared or public computer.",
              "Review your account statements regularly and report any discrepancies immediately.",
              "Be cautious of phishing emails that mimic bank communications. Check the sender address carefully.",
              "Keep your contact information up to date so we can reach you if we detect suspicious activity.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Report Suspicious Activity</h2>
          <p className="mt-2 text-sm opacity-70">If you notice anything unusual on your account, contact us immediately.</p>
          <div className="mt-6">
            <a href="tel:+12106581661" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors inline-block">
              Call (210) 658-1661
            </a>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
