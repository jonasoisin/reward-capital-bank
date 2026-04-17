import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/admin.actions";
import { getSessionUser } from "@/lib/auth";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, Clock } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function AdminDashboardPage() {
  const [stats, user] = await Promise.all([
    getDashboardStats(),
    Promise.resolve(getSessionUser()),
  ]);

  const statCards = [
    {
      eyebrow: "Total Users",
      value: formatNumber(stats.totalUsers),
      description: "Registered user accounts on the platform.",
    },
    {
      eyebrow: "Total Transactions",
      value: formatNumber(stats.totalTransactions),
      description: "All transactions recorded across every account.",
    },
    {
      eyebrow: "Today's Transactions",
      value: formatNumber(stats.todayTransactions),
      description: "Transactions initiated since midnight today.",
    },
    {
      eyebrow: "Pending Transactions",
      value: formatNumber(stats.pendingTransactions),
      description: "Transactions currently awaiting processing.",
      highlight: stats.pendingTransactions > 0,
    },
    {
      eyebrow: "Total Volume",
      value: formatCurrency(stats.totalVolume),
      description: "Cumulative value of all completed transactions.",
      wide: true,
    },
  ];

  return (
    <div className="min-h-screen px-8 py-10 lg:px-12 lg:py-14">
      {/* ── Page header ── */}
      <div className="mb-10">
        <FadeIn delay={0} direction="up">
          <span className="eyebrow">Admin Dashboard</span>
        </FadeIn>
        <FadeIn delay={80} direction="up">
          <h1
            className="ds mt-3"
            style={{ color: "var(--ds-foreground)" }}
          >
            Good to see you, <em>{user?.firstName ?? "Admin"}.</em>
          </h1>
        </FadeIn>
        <FadeIn delay={140} direction="up">
          <p
            className="mt-2 feature-text"
            style={{ color: "var(--ds-muted-foreground)" }}
          >
            Here is a live snapshot of the banking platform.
          </p>
        </FadeIn>
      </div>

      {/* ── Stat cards grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <FadeIn
            key={card.eyebrow}
            delay={200 + i * 60}
            direction="up"
            className={card.wide ? "sm:col-span-2 lg:col-span-2" : ""}
          >
            <div
              className="rounded-2xl h-full"
              style={{
                background: "var(--ds-card)",
                border: `1px solid ${card.highlight ? "#fca5a5" : "var(--ds-border)"}`,
              }}
            >
              <div className="p-8 flex flex-col justify-between h-full gap-6">
                <span
                  className="eyebrow"
                  style={{ color: card.highlight ? "#dc2626" : undefined }}
                >
                  {card.eyebrow}
                </span>
                <div>
                  <p
                    className="stat-number"
                    style={{
                      color: card.highlight ? "#dc2626" : "var(--ds-foreground)",
                    }}
                  >
                    {card.value}
                  </p>
                  <p
                    className="mt-2 feature-text"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* ── Pending transactions notice ── */}
      {stats.pendingTransactions > 0 && (
        <FadeIn delay={600} direction="up">
          <div
            className="mt-8 rounded-2xl p-6 flex items-start gap-4"
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "#ffedd5" }}
            >
              <Clock size={16} style={{ color: "#c2410c" }} strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium"
                style={{ color: "#9a3412" }}
              >
                {formatNumber(stats.pendingTransactions)} transaction
                {stats.pendingTransactions !== 1 ? "s" : ""} pending review
              </p>
              <p
                className="mt-0.5 feature-text"
                style={{ color: "#c2410c" }}
              >
                These transactions are awaiting processing. Head to the Transactions
                page to review and action them.
              </p>
            </div>
            <Link
              href="/admin/transactions"
              className="flex shrink-0 items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{
                background: "#c2410c",
                color: "#fff",
              }}
            >
              Review
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </div>
        </FadeIn>
      )}

      {/* ── No pending notice (neutral) ── */}
      {stats.pendingTransactions === 0 && (
        <FadeIn delay={600} direction="up">
          <div
            className="mt-8 rounded-2xl p-6 flex items-center justify-between gap-4"
            style={{
              background: "var(--ds-card)",
              border: "1px solid var(--ds-border)",
            }}
          >
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--ds-foreground)" }}
              >
                All transactions processed
              </p>
              <p
                className="mt-0.5 feature-text"
                style={{ color: "var(--ds-muted-foreground)" }}
              >
                No pending transactions at this time. You can review the full
                transaction ledger on the Transactions page.
              </p>
            </div>
            <Link
              href="/admin/transactions"
              className="flex shrink-0 items-center gap-1 rounded-full px-6 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{
                background: "var(--ds-primary)",
                color: "var(--ds-primary-fg)",
              }}
            >
              View all
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
