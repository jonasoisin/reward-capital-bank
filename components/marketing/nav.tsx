"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    title: "Personal Banking",
    sections: [
      {
        heading: "Consumer Products",
        links: [
          { label: "Open An Account With Us", href: "/open-account" },
          { label: "Personal Checking",        href: "/checking" },
          { label: "Personal Savings",         href: "/savings" },
          { label: "CDs & IRAs",               href: "/cds-iras" },
          { label: "Rates",                    href: "/rates" },
        ],
      },
      {
        heading: "Digital Solutions",
        links: [
          { label: "Personal Online Banking", href: "/personal-online-banking" },
          { label: "eStatements",             href: "/estatements" },
          { label: "Mobile Banking",          href: "/mobile-banking" },
          { label: "Mobile Deposit",          href: "/mobile-banking#mobile-deposit" },
          { label: "Bill Pay",                href: "/bill-pay" },
          { label: "Zelle",                   href: "/bill-pay#zelle" },
          { label: "CardHub",                 href: "/cardhub" },
          { label: "Text Banking",            href: "/text-banking" },
          { label: "Telephone Banking",       href: "/text-banking#telephone" },
        ],
      },
      {
        heading: "Other Services",
        links: [
          { label: "Credit Card",              href: "/credit-cards" },
          { label: "Debit Cards",              href: "/debit-cards" },
          { label: "Electronic Funds Transfer",href: "/eft" },
          { label: "Financial Planning",       href: "/financial-planning" },
          { label: "Safe Deposit Boxes",       href: "/safe-deposit" },
          { label: "Wire Transfers",           href: "/wire-transfers" },
        ],
      },
    ],
  },
  {
    title: "Business Banking",
    sections: [
      {
        heading: "Business Products",
        links: [
          { label: "Business Checking", href: "/business/checking" },
          { label: "Business Savings",  href: "/business/checking#savings" },
          { label: "CDs",               href: "/cds-iras" },
          { label: "Rates",             href: "/rates" },
        ],
      },
      {
        heading: "Digital Solutions",
        links: [
          { label: "Business Online Banking",  href: "/business/online-banking" },
          { label: "Bill Pay",                 href: "/business/bill-pay" },
          { label: "eStatements",              href: "/business/online-banking#estatements" },
          { label: "Mobile Banking",           href: "/business/mobile-banking" },
          { label: "Business Mobile Deposit",  href: "/business/mobile-banking#deposit" },
          { label: "Merchant Deposit Capture", href: "/business/remote-deposit" },
          { label: "ACH Origination",          href: "/business/ach-origination" },
          { label: "CardHub",                  href: "/cardhub" },
        ],
      },
      {
        heading: "Other Services",
        links: [
          { label: "Credit Card",              href: "/credit-cards" },
          { label: "Debit Cards",              href: "/debit-cards" },
          { label: "Electronic Funds Transfer",href: "/eft" },
          { label: "Financial Planning",       href: "/financial-planning" },
          { label: "Merchant Services",        href: "/business/merchant-services" },
          { label: "Safe Deposit Boxes",       href: "/safe-deposit" },
          { label: "Wire Transfers",           href: "/wire-transfers" },
        ],
      },
    ],
  },
  {
    title: "Lending Solutions",
    sections: [
      {
        heading: "Consumer",
        links: [
          { label: "Consumer Loans",   href: "/loans#consumer" },
          { label: "Interim Construction", href: "/loans#construction" },
          { label: "Home Mortgages",   href: "/loans#mortgages" },
          { label: "Home Improvement", href: "/loans#home-improvement" },
        ],
      },
      {
        heading: "Business",
        links: [
          { label: "Commercial Loans",             href: "/loans#commercial" },
          { label: "Interim/Permanent Construction",href: "/loans#construction" },
          { label: "Commercial Real Estate",       href: "/loans#commercial" },
          { label: "Lines of Credit",              href: "/loans#lines-of-credit" },
          { label: "SBA Guaranteed Loans",         href: "/loans#sba" },
        ],
      },
      {
        heading: "Helpful Services",
        links: [
          { label: "Applications",        href: "/loans#applications" },
          { label: "Disclosures",         href: "/disclosures" },
          { label: "Financial Calculators",href: "/calculators" },
        ],
      },
    ],
  },
  {
    title: "About Us",
    sections: [
      {
        heading: "Who We Are",
        links: [
          { label: "About Us",                      href: "/about" },
          { label: "Mission Statement & Core Values",href: "/about#mission" },
          { label: "Testimonials",                  href: "/about#testimonials" },
          { label: "Leadership",                    href: "/leadership" },
        ],
      },
      {
        heading: "Contact Information",
        links: [
          { label: "Contact Us",             href: "/contact" },
          { label: "Locations, Hours & ATMs",href: "/locations" },
          { label: "Career Opportunities",   href: "/careers" },
        ],
      },
      {
        heading: "Resources & Tools",
        links: [
          { label: "Website Terms of Use",  href: "/terms" },
          { label: "Online Education Center",href: "/education" },
          { label: "Financial Calculators", href: "/calculators" },
          { label: "Security & Privacy",    href: "/privacy" },
        ],
      },
    ],
  },
];

type NavCategory = typeof NAV_LINKS[0];

function DesktopNavItem({ category }: { category: NavCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {category.title}
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200",
          isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"
        )}
      >
        <div className="relative w-[800px] cursor-default rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="grid grid-cols-3 gap-8">
            {category.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-foreground">
                  {section.heading}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, li) => (
                    <li key={li}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({ category }: { category: NavCategory }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 py-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-base font-medium text-foreground"
      >
        {category.title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        open ? "mt-2 max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="flex flex-col gap-6 pb-4 pl-2">
          {category.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                {section.heading}
              </span>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, li) => (
                  <li key={li}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketingNav({ authButtons }: { authButtons: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "group fixed top-0 z-50 w-full border-b border-transparent transition-colors duration-150",
      scrolled && "border-border bg-background/80 backdrop-blur-xl",
      menuOpen && "border-border bg-background"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icons/logo.svg" width={28} height={28} alt="Gainsburry Capital Bank" />
              <span className="font-ibm-plex-serif text-xl font-bold tracking-tight text-foreground">
                Gainsburry{" "}
                <span className="ml-1 hidden rounded bg-muted px-1.5 py-0.5 font-inter text-[10px] font-medium uppercase tracking-widest opacity-70 sm:inline">
                  Bank
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-8 px-4 lg:flex">
            {NAV_LINKS.map((cat, i) => <DesktopNavItem key={i} category={cat} />)}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden sm:block">{authButtons}</div>
            <button
              className="relative ml-2 flex h-10 w-10 items-center justify-center rounded-md bg-muted/30 text-foreground lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className={cn("absolute size-5 transition-all duration-200", menuOpen && "scale-0 opacity-0")} />
              <X className={cn("absolute size-5 transition-all duration-200", !menuOpen && "scale-0 opacity-0")} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "absolute inset-x-0 top-[72px] h-[calc(100vh-72px)] overflow-y-auto border-b border-border bg-background transition-all duration-200 lg:hidden",
        menuOpen ? "opacity-100 translate-x-0" : "pointer-events-none hidden opacity-0 translate-x-full"
      )}>
        <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-4 pb-32">
          {NAV_LINKS.map((cat, i) => <MobileNavItem key={i} category={cat} />)}
          <div className="mt-8 border-t border-border/50 pt-4 sm:hidden">{authButtons}</div>
        </div>
      </div>
    </nav>
  );
}
