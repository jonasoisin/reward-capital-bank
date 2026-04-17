import { ContentPage, SectionHeading, RateTable } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";

export default function RatesPage() {
  return (
    <ContentPage
      eyebrow="Personal Banking"
      title={<>Deposit <em>Rates</em></>}
      subtitle="Gainsburry Capital Bank offers a variety of interest bearing accounts that include Savings, Money Market, CDs, Jumbo CDs, and IRAs."
      imageUrl="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Financial rates and investment"
    >
      {/* Savings */}
      <FadeIn>
        <div className="mb-12">
          <SectionHeading eyebrow="Investment Plan" title="Savings Account" />
          <RateTable
            headers={["Account Type", "Interest Rate", "APY"]}
            rows={[
              ["Savings Account*", "0.03%", "0.03%"],
            ]}
            note="Minimum to open: $100. *Rate may change after account is opened."
          />
        </div>
      </FadeIn>

      {/* Money Market */}
      <FadeIn delay={60}>
        <div className="mb-12">
          <SectionHeading eyebrow="Checking Accounts" title="Money Market Checking" />
          <RateTable
            headers={["Balance Tier", "Interest Rate", "APY"]}
            rows={[
              ["$0 – $24,999.99",       "0.03%", "0.03%"],
              ["$25,000 – $49,999.99",  "0.05%", "0.05%"],
              ["$50,000 – $74,999.99",  "0.07%", "0.07%"],
              ["$75,000 – $99,999.99",  "0.10%", "0.10%"],
              ["$100,000 or more",      "0.15%", "0.15%"],
            ]}
            note="Minimum to open: $100. *Rate may change after account is opened."
          />
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80"
          alt="Investment charts"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Regular CDs */}
      <FadeIn delay={100}>
        <div className="mb-12">
          <SectionHeading eyebrow="Certificates of Deposit" title="Regular CDs" />
          <RateTable
            headers={["Term", "Interest Rate", "APY"]}
            rows={[
              ["90 Day CD",     "1.00%", "1.00%"],
              ["180 Day CD",    "2.75%", "2.78%"],
              ["1 Year CD",     "3.25%", "3.29%"],
              ["1½ Year CD",    "3.25%", "3.29%"],
              ["2 Year CD",     "3.50%", "3.55%"],
              ["2½ Year CD",    "2.95%", "2.98%"],
              ["3 Year CD",     "2.90%", "2.93%"],
              ["4 Year CD",     "2.90%", "2.93%"],
              ["5 Year CD",     "2.90%", "2.93%"],
            ]}
            note="Minimum to open: $1,000. **SUBSTANTIAL PENALTY FOR EARLY WITHDRAWAL."
          />
        </div>
      </FadeIn>

      {/* Jumbo CDs */}
      <FadeIn delay={120}>
        <div className="mb-12">
          <SectionHeading eyebrow="Certificates of Deposit" title="Jumbo CDs" />
          <RateTable
            headers={["Term", "Interest Rate", "APY", "APY (Quarterly)"]}
            rows={[
              ["90 Day Jumbo CD",   "1.00%", "1.00%", "1.00%"],
              ["180 Day Jumbo CD",  "2.75%", "2.75%", "2.78%"],
              ["1 Year Jumbo CD",   "3.25%", "3.25%", "3.29%"],
              ["2 Year Jumbo CD",   "3.50%", "3.50%", "3.55%"],
              ["3 Year Jumbo CD",   "2.90%", "2.90%", "2.93%"],
              ["4 Year Jumbo CD",   "2.90%", "2.90%", "2.93%"],
              ["5 Year Jumbo CD",   "2.90%", "2.90%", "2.93%"],
            ]}
            note="Minimum to open: $100,000. **SUBSTANTIAL PENALTY FOR EARLY WITHDRAWAL."
          />
        </div>
      </FadeIn>

      {/* IRAs */}
      <FadeIn delay={140}>
        <div className="mb-12">
          <SectionHeading eyebrow="Retirement" title="Individual Retirement Accounts" />
          <RateTable
            headers={["Term", "Interest Rate", "APY"]}
            rows={[
              ["12 Month Fixed Rate",    "1.25%", "1.26%"],
              ["18 Month Fixed Rate",    "1.35%", "1.36%"],
              ["3 Year Fixed Rate",      "1.50%", "1.51%"],
              ["4 Year Fixed Rate",      "1.60%", "1.61%"],
              ["5 Year Fixed Rate",      "1.75%", "1.76%"],
              ["12 Month Variable Rate*","1.15%", "1.15%"],
              ["18 Month Variable Rate*","1.25%", "1.26%"],
              ["3 Year Variable Rate*",  "1.45%", "1.46%"],
              ["4 Year Variable Rate*",  "1.50%", "1.51%"],
              ["5 Year Variable Rate*",  "1.60%", "1.61%"],
            ]}
            note="Fixed Rate IRA minimum: $1,000. Variable Rate IRA minimum: $100. *Rate may change after account is opened. **SUBSTANTIAL PENALTY FOR EARLY WITHDRAWAL. Fees could reduce earnings. FDIC INSURED."
          />
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Have Questions About Rates?</h2>
          <p className="mt-2 text-sm opacity-70">Our team is ready to help you find the right product for your financial goals.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="/open-account" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Open an Account</a>
            <a href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</a>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
