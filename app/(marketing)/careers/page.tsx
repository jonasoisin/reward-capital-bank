import { ContentPage, SectionHeading, InfoCard, FeatureList } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

const OPENINGS = [
  { title: "Personal Banker",           location: "Schertz Branch",  type: "Full-Time", dept: "Retail Banking" },
  { title: "Commercial Loan Officer",   location: "Main Branch",     type: "Full-Time", dept: "Lending" },
  { title: "Teller",                    location: "Kirby Branch",    type: "Part-Time", dept: "Retail Banking" },
  { title: "IT Support Specialist",     location: "Schertz (On-site)",type: "Full-Time", dept: "Technology" },
  { title: "Compliance Analyst",        location: "Main Branch",     type: "Full-Time", dept: "Compliance" },
];

const BENEFITS = [
  "Competitive salary & performance bonuses",
  "Comprehensive health, dental, and vision insurance",
  "401(k) with employer match",
  "Paid time off and holidays",
  "Tuition reimbursement",
  "Employee banking perks — fee waivers and preferred rates",
  "Community volunteer hours",
  "Professional development and licensing support",
];

export default function CareersPage() {
  return (
    <ContentPage
      eyebrow="About Us"
      title={<>Career <em>Opportunities</em></>}
      subtitle="Join a team that puts community first. At Gainsburry Capital Bank, you're not just an employee — you're a neighbor helping neighbors."
      imageUrl="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Gainsburry team working together"
    >
      {/* Why Join Us */}
      <FadeIn>
        <div className="mb-16">
          <SectionHeading eyebrow="Why Gainsburry" title="Why Work With Us?" />
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Benefits & Compensation">
              <FeatureList items={BENEFITS} />
            </InfoCard>
            <div className="space-y-6">
              <InfoCard title="Our Culture">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We believe our employees are our greatest asset. Our culture values collaboration, integrity, and genuine care for the communities we serve. Many of our team members have been with us for 10, 20, even 30+ years — a testament to what it feels like to work somewhere that values you.
                </p>
              </InfoCard>
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
          alt="Professional banking team"
          className="mb-16 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Open Positions */}
      <FadeIn delay={100}>
        <div className="mb-16">
          <SectionHeading eyebrow="Open Positions" title="Current Openings" />
          <div className="space-y-3">
            {OPENINGS.map((job, i) => (
              <FadeIn key={job.title} delay={i * 40}>
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{job.title}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{job.dept}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span className={`font-medium ${job.type === "Full-Time" ? "text-green-600" : "text-amber-600"}`}>{job.type}</span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="shrink-0 rounded-full border border-border bg-background px-5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Apply →
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Don't see a role that fits? We still want to hear from you. Send your resume to <span className="text-foreground font-medium">careers@gainsburrybank.com</span>.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Ready to Join Our Team?</h2>
          <p className="mt-2 text-sm opacity-70">Contact us to learn more or submit your application today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
