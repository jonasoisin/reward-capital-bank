import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/actions/admin.actions";
import { formatAmount, formatAccountNumber, formatDateTime } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import UserActionPanel from "./UserActionPanel";

// ─── Status badge helpers ──────────────────────────────────────────────────────
function UserStatusBadge({ status }: { status: "active" | "blocked" | "pending" }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    blocked: "bg-red-50 text-red-700 ring-1 ring-red-200",
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          status === "active"
            ? "bg-emerald-500"
            : status === "blocked"
            ? "bg-red-500"
            : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

function AccountStatusBadge({
  status,
}: {
  status: "active" | "frozen" | "closed";
}) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    frozen: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    closed: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-3 border-b last:border-b-0"
      style={{ borderColor: "var(--ds-border)" }}
    >
      <span
        className="text-xs font-medium uppercase tracking-wide shrink-0"
        style={{ color: "var(--ds-muted-foreground)" }}
      >
        {label}
      </span>
      <span
        className="text-sm text-right"
        style={{ color: value ? "var(--ds-foreground)" : "var(--ds-muted-foreground)" }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
interface PageProps {
  params: { userId: string };
}

export default async function UserDetailPage({ params }: PageProps) {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    redirect("/sign-in");
  }

  const data = await getUserById(params.userId);

  if (!data) {
    notFound();
  }

  const { user, account } = data as { user: User; account: BankAccount | null };

  return (
    <main className="min-h-screen" style={{ background: "var(--ds-background)" }}>
      {/* ── Page header ── */}
      <div
        className="border-b"
        style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-10">
          <FadeIn>
            {/* Back link */}
            <Link
              href="/admin/users"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-70"
              style={{ color: "var(--ds-muted-foreground)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Users
            </Link>

            <span className="eyebrow mt-4 mb-2 block">User Detail</span>

            <div className="flex flex-wrap items-center gap-4">
              {/* Avatar */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold"
                style={{
                  background: "var(--ds-muted)",
                  color: "var(--ds-foreground)",
                }}
              >
                {user.firstName?.[0]?.toUpperCase()}
                {user.lastName?.[0]?.toUpperCase()}
              </div>

              <div>
                <h2 className="ds">
                  {user.firstName} <em>{user.lastName}</em>
                </h2>
                <p
                  className="mt-0.5 text-sm"
                  style={{ color: "var(--ds-muted-foreground)" }}
                >
                  {user.email}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <UserStatusBadge status={user.status} />
                {account && <AccountStatusBadge status={account.status} />}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ── Left: Info cards ── */}
          <div className="space-y-6">
            {/* User info */}
            <FadeIn delay={60}>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
              >
                {/* Card header */}
                <div
                  className="border-b px-6 py-4"
                  style={{ borderColor: "var(--ds-border)" }}
                >
                  <h3 className="ds" style={{ fontSize: "1rem" }}>
                    Personal Information
                  </h3>
                </div>

                {/* Card content */}
                <div className="px-6 py-2">
                  <InfoRow
                    label="Full Name"
                    value={`${user.firstName} ${user.lastName}`}
                  />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Phone" value={user.phone} />
                  <InfoRow label="Address" value={user.address} />
                  <InfoRow
                    label="Date of Birth"
                    value={
                      user.dateOfBirth
                        ? formatDateTime(new Date(user.dateOfBirth)).dateOnly
                        : undefined
                    }
                  />
                  <InfoRow label="Role" value={user.role} />
                  <InfoRow label="Status" value={user.status} />
                  <InfoRow
                    label="Member Since"
                    value={
                      user.createdAt
                        ? formatDateTime(new Date(user.createdAt)).dateOnly
                        : undefined
                    }
                  />
                </div>
              </div>
            </FadeIn>

            {/* Account info */}
            <FadeIn delay={120}>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
              >
                <div
                  className="border-b px-6 py-4"
                  style={{ borderColor: "var(--ds-border)" }}
                >
                  <h3 className="ds" style={{ fontSize: "1rem" }}>
                    Bank Account
                  </h3>
                </div>

                {account ? (
                  <div className="px-6 py-2">
                    <InfoRow
                      label="Account Number"
                      value={formatAccountNumber(account.accountNumber)}
                    />
                    <InfoRow label="Currency" value={account.currency} />
                    <InfoRow label="Status" value={account.status} />
                    <InfoRow
                      label="Balance"
                      value={formatAmount(account.balance)}
                    />
                    <InfoRow
                      label="Opened"
                      value={
                        account.createdAt
                          ? formatDateTime(new Date(account.createdAt)).dateOnly
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p
                      className="text-sm"
                      style={{ color: "var(--ds-muted-foreground)" }}
                    >
                      No bank account found for this user.
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Balance highlight */}
            {account && (
              <FadeIn delay={160}>
                <div
                  className="rounded-2xl border px-6 py-6 canvas-grid"
                  style={{ borderColor: "var(--ds-border)" }}
                >
                  <span className="eyebrow mb-1">Current Balance</span>
                  <p
                    className="stat-number mt-2"
                    style={{ color: "var(--ds-foreground)" }}
                  >
                    {formatAmount(account.balance)}
                  </p>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    {account.currency} · {account.status}
                  </p>
                </div>
              </FadeIn>
            )}
          </div>

          {/* ── Right: Action panel ── */}
          <div>
            <FadeIn delay={80} direction="left">
              <div
                className="rounded-2xl border overflow-hidden sticky top-6"
                style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
              >
                <div
                  className="border-b px-6 py-4"
                  style={{ borderColor: "var(--ds-border)" }}
                >
                  <h3 className="ds" style={{ fontSize: "1rem" }}>
                    Admin <em>Actions</em>
                  </h3>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--ds-muted-foreground)" }}
                  >
                    All actions are logged and reversible.
                  </p>
                </div>

                <div className="p-5">
                  <UserActionPanel
                    user={user}
                    account={account}
                    adminId={session.userId}
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
