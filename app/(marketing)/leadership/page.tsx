import { ContentPage, SectionHeading } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import Link from "next/link";

const BOARD = [
  { name: "Roy W. Richard Jr.",    title: "Chairman of the Board",          bio: "Roy has led the Gainsburry Capital Bank board since 2004. A lifelong resident of Schertz, he brings decades of business and civic leadership to the bank's strategic direction." },
  { name: "Patricia M. Garza",     title: "Vice Chair",                     bio: "Patricia is a seasoned financial professional with over 25 years in community banking across Guadalupe and Bexar counties." },
  { name: "Harold J. Bauer",       title: "Board Director",                 bio: "Harold is a real estate developer and entrepreneur with deep roots in the Cibolo corridor." },
  { name: "Sandra K. Ortiz",       title: "Board Director",                 bio: "Sandra brings expertise in commercial lending and small business development having owned and operated three companies in the San Antonio area." },
  { name: "David L. Crane",        title: "Board Director",                 bio: "David is a retired U.S. Army colonel and decorated veteran with extensive leadership and operational experience." },
  { name: "Angela M. Torres",      title: "Board Director",                 bio: "Angela is a CPA with 30 years of public accounting experience and chairs the bank's Audit Committee." },
];

const OFFICERS = [
  { name: "Michael R. Holloway",   title: "President & Chief Executive Officer",    bio: "Michael has served as CEO of Gainsburry Capital Bank since 2011. Under his leadership the bank has grown from $420M to over $880M in total assets." },
  { name: "Jennifer L. Castillo",  title: "Executive Vice President & CFO",         bio: "Jennifer oversees all financial reporting, treasury management, and regulatory compliance for the bank." },
  { name: "Robert T. Fleming",     title: "Senior Vice President — Lending",        bio: "Robert leads the commercial and consumer lending teams, with a focus on local business growth and mortgage origination." },
  { name: "Carol A. Nguyen",       title: "Senior Vice President — Retail Banking", bio: "Carol manages all branch operations, customer experience, and retail product development." },
  { name: "Marcus D. Webb",        title: "Vice President — Technology & Digital",  bio: "Marcus drives the bank's digital strategy, including online banking, mobile, and cybersecurity infrastructure." },
];

function PersonCard({ name, title, bio }: { name: string; title: string; bio: string }) {
  const initials = name.split(" ").filter((_, i, a) => i === 0 || i === a.length - 1).map(n => n[0]).join("");
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-primary-foreground">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-xs text-primary mt-0.5 uppercase tracking-wide">{title}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{bio}</p>
    </div>
  );
}

export default function LeadershipPage() {
  return (
    <ContentPage
      eyebrow="About Us"
      title={<>Our <em>Leadership</em></>}
      subtitle="Gainsburry Capital Bank is guided by experienced local professionals who are deeply invested in the success of our community."
      imageUrl="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Gainsburry Capital Bank leadership team"
    >
      {/* Executive Officers */}
      <FadeIn>
        <div className="mb-16">
          <SectionHeading eyebrow="Management" title="Executive Officers" />
          <div className="grid gap-6 md:grid-cols-2">
            {OFFICERS.map((person, i) => (
              <FadeIn key={person.name} delay={i * 40}>
                <PersonCard {...person} />
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1600&q=80"
          alt="Leadership meeting"
          className="mb-16 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Board of Directors */}
      <FadeIn delay={100}>
        <div className="mb-16">
          <SectionHeading
            eyebrow="Governance"
            title="Board of Directors"
            subtitle="Our 10-member local board provides independent oversight and strategic guidance, ensuring the bank remains accountable to the community it serves."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BOARD.map((person, i) => (
              <FadeIn key={person.name} delay={i * 40}>
                <PersonCard {...person} />
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={140}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Join Our Team</h2>
          <p className="mt-2 text-sm opacity-70">We are always looking for talented individuals who share our commitment to community banking.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/careers" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">View Careers</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
