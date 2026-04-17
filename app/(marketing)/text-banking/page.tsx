import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function TextBankingPage() {
  return (
    <ContentPage
      eyebrow="Digital Solutions"
      title={<>Text <em>&amp; Telephone Banking</em></>}
      subtitle="Want to know your balance quickly? Text or call us! We'll text you back the important information. Anytime. Anywhere."
      imageUrl="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Mobile text banking"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Text Banking */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading
            eyebrow="Text Banking"
            title="Account Info by Text"
            subtitle="Text Banking is a free service from Gainsburry Capital Bank that allows you to quickly and easily request and receive account information via text messages. You don't need to use your login, and it's just as secure as our other services."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Text Banking Features">
              <FeatureList items={[
                "Quick, easy and safe account access",
                "No smartphone required",
                "Simple text commands",
                "Receive your balance, transaction history and more",
                "Your mobile carrier's message and data rates may apply",
              ]} />
            </InfoCard>

            <InfoCard title="Text Commands">
              <div className="space-y-3 text-sm">
                {[
                  { cmd: "BAL",                    desc: "View your account balances" },
                  { cmd: "HIST [account nickname]", desc: "Receive transaction history" },
                  { cmd: "BRANCH [street or zip]",  desc: "Get branch addresses and phone numbers" },
                  { cmd: "ATM [street or zip]",     desc: "Get ATM addresses" },
                  { cmd: "STOP",                    desc: "Cancel Text Banking" },
                  { cmd: "HELP",                    desc: "Receive a list of commands on your phone" },
                ].map(({ cmd, desc }) => (
                  <div key={cmd} className="flex items-start gap-3">
                    <code className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-mono text-foreground">Text {cmd}</code>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      {/* How to Enroll */}
      <FadeIn delay={80}>
        <div className="mb-12">
          <SectionHeading eyebrow="Enrollment" title="How to Enroll in Text Banking" />
          <InfoCard title="Setup Steps">
            <div className="space-y-4 text-sm text-muted-foreground">
              {[
                "Login to online banking and click on your Profile.",
                "Scroll down to the Mobile Banking section, then click on Manage devices.",
                "Click \"Add New Device\".",
                "Under Other Services, input your cell phone number and click Continue.",
                "Check the box next to Text Messaging, then click Continue.",
                "You will receive a text with an Activation Code — enter it on screen to complete enrollment.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <img
          src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=80"
          alt="Smartphone banking"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Telephone Banking */}
      <FadeIn delay={120}>
        <div id="telephone" className="mb-12 scroll-mt-24">
          <SectionHeading
            eyebrow="Telephone Banking"
            title="24/7 Automated Telephone Banking"
            subtitle="Simply dial into our automated Telephone Banking system to gain fast and secure access to your account information 24/7. All you need is a touchtone phone, your account number(s), and your 4-digit PIN."
          />

          <InfoCard title="Getting Started with Telephone Banking">
            <div className="space-y-4 text-sm text-muted-foreground">
              {[
                "Have your account number and the Social Security Number of the PRIMARY account owner before you call.",
                "For security purposes, the FIRST time you call, the PIN will be the last four digits of the primary account owner's Social Security Number.",
                "You will be asked to establish your own four-digit PIN. The voice prompt will guide you through setup.",
                "Set your PIN to an easy-to-remember, four-digit number to use for all future calls.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
              <p className="mt-2 text-xs">Note: Your Telephone Bank PIN and Online Banking Password are different for your security protection.</p>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Have Questions?</h2>
          <p className="mt-2 text-sm opacity-70">Contact us during regular banking hours. Our team is ready to help with enrollment and setup.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Contact Us</Link>
            <Link href="/sign-in" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Sign In to Enroll</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
