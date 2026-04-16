import Link from "next/link";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight } from "lucide-react";

const RecentTransactions = ({
  transactions = [],
  page = 1,
  totalPages = 1,
  userId,
}: RecentTransactionsProps) => {
  return (
    <section className="recent-transactions">
      <FadeIn delay={0}>
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="eyebrow">Activity</span>
            <h3 className="ds" style={{ color: "var(--ds-foreground)" }}>
              Recent <em>transactions</em>
            </h3>
          </div>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1 text-12 font-medium underline underline-offset-4"
            style={{ color: "var(--ds-muted-foreground)" }}
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </header>
      </FadeIn>

      <FadeIn delay={80}>
        <TransactionsTable transactions={transactions} userId={userId} />
      </FadeIn>

      {totalPages > 1 && (
        <FadeIn delay={120}>
          <div className="my-4 w-full">
            <Pagination totalPages={totalPages} page={page} />
          </div>
        </FadeIn>
      )}
    </section>
  );
};

export default RecentTransactions;
