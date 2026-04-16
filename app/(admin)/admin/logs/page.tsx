import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAdminLogs } from "@/lib/actions/admin.actions";
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

// ── Types ──────────────────────────────────────────────────────────────────
type PopulatedUser = { firstName: string; lastName: string; email: string };

type AdminLog = {
  _id: string;
  adminId: string | PopulatedUser;
  action:
    | "credit"
    | "debit"
    | "block_account"
    | "unblock_account"
    | "block_transaction"
    | "approve_transaction"
    | "reject_transaction"
    | "send_email";
  targetUserId: string | PopulatedUser;
  amount?: number;
  note: string;
  createdAt: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────
function resolveUser(
  field: string | PopulatedUser | undefined
): string {
  if (!field) return "—";
  if (typeof field === "object" && "firstName" in field) {
    return `${field.firstName} ${field.lastName}`;
  }
  // Truncate raw ID to 8 chars
  if (typeof field === "string") {
    return field.length > 8 ? `${field.slice(0, 8)}…` : field;
  }
  return "—";
}

const ACTION_LABELS: Record<string, string> = {
  credit: "Credited Account",
  debit: "Debited Account",
  block_account: "Blocked Account",
  unblock_account: "Unblocked Account",
  block_transaction: "Blocked Transaction",
  approve_transaction: "Approved Transaction",
  reject_transaction: "Rejected Transaction",
  send_email: "Sent Email",
};

const ACTION_COLORS: Record<string, string> = {
  credit: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  debit: "bg-orange-100 text-orange-800 border border-orange-200",
  block_account: "bg-red-100 text-red-700 border border-red-200",
  unblock_account: "bg-blue-100 text-blue-800 border border-blue-200",
  block_transaction: "bg-zinc-100 text-zinc-700 border border-zinc-200",
  approve_transaction: "bg-blue-100 text-blue-800 border border-blue-200",
  reject_transaction: "bg-red-100 text-red-700 border border-red-200",
  send_email: "bg-violet-100 text-violet-800 border border-violet-200",
};

// ── Page ───────────────────────────────────────────────────────────────────
interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  const session = getSessionUser();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const { logs, totalPages } = await getAdminLogs(page);

  return (
    <div className="min-h-screen" style={{ background: "var(--ds-background)" }}>
      {/* ── Header ── */}
      <div
        className="px-8 pt-10 pb-8 border-b"
        style={{ borderColor: "var(--ds-border)" }}
      >
        <FadeIn direction="up">
          <span className="eyebrow mb-3">Audit Trail</span>
          <h2 className="ds">
            Admin <em>logs.</em>
          </h2>
          <p
            className="mt-2 feature-text"
            style={{ color: "var(--ds-muted-foreground)" }}
          >
            A full chronological record of every administrative action taken on the platform.
          </p>
        </FadeIn>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* ── Summary strip ── */}
        <FadeIn direction="up" delay={60}>
          <div
            className="flex items-center gap-2 text-xs py-2 px-3 rounded-xl"
            style={{
              background: "var(--ds-muted)",
              color: "var(--ds-muted-foreground)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--ds-foreground)" }}
            />
            Read-only. Actions here are recorded automatically when admins perform operations.
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
                    Date / Time
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Admin
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Action
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium py-3"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    Target User
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
                    Note
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={6}
                      className="py-16 text-center text-sm"
                      style={{ color: "var(--ds-muted-foreground)" }}
                    >
                      No admin activity recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: AdminLog) => {
                    const { dateTime } = formatDateTime(
                      new Date(log.createdAt) as unknown as Date
                    );
                    const actionLabel =
                      ACTION_LABELS[log.action] ?? log.action;
                    const badgeClass =
                      ACTION_COLORS[log.action] ??
                      "bg-zinc-100 text-zinc-700 border border-zinc-200";

                    return (
                      <TableRow
                        key={log._id}
                        className="text-sm"
                        style={{ borderColor: "var(--ds-border)" }}
                      >
                        {/* Date / Time */}
                        <TableCell
                          className="py-3 whitespace-nowrap text-xs"
                          style={{ color: "var(--ds-muted-foreground)" }}
                        >
                          {dateTime}
                        </TableCell>

                        {/* Admin */}
                        <TableCell
                          className="py-3 text-xs font-medium"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          {resolveUser(log.adminId)}
                        </TableCell>

                        {/* Action badge */}
                        <TableCell className="py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${badgeClass}`}
                          >
                            {actionLabel}
                          </span>
                        </TableCell>

                        {/* Target User */}
                        <TableCell
                          className="py-3 text-xs"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          {resolveUser(log.targetUserId)}
                        </TableCell>

                        {/* Amount */}
                        <TableCell
                          className="py-3 text-xs tabular-nums"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          {log.amount != null ? formatAmount(log.amount) : "—"}
                        </TableCell>

                        {/* Note */}
                        <TableCell
                          className="py-3 text-xs max-w-[220px] truncate"
                          style={{ color: "var(--ds-muted-foreground)" }}
                          title={log.note}
                        >
                          {log.note || "—"}
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
