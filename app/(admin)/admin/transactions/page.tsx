import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getAllTransactions } from "@/lib/actions/transaction.actions";
import { formatAmount, formatDateTime } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { Pagination } from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionActions } from "./TransactionActions";

// ── Types ──────────────────────────────────────────────────────────────────
type PopulatedUser = { firstName: string; lastName: string; email: string };

type Transaction = {
  _id: string;
  type: "transfer" | "credit" | "debit";
  senderId?: string | PopulatedUser;
  receiverId: string | PopulatedUser;
  amount: number;
  note?: string;
  status: "pending" | "approved" | "rejected" | "completed" | "blocked";
  initiatedBy: "user" | "admin";
  createdAt: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────
function resolveDisplayName(
  field: string | PopulatedUser | undefined,
  fallback = "—"
): string {
  if (!field) return fallback;
  if (typeof field === "object" && "firstName" in field) {
    return `${field.firstName} ${field.lastName}`;
  }
  return fallback;
}

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-200",
  completed:
    "bg-emerald-100 text-emerald-800 border border-emerald-200",
  approved:
    "bg-blue-100 text-blue-800 border border-blue-200",
  rejected:
    "bg-red-100 text-red-700 border border-red-200",
  blocked:
    "bg-zinc-100 text-zinc-600 border border-zinc-200",
};

const TYPE_LABEL: Record<string, string> = {
  transfer: "Transfer",
  credit: "Credit",
  debit: "Debit",
};

// ── Filter bar links ───────────────────────────────────────────────────────
const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Blocked", value: "blocked" },
];

const TYPE_TABS = [
  { label: "All Types", value: "" },
  { label: "Transfer", value: "transfer" },
  { label: "Credit", value: "credit" },
  { label: "Debit", value: "debit" },
];

function buildHref(
  current: Record<string, string>,
  key: string,
  value: string
) {
  const next: Record<string, string | undefined> = { ...current, [key]: value, page: "1" };
  if (!next[key]) delete next[key];
  if (next.page === "1") delete next.page;
  const filtered = Object.fromEntries(
    Object.entries(next).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;
  const qs = new URLSearchParams(filtered).toString();
  return `/admin/transactions${qs ? `?${qs}` : ""}`;
}

// ── Page ───────────────────────────────────────────────────────────────────
interface PageProps {
  searchParams: {
    page?: string;
    status?: string;
    type?: string;
  };
}

export default async function AdminTransactionsPage({
  searchParams,
}: PageProps) {
  const session = getSessionUser();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const status = searchParams.status ?? "";
  const type = searchParams.type ?? "";

  const { transactions, totalPages } = await getAllTransactions(page, {
    ...(status && { status }),
    ...(type && { type }),
  });

  const currentParams: Record<string, string> = {
    ...(status && { status }),
    ...(type && { type }),
    ...(page > 1 && { page: String(page) }),
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--ds-background)" }}>
      {/* ── Header ── */}
      <div
        className="px-8 pt-10 pb-8 border-b"
        style={{ borderColor: "var(--ds-border)" }}
      >
        <FadeIn direction="up">
          <span className="eyebrow mb-3">Transactions</span>
          <h2 className="ds">
            All <em>transactions.</em>
          </h2>
          <p
            className="mt-2 feature-text"
            style={{ color: "var(--ds-muted-foreground)" }}
          >
            Review, approve, reject or block any transaction across the platform.
          </p>
        </FadeIn>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* ── Filters ── */}
        <FadeIn direction="up" delay={60}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-1.5">
              {STATUS_TABS.map((tab) => {
                const active = status === tab.value;
                return (
                  <Link
                    key={tab.value}
                    href={buildHref(currentParams, "status", tab.value)}
                    className={[
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      active
                        ? "text-[var(--ds-primary-fg)]"
                        : "hover:opacity-80",
                    ].join(" ")}
                    style={
                      active
                        ? { background: "var(--ds-primary)", color: "var(--ds-primary-fg)" }
                        : {
                            background: "var(--ds-muted)",
                            color: "var(--ds-foreground)",
                          }
                    }
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-1.5">
              {TYPE_TABS.map((tab) => {
                const active = type === tab.value;
                return (
                  <Link
                    key={tab.value}
                    href={buildHref(currentParams, "type", tab.value)}
                    className={[
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      active ? "" : "hover:opacity-80",
                    ].join(" ")}
                    style={
                      active
                        ? { background: "var(--ds-foreground)", color: "var(--ds-primary-fg)" }
                        : {
                            background: "var(--ds-muted)",
                            color: "var(--ds-muted-foreground)",
                          }
                    }
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* ── Table ── */}
        <FadeIn direction="up" delay={100}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: "var(--ds-border)",
              background: "var(--ds-background)",
            }}
          >
            <Table>
              <TableHeader>
                <TableRow
                  style={{ borderColor: "var(--ds-border)" }}
                  className="hover:bg-transparent"
                >
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Date
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Type
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    From
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    To
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Amount
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Initiated By
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="py-16 text-center text-sm"
                      style={{ color: "var(--ds-muted-foreground)" }}
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn: Transaction) => {
                    const fromName =
                      txn.initiatedBy === "admin"
                        ? "Admin"
                        : resolveDisplayName(txn.senderId);

                    const toName = resolveDisplayName(txn.receiverId);

                    const { dateTime } = formatDateTime(
                      new Date(txn.createdAt) as unknown as Date
                    );

                    const badgeClass =
                      STATUS_STYLES[txn.status] ?? STATUS_STYLES.blocked;

                    return (
                      <TableRow
                        key={txn._id}
                        className="text-sm"
                        style={{ borderColor: "var(--ds-border)" }}
                      >
                        {/* Date */}
                        <TableCell
                          className="py-3 whitespace-nowrap text-xs"
                          style={{ color: "var(--ds-muted-foreground)" }}
                        >
                          {dateTime}
                        </TableCell>

                        {/* Type */}
                        <TableCell className="py-3">
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--ds-foreground)" }}
                          >
                            {TYPE_LABEL[txn.type] ?? txn.type}
                          </span>
                        </TableCell>

                        {/* From */}
                        <TableCell
                          className="py-3 text-xs"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          {fromName}
                        </TableCell>

                        {/* To */}
                        <TableCell
                          className="py-3 text-xs"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          {toName}
                        </TableCell>

                        {/* Amount */}
                        <TableCell
                          className="py-3 text-xs font-semibold tabular-nums"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          {formatAmount(txn.amount)}
                        </TableCell>

                        {/* Status badge */}
                        <TableCell className="py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${badgeClass}`}
                          >
                            {txn.status}
                          </span>
                        </TableCell>

                        {/* Initiated By */}
                        <TableCell className="py-3">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                            style={{
                              background:
                                txn.initiatedBy === "admin"
                                  ? "var(--ds-foreground)"
                                  : "var(--ds-muted)",
                              color:
                                txn.initiatedBy === "admin"
                                  ? "var(--ds-primary-fg)"
                                  : "var(--ds-muted-foreground)",
                            }}
                          >
                            {txn.initiatedBy}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3">
                          <TransactionActions
                            transactionId={txn._id}
                            status={txn.status}
                            adminId={session.userId}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </FadeIn>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <FadeIn direction="up" delay={140}>
            <Pagination page={page} totalPages={totalPages} />
          </FadeIn>
        )}
      </div>
    </div>
  );
}
