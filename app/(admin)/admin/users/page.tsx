import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllUsers } from "@/lib/actions/admin.actions";
import { blockUser, unblockUser } from "@/lib/actions/admin.actions";
import { formatDateTime } from "@/lib/utils";
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

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "active" | "blocked" | "pending" }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    blocked: "bg-red-50 text-red-700 ring-1 ring-red-200",
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
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

// ─── Block / Unblock Form (Server Action) ──────────────────────────────────────
async function BlockUserForm({
  userId,
  adminId,
  currentStatus,
}: {
  userId: string;
  adminId: string;
  currentStatus: "active" | "blocked" | "pending";
}) {
  async function handleToggle(formData: FormData) {
    "use server";
    const uid = formData.get("userId") as string;
    const aid = formData.get("adminId") as string;
    const status = formData.get("currentStatus") as string;

    if (status === "blocked") {
      await unblockUser(uid, aid);
    } else {
      await blockUser(uid, aid, "Blocked by admin");
    }

    redirect("/admin/users");
  }

  const isBlocked = currentStatus === "blocked";

  return (
    <form action={handleToggle}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="adminId" value={adminId} />
      <input type="hidden" name="currentStatus" value={currentStatus} />
      <button
        type="submit"
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          isBlocked
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200"
            : "bg-red-50 text-red-700 hover:bg-red-100 ring-1 ring-red-200"
        }`}
      >
        {isBlocked ? "Unblock" : "Block"}
      </button>
    </form>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    redirect("/sign-in");
  }

  const page = Number(searchParams.page ?? "1");
  const search = searchParams.search ?? "";
  const statusFilter = searchParams.status ?? "";

  const { users, total, totalPages } = await getAllUsers(page, {
    search: search || undefined,
    status: statusFilter || undefined,
  });

  // ─── Status filter tabs
  const tabs = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
  ];

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams();
    if (search) base.set("search", search);
    if (statusFilter) base.set("status", statusFilter);
    base.set("page", "1");
    Object.entries(params).forEach(([k, v]) => {
      if (v === "") base.delete(k);
      else base.set(k, v);
    });
    return `/admin/users?${base.toString()}`;
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--ds-background)" }}>
      {/* ── Page header ── */}
      <div
        className="border-b"
        style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-10">
          <FadeIn>
            <span className="eyebrow mb-2">User Management</span>
            <h2 className="ds mt-2">
              All <em>Users</em>
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
              {total} total {total === 1 ? "user" : "users"} registered
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* ── Search + Filter ── */}
        <FadeIn delay={60}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <form method="GET" action="/admin/users" className="flex gap-2">
              {statusFilter && (
                <input type="hidden" name="status" value={statusFilter} />
              )}
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email…"
                className="h-10 w-full min-w-[240px] rounded-full border px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-black/10"
                style={{
                  borderColor: "var(--ds-border)",
                  background: "var(--ds-background)",
                  color: "var(--ds-foreground)",
                }}
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-full px-6 text-sm font-medium transition-colors"
                style={{
                  background: "var(--ds-primary)",
                  color: "var(--ds-primary-fg)",
                }}
              >
                Search
              </button>
              {search && (
                <Link
                  href={buildUrl({ search: "" })}
                  className="inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors hover:bg-gray-50"
                  style={{ borderColor: "var(--ds-border)", color: "var(--ds-muted-foreground)" }}
                >
                  Clear
                </Link>
              )}
            </form>

            {/* Status tabs */}
            <div
              className="flex items-center gap-1 rounded-full border p-1"
              style={{ borderColor: "var(--ds-border)", background: "var(--ds-muted)" }}
            >
              {tabs.map((tab) => {
                const active = tab.value === statusFilter;
                return (
                  <Link
                    key={tab.value}
                    href={buildUrl({ status: tab.value })}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      active
                        ? "shadow-sm"
                        : "hover:bg-white/60"
                    }`}
                    style={
                      active
                        ? { background: "var(--ds-background)", color: "var(--ds-foreground)" }
                        : { color: "var(--ds-muted-foreground)" }
                    }
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* ── Table Card ── */}
        <FadeIn delay={120}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
          >
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-medium" style={{ color: "var(--ds-foreground)" }}>
                  No users found
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
                  {search
                    ? `No results for "${search}"`
                    : "There are no users matching the selected filter."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "var(--ds-border)" }}>
                    <TableHead className="pl-6 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ds-muted-foreground)" }}>Name</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ds-muted-foreground)" }}>Email</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ds-muted-foreground)" }}>Status</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ds-muted-foreground)" }}>Joined</TableHead>
                    <TableHead className="pr-6 text-right font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ds-muted-foreground)" }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow
                      key={user._id}
                      style={{ borderColor: "var(--ds-border)" }}
                      className="group"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          {/* Avatar initials */}
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                            style={{
                              background: "var(--ds-muted)",
                              color: "var(--ds-foreground)",
                            }}
                          >
                            {user.firstName?.[0]?.toUpperCase()}
                            {user.lastName?.[0]?.toUpperCase()}
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--ds-foreground)" }}
                          >
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
                          {user.email}
                        </span>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>

                      <TableCell>
                        <span className="text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
                          {user.createdAt
                            ? formatDateTime(new Date(user.createdAt)).dateOnly
                            : "—"}
                        </span>
                      </TableCell>

                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-50"
                            style={{
                              borderColor: "var(--ds-border)",
                              color: "var(--ds-foreground)",
                            }}
                          >
                            View
                          </Link>
                          <BlockUserForm
                            userId={user._id}
                            adminId={session.userId}
                            currentStatus={user.status}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </FadeIn>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <FadeIn delay={160}>
            <div className="py-2">
              <Pagination page={page} totalPages={totalPages} />
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
