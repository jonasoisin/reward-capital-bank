import { ContentPage, SectionHeading, InfoCard } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";

const CORE_VALUES = [
  { title: "Integrity",      desc: "We act with honesty and transparency in every decision, every day." },
  { title: "Community",      desc: "We are invested in the success of the families and businesses we serve across Schertz, Cibolo, and the San Antonio area." },
  { title: "Service",        desc: "Personalized attention — you speak to a person, not a machine." },
  { title: "Stability",      desc: "Over a century of sound banking through every economic cycle." },
  { title: "Innovation",     desc: "Combining community roots with modern digital banking tools." },
  { title: "Accountability", desc: "A local board of directors that is answerable to our community, not to Wall Street." },
];

const TESTIMONIALS = [
  { name: "Maria L.",   location: "Schertz, TX",   text: "Gainsburry has been my family's bank for three generations. They know my name when I walk in and actually care about my financial goals." },
  { name: "James R.",   location: "Cibolo, TX",    text: "Got my first business loan here when no big bank would even talk to me. Ten years later my company employs 40 people. Gainsburry made that possible." },
  { name: "Sandra M.",  location: "San Antonio, TX",text: "The online banking is just as good as any big bank, but when I need help I get a real person in minutes. That's what keeps me here." },
  { name: "Tom & Kay B.", location: "Schertz, TX", text: "We financed our home through Gainsburry. The process was smooth and the rate was better than anything we found elsewhere." },
];

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About Us"
      title={<>A Bank Built on <em>Community</em></>}
      subtitle="Gainsburry Capital Bank is a Texas state-chartered community bank headquartered in Schertz, Texas. Proudly serving the San Antonio area since 1913."
      imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Gainsburry Capital Bank headquarters"
      secondaryHref="/contact"
      secondaryLabel="Contact Us"
    >
      {/* Our Story */}
      <FadeIn>
        <div className="mb-16">
          <SectionHeading eyebrow="Our Story" title="Over a Century of Community Banking" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Founded in 1913, Gainsburry Capital Bank has grown from a small community savings institution into a full-service bank with over <strong className="text-foreground">$881 million in total assets</strong> and <strong className="text-foreground">$768 million in customer deposits</strong> — all while remaining rooted in the communities we serve.
              </p>
              <p>
                We are headquartered in Schertz, Texas, and proudly serve Schertz, Cibolo, Guadalupe, Comal, Hays, and Bexar counties. Every dollar deposited with us stays local, funding the loans and businesses that make our region thrive.
              </p>
              <p>
                Unlike large national banks, our decisions are made locally by a 10-member board of directors — neighbors who understand what this community needs.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "1913",  label: "Year Founded" },
                { stat: "$881M", label: "Total Assets" },
                { stat: "$768M", label: "Customer Deposits" },
                { stat: "$687M", label: "Local Loans Funded" },
              ].map(({ stat, label }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                  <p className="text-2xl font-bold tracking-tight text-foreground">{stat}</p>
                  <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={60}>
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80"
          alt="Community banking team"
          className="mb-16 h-64 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Mission Statement */}
      <FadeIn delay={80}>
        <div id="mission" className="mb-16 scroll-mt-24">
          <SectionHeading eyebrow="Mission" title="Mission Statement & Core Values" />
          <InfoCard title="Our Mission">
            <p className="text-sm text-muted-foreground leading-relaxed">
              To provide personalized financial services that empower individuals, families, and businesses in our community to achieve their financial goals — with the integrity, stability, and care of a true community bank.
            </p>
          </InfoCard>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map(({ title, desc }, i) => (
              <FadeIn key={title} delay={i * 40}>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <p className="font-semibold text-sm text-foreground">{title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <img
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1600&q=80"
          alt="Community investment"
          className="mb-16 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* Testimonials */}
      <FadeIn delay={120}>
        <div id="testimonials" className="mb-16 scroll-mt-24">
          <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />
          <div className="grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map(({ name, location, text }, i) => (
              <FadeIn key={name} delay={i * 50}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-full">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{location}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* FDIC / Equal Housing */}
      <FadeIn delay={140}>
        <div className="mb-12 flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">FDIC Insured</p>
            <p className="text-xs text-muted-foreground mt-0.5">Deposits insured up to allowable limits</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Equal Housing Lender</p>
            <p className="text-xs text-muted-foreground mt-0.5">We lend in accordance with fair lending laws</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">Texas State-Chartered</p>
            <p className="text-xs text-muted-foreground mt-0.5">Regulated by the Texas Department of Banking</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="rounded-2xl bg-foreground p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-semibold">Meet Our Team</h2>
          <p className="mt-2 text-sm opacity-70">Learn about the experienced professionals leading Gainsburry Capital Bank.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/leadership" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors">Our Leadership</Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
