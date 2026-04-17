import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser();

  const AuthButton = () => {
    if (user) {
      return (
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </Link>
      );
    }
    return (
      <Link
        href="/sign-in"
        className="flex items-center justify-center gap-1.5 rounded-full border border-primary bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
      >
        Sign In <ArrowRight className="h-4 w-4" />
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingNav authButtons={<AuthButton />} />
      <main className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
