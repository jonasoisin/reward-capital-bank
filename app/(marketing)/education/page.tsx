import { ContentPage, SectionHeading, InfoCard } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { BookOpen, TrendingUp, Home, Briefcase, PiggyBank, CreditCard } from "lucide-react";
import Link from "next/link";

const TOPICS = [
  {
    icon: PiggyBank,
    title: "Saving & Budgeting",
    articles: [
      "How to Build an Emergency Fund",
      "The 50/30/20 Budget Rule Explained",
      "Setting and Sticking to Financial Goals",
      "How Compound Interest Works in Your Favor",
    ],
  },
  {
    icon: CreditCard,
    title: "Credit & Debt",
    articles: [
      "Understanding Your Credit Score",
      "How to Improve Your Credit in 6 Months",
      "Good Debt vs. Bad Debt",
      "Paying Off Debt: Avalanche vs. Snowball",
    ],
  },
  {
    icon: Home,
    title: "Home Buying",
    articles: [
      "How Much House Can You Afford?",
      "The Mortgage Process Step by Step",
      "Fixed Rate vs. Adjustable Rate Mortgages",
      "What is PMI and How to Avoid It",
    ],
  },
  {
    icon: TrendingUp,
    title: "Investing & Retirement",
    articles: [
      "IRA vs. 401(k): Which is Right for You?",
      "How to Start Investing with $1,000",
      "Understanding CD Laddering",
      "Retirement Planning at Every Age",
    ],
  },
  {
    icon: Briefcase,
    title: "Business Finance",
    articles: [
      "Separating Personal and Business Finances",
      "How to Build Business Credit",
      "Cash Flow Management for Small Business",
      "When to Apply for a Business Line of Credit",
    ],
  },
  {
    icon: BookOpen,
    title: "Banking Basics",
    articles: [
      "Checking vs. Savings: What's the Difference?",
      "How Direct Deposit Works",
      "What is ACH and How Does It Work?",
      "Understanding Wire Transfers",
    ],
  },
];

export default function EducationPage() {
  return (
    <ContentPage
      eyebrow="Resources & Tools"
      title={<>Online <em>Education Center</em></>}
      subtitle="Free financial education resources to help you make confident, informed decisions at every stage of life."
      imageUrl="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Financial education"
    >
      <FadeIn>
        <div className="mb-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground leading-relaxed">
            At Gainsburry Capital Bank, we believe financial education is the foundation of financial health. Our Online Education Center offers articles, guides, and tools on everything from basic budgeting to retirement planning — all free for our customers and the community.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={60}>
        <SectionHeading eyebrow="Topics" title="Browse by Topic" />
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map(({ icon: Icon, title, articles }, i) => (
          <FadeIn key={title} delay={i * 50}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
              </div>
              <ul className="space-y-2.5">
                {articles.map(article => (
                  <li key={article}>
                    <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {article}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={200}>
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
          alt="Learning and financial education"
          className="my-12 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      <FadeIn delay={220}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Have a Financial Question?</h2>
          <p className="mt-2 text-sm opacity-70">Our team is happy to help you navigate any financial topic in person or over the phone.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Talk to Us</Link>
            <Link href="/calculators" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Try Our Calculators</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
