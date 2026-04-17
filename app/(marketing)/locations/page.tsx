import { ContentPage, SectionHeading, InfoCard } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";
import { MapPin, Phone, Clock, CreditCard } from "lucide-react";

const BRANCHES = [
  {
    name: "Main Branch — Schertz",
    address: "1090 FM 78, Schertz, TX 78154",
    phone: "(210) 658-1661",
    hours: [
      { day: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
      { day: "Saturday",        hours: "8:00 AM – 12:00 PM" },
      { day: "Sunday",          hours: "Closed" },
    ],
    services: ["Full Service", "ATM", "Drive-Through", "Safe Deposit Boxes", "Notary"],
  },
  {
    name: "Kirby Branch",
    address: "5330 Binz-Engleman Rd, Kirby, TX 78219",
    phone: "(210) 658-1661",
    hours: [
      { day: "Monday – Friday", hours: "9:00 AM – 5:00 PM" },
      { day: "Saturday",        hours: "9:00 AM – 12:00 PM" },
      { day: "Sunday",          hours: "Closed" },
    ],
    services: ["Full Service", "ATM", "Drive-Through"],
  },
];

const ATMS = [
  { location: "Schertz Main Branch",          address: "1090 FM 78, Schertz, TX 78154" },
  { location: "Kirby Branch",                 address: "5330 Binz-Engleman Rd, Kirby, TX 78219" },
  { location: "Schertz Marketplace (H-E-B)", address: "Near 1720 Schertz Pkwy, Schertz, TX 78154" },
];

export default function LocationsPage() {
  return (
    <ContentPage
      eyebrow="Contact Information"
      title={<>Locations, Hours <em>&amp; ATMs</em></>}
      subtitle="Visit us at either of our two convenient locations serving the greater San Antonio area. Our ATMs are available 24/7 at no fee for Gainsburry customers."
      imageUrl="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Branch locations"
    >
      {/* Branches */}
      <FadeIn>
        <div className="mb-16">
          <SectionHeading eyebrow="Branches" title="Our Locations" />
          <div className="grid gap-8 lg:grid-cols-2">
            {BRANCHES.map((branch, i) => (
              <FadeIn key={branch.name} delay={i * 60}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full space-y-5">
                  <div>
                    <h3 className="font-semibold text-foreground text-base">{branch.name}</h3>
                    <p className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" /> {branch.address}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Phone className="h-4 w-4 shrink-0 text-primary" /> {branch.phone}
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow mb-2 text-xs">Hours</p>
                    <div className="space-y-1.5">
                      {branch.hours.map(({ day, hours }) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-primary" /> {day}
                          </span>
                          <span className={`font-medium ${hours === "Closed" ? "text-red-500" : "text-foreground"}`}>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="eyebrow mb-2 text-xs">Services Available</p>
                    <div className="flex flex-wrap gap-2">
                      {branch.services.map(s => (
                        <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
          alt="Bank building"
          className="mb-16 h-56 w-full rounded-2xl object-cover"
        />
      </FadeIn>

      {/* ATMs */}
      <FadeIn delay={100}>
        <div className="mb-16">
          <SectionHeading
            eyebrow="ATMs"
            title="ATM Locations"
            subtitle="No ATM fee for Gainsburry Capital Bank customers at any of our ATMs. Available 24 hours a day, 7 days a week."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {ATMS.map(({ location, address }) => (
              <div key={location} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{location}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            You can also use any Allpoint® Network ATM surcharge-free. Use the Text Banking ATM command or our Mobile App to find the nearest ATM.
          </p>
        </div>
      </FadeIn>
    </ContentPage>
  );
}
