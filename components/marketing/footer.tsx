import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icons/logo.svg" width={24} height={24} alt="Logo" className="text-primary grayscale" />
              <span className="font-ibm-plex-serif text-lg font-semibold text-foreground">Gainsburry</span>
            </Link>
            <p className="text-sm text-muted-foreground prose-width-sm">
              Headquartered in Schertz, Texas. Gainsburry Capital Bank is a proud Texas state-chartered community bank providing personalized financial services to the San Antonio area since 1913.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Services</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/checking" className="hover:text-primary transition-colors">Personal Checking</Link></li>
              <li><Link href="/savings" className="hover:text-primary transition-colors">High-Yield Savings</Link></li>
              <li><Link href="/loans" className="hover:text-primary transition-colors">Mortgages & Loans</Link></li>
              <li><Link href="/business" className="hover:text-primary transition-colors">Business Banking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/leadership" className="hover:text-primary transition-colors">Leadership</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclosures" className="hover:text-primary transition-colors">CRA Disclosures</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Gainsburry Capital Bank, affiliates of Schertz Bancshares, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <span>Member FDIC</span>
            <span>Equal Housing Lender</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
