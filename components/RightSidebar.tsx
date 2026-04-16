import Link from "next/link";
import { Send } from "lucide-react";
import BankCard from "./BankCard";
import { formatAmount } from "@/lib/utils";

const RightSidebar = ({ user, transactions, account, card }: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      {/* Profile banner */}
      <section className="flex flex-col">
        <div className="h-[80px] w-full" style={{ background: "var(--ds-muted)" }} />
        <div className="relative flex px-6">
          {/* Avatar */}
          <div
            className="absolute -top-7 flex h-[56px] w-[56px] items-center justify-center rounded-full border-4 border-white text-20 font-semibold"
            style={{ background: "var(--ds-primary)", color: "var(--ds-primary-fg)" }}
          >
            {user.firstName[0]}
          </div>
          <div className="flex flex-col pt-12 pb-6">
            <p className="text-16 font-semibold" style={{ color: "var(--ds-foreground)" }}>
              {user.firstName} {user.lastName}
            </p>
            <p className="text-12" style={{ color: "var(--ds-muted-foreground)" }}>
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Card section */}
      <section className="flex flex-col gap-6 px-6 pb-6 border-t" style={{ borderColor: "var(--ds-border)" }}>
        <div className="flex items-center justify-between pt-6">
          <span className="eyebrow">My Account</span>
          <Link
            href="/payment-transfer"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-12 font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
          >
            <Send size={12} />
            Send Money
          </Link>
        </div>

        {account ? (
          <div className="flex flex-col items-center">
            <BankCard
              account={account}
              card={card}
              userName={`${user.firstName} ${user.lastName}`}
              showBalance={true}
            />
          </div>
        ) : (
          <p className="text-14 py-4" style={{ color: "var(--ds-muted-foreground)" }}>
            No account found.
          </p>
        )}
      </section>

      {/* Recent activity */}
      <section className="flex flex-col gap-4 px-6 pb-8 border-t" style={{ borderColor: "var(--ds-border)" }}>
        <div className="pt-6">
          <span className="eyebrow">Recent Activity</span>
        </div>

        {transactions.length === 0 ? (
          <p className="text-14" style={{ color: "var(--ds-muted-foreground)" }}>
            No transactions yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.slice(0, 5).map((t) => {
              const isCredit = t.type === "credit";
              return (
                <div
                  key={t._id}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{ background: "var(--ds-muted)" }}
                >
                  <span className="text-14 capitalize" style={{ color: "var(--ds-foreground)" }}>
                    {t.type}
                  </span>
                  <span
                    className={`text-14 font-semibold ${isCredit ? "text-green-600" : "text-red-600"}`}
                  >
                    {isCredit ? "+" : "-"}{formatAmount(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
