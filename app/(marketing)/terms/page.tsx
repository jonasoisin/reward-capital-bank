import { ContentPage, SectionHeading, InfoCard } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Resources & Tools"
      title={<>Website <em>Terms of Use</em></>}
      subtitle="Please read these terms carefully before using the Gainsburry Capital Bank website or digital services."
      imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Legal documents"
    >
      <FadeIn>
        <p className="mb-10 text-sm text-muted-foreground">
          Last updated: January 1, 2024. By accessing this website, you agree to be bound by these Terms of Use and all applicable laws and regulations.
        </p>
      </FadeIn>

      <div className="space-y-6">
        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing and using the Gainsburry Capital Bank website and digital services, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website or services.",
          },
          {
            title: "2. Use of Website",
            body: "This website is provided for informational and banking service purposes only. You agree to use it lawfully and not to: (a) transmit any material that is unlawful, harmful, or offensive; (b) attempt to gain unauthorized access to any systems or data; (c) use the website in any way that could impair its functionality or interfere with others' use.",
          },
          {
            title: "3. Online Banking Terms",
            body: "Use of Personal Online Banking and Business Online Banking is governed by your account agreement and the Electronic Fund Transfers Act and Regulation E. By enrolling in online services, you agree to receive electronic disclosures and statements as permitted by law.",
          },
          {
            title: "4. Intellectual Property",
            body: "All content on this website — including text, graphics, logos, images, and software — is the property of Gainsburry Capital Bank or its content suppliers and is protected by U.S. and international copyright laws. Unauthorized use is prohibited.",
          },
          {
            title: "5. Privacy",
            body: "Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms of Use by reference. Please review our Privacy & Security page to understand our practices.",
          },
          {
            title: "6. Disclaimers",
            body: "This website is provided on an 'as is' basis. Gainsburry Capital Bank makes no representations or warranties of any kind, express or implied, regarding the accuracy or completeness of any information on the site. We do not warrant that the website will be uninterrupted or error-free.",
          },
          {
            title: "7. Limitation of Liability",
            body: "To the fullest extent permitted by law, Gainsburry Capital Bank shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or our services.",
          },
          {
            title: "8. Third-Party Links",
            body: "This website may contain links to third-party websites. These links are provided for convenience only. Gainsburry Capital Bank does not endorse, control, or assume responsibility for the content or privacy practices of any linked sites.",
          },
          {
            title: "9. Changes to Terms",
            body: "Gainsburry Capital Bank reserves the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated effective date. Your continued use of the website after any changes constitutes acceptance of the new terms.",
          },
          {
            title: "10. Governing Law",
            body: "These Terms of Use shall be governed by and construed in accordance with the laws of the State of Texas, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Guadalupe County, Texas.",
          },
          {
            title: "11. Contact",
            body: "If you have questions about these Terms of Use, please contact us at: Gainsburry Capital Bank, 1090 FM 78, Schertz, TX 78154. Phone: (210) 658-1661. Email: info@gainsburrybank.com.",
          },
        ].map(({ title, body }, i) => (
          <FadeIn key={title} delay={i * 30}>
            <InfoCard title={title}>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </InfoCard>
          </FadeIn>
        ))}
      </div>
    </ContentPage>
  );
}
