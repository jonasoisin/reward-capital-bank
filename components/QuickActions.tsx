import Link from "next/link";
import { ArrowLeftRight, CreditCard, Send, Users } from "lucide-react";

const ACTIONS = [
  {
    href: "/payment-transfer",
    icon: Send,
    label: "Send Money",
    desc: "Transfer funds",
  },
  {
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    label: "History",
    desc: "View transactions",
  },
  {
    href: "/my-banks",
    icon: CreditCard,
    label: "My Card",
    desc: "Manage card",
  },
  {
    href: "/recipients",
    icon: Users,
    label: "Recipients",
    desc: "Saved contacts",
  },
] as const;

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <span className="eyebrow">Quick actions</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--ds-border)", background: "var(--ds-card)" }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "var(--ds-muted)" }}
            >
              <Icon size={16} style={{ color: "var(--ds-foreground)" }} />
            </div>
            <div className="text-center">
              <p className="text-14 font-semibold" style={{ color: "var(--ds-foreground)" }}>
                {label}
              </p>
              <p className="text-12" style={{ color: "var(--ds-muted-foreground)" }}>
                {desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
