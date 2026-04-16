import HeaderBox from "@/components/HeaderBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { Bell, CheckCircle2, Lock, RefreshCw } from "lucide-react";
import { redirect } from "next/navigation";

// ── Notification category tabs (static for now) ───────────────────────────────
const CATEGORIES = ["All", "Transactions", "Security", "Account"] as const;

// ── Empty state per category ───────────────────────────────────────────────────
const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; message: string; sub: string }
> = {
  All: {
    icon: <Bell size={28} className="text-gray-400" />,
    message: "You're all caught up",
    sub: "New alerts about your account activity will appear here.",
  },
  Transactions: {
    icon: <RefreshCw size={28} className="text-gray-400" />,
    message: "No transaction alerts",
    sub: "Credits, debits, and transfer confirmations will appear here.",
  },
  Security: {
    icon: <Lock size={28} className="text-gray-400" />,
    message: "No security alerts",
    sub: "Password changes, new device sign-ins, and suspicious activity warnings will appear here.",
  },
  Account: {
    icon: <CheckCircle2 size={28} className="text-gray-400" />,
    message: "No account updates",
    sub: "Account status changes, limit updates, and system notices will appear here.",
  },
};

const NotificationsPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  return (
    <section className="flex flex-col gap-6 px-5 py-7 md:px-8 xl:max-h-screen xl:overflow-y-scroll">
      <div className="flex items-start justify-between">
        <HeaderBox
          title="Notifications"
          subtext="Stay informed about your account activity."
        />
      </div>

      {/* Category tabs */}
      <NotificationTabs />
    </section>
  );
};

// Client wrapper isn't needed yet — tabs are static with no data.
// When a notifications model is added, convert this to a client component
// and fetch per-category from a server action.
function NotificationTabs() {
  // Default to "All" tab (active state is static for now)
  const activeCategory = "All";
  const meta = CATEGORY_META[activeCategory];

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-100 bg-gray-50 p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`
              flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-13 font-medium transition-colors
              ${cat === activeCategory
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {meta.icon}
        </div>
        <div>
          <p className="text-16 font-semibold text-gray-700">{meta.message}</p>
          <p className="mt-1 max-w-xs text-13 text-gray-400">{meta.sub}</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
