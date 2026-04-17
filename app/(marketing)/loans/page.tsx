import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

export default function LoansPage() {
  return (
    <ContentPage
      eyebrow="Lending Solutions"
      title={<>Loan <em>Solutions</em></>}
      subtitle="We offer a variety of loan solutions for your personal or business needs. The information below gives an overview of the general guidelines Gainsburry Capital Bank follows when considering specific types of loans."
      imageUrl="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Home mortgage and lending"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Consumer Loans */}
      <FadeIn>
        <div id="consumer" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Consumer" title="Consumer Loans" />
          <InfoCard title="Personal Financing Options">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">We Finance</p>
                <FeatureList items={[
                  "Auto, boat, recreational vehicles, airplane",
                  "Personal loans",
                  "Home improvement loans",
                ]} />
              </div>
              <div>
                <p className="text-muted-foreground">
                  Term, rate, and down payment requirements are determined by the age and condition of the collateral securing the loan. Contact your local branch for more details.
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </FadeIn>

      <FadeIn delay={60}>
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80"
          alt="Home and car financing"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Home Mortgages */}
      <FadeIn delay={80}>
        <div id="mortgages" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Real Estate" title="Home Mortgages" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Home Mortgage">
              <FeatureList items={[
                "80% Financing Available",
                "Maximum 20 Year Amortization",
                "Fixed Rates available",
                "Purchase Money or Refinance options",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">For rate information please contact your local branch.</p>
            </InfoCard>

            <InfoCard title="Home Improvement">
              <FeatureList items={[
                "80% Financing Available (Combine 1st & 2nd Liens)",
                "15 Year Term (Maximum)",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">For rate information please contact your local branch.</p>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      {/* Construction */}
      <FadeIn delay={100}>
        <div id="construction" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Construction" title="Interim Construction Loans" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Residential Interim Construction">
              <FeatureList items={[
                "80% financing available (of total project cost or appraised value, whichever is less)",
                "12 month maximum interim term",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">For rate information please contact your local branch.</p>
            </InfoCard>

            <InfoCard title="Commercial Interim/Permanent">
              <FeatureList items={[
                "80% financing available (of total project cost or appraised value, whichever is less)",
                "24 month maximum interim term",
                "20 year amortization available on the permanent loan",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">For rate information please contact your local branch.</p>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={110}>
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80"
          alt="Construction loan building"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Commercial Loans */}
      <FadeIn delay={120}>
        <div id="commercial" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Business" title="Commercial Loans" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Commercial Financing">
              <p className="eyebrow mb-2 text-sm">We Finance</p>
              <FeatureList items={[
                "Working Capital",
                "Fixed Asset Acquisition and/or Expansion",
                "Machinery and Equipment",
                "Real Estate (Land and/or Building)",
                "Letters of Credit",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">Gainsburry Capital Bank offers many different options in commercial lending determined by the specific needs of the customer.</p>
            </InfoCard>

            <InfoCard title="Commercial Real Estate">
              <FeatureList items={[
                "80% Financing Available",
                "20 year Maximum Term",
                "Purchase Money or Refinance options available",
              ]} />
              <p className="mt-3 text-xs text-muted-foreground">For rate information please contact your local branch. Terms and conditions vary — please contact us for more information.</p>
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      {/* Lines of Credit */}
      <FadeIn delay={130}>
        <div id="lines-of-credit" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Credit" title="Lines of Credit" />
          <InfoCard title="Line of Credit Options">
            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Types Available</p>
                <FeatureList items={[
                  "Contract Lines of Credit",
                  "Working Capital Lines of Credit",
                  "Floorplan (Vehicle & Equipment)",
                ]} />
              </div>
              <div>
                <p className="text-muted-foreground">A line of credit gives your business the flexibility to borrow up to your approved limit as needed, repay, and borrow again — ideal for managing cash flow and seasonal expenses.</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">For rate information please contact your local branch.</p>
          </InfoCard>
        </div>
      </FadeIn>

      {/* SBA Loans */}
      <FadeIn delay={140}>
        <div id="sba" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="SBA" title="SBA Guaranteed Loans" subtitle="Gainsburry Capital Bank is a SBA Certified & Preferred Lender." />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="General Small Business Loans (7a)">
              <p className="text-sm text-muted-foreground">
                The 7(a) Loan Program, SBA's most common loan program, includes financial help for businesses with special requirements. This program offers flexible loan amounts and terms for a wide variety of business purposes.
              </p>
            </InfoCard>

            <InfoCard title="Real Estate & Equipment Loans (CDC/504)">
              <p className="text-sm text-muted-foreground">
                The CDC/504 Loan Program provides financing for major fixed assets such as equipment or real estate. The SBA 504 program has distinct advantages for both the borrower and the bank in equity requirements, term, and partial fixed rate financing.
              </p>
            </InfoCard>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">For additional information about SBA loan programs, visit <strong>sba.gov</strong> → Loans & Grants → SBA Loan Programs.</p>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
          alt="Business loan consultation"
          className="mb-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Applications & Disclosures */}
      <FadeIn delay={160}>
        <div id="applications" className="mb-12 scroll-mt-24">
          <SectionHeading eyebrow="Apply" title="Loan Applications & Disclosures" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Loan Applications">
              <div className="space-y-2 text-sm">
                {[
                  "Commercial Loan Application",
                  "Consumer Non-Real Estate Loan Application",
                  "Mortgage Application",
                ].map((app) => (
                  <div key={app} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                    <span className="text-foreground">{app}</span>
                    <Link href="/contact" className="text-xs text-primary hover:underline">Request →</Link>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Disclosures">
              <FeatureList items={[
                "Community Reinvestment Act Notice",
                "Federal Fair Lending Laws",
                "Home Mortgage Disclosure Act Notice",
                "Notice to Borrowers",
                "Federal Reserve Board Regulations",
                "eSign Disclosure",
              ]} />
            </InfoCard>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={180}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Apply for a Loan?</h2>
          <p className="mt-2 text-sm opacity-70">Contact your local branch today. Our lending team is ready to help you find the right solution.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Contact Us</Link>
            <Link href="/locations" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Find a Branch</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
