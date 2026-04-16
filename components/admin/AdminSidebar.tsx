"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ArrowLeftRight, ScrollText, CreditCard, LogOut } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
];

interface AdminSidebarProps {
  adminName: string;
}

export default function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/sign-in";
  }

  return (
    <aside
      className="fixed left-0 top-0 flex h-screen w-64 flex-col justify-between py-8 px-4 z-40"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Top: brand + nav ── */}
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="px-3">
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: "#fafafa", letterSpacing: "-0.02em" }}
          >
            Banking <span style={{ color: "#737373" }}>Admin</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                style={{
                  background: active ? "#1c1c1c" : "transparent",
                  color: active ? "#fafafa" : "#737373",
                }}
              >
                <Icon size={16} strokeWidth={1.75} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom: admin info + logout ── */}
      <div className="flex flex-col gap-4">
        {/* Admin name */}
        <div className="px-3">
          <p className="text-xs" style={{ color: "#525252", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "ui-monospace, monospace" }}>
            Signed in as
          </p>
          <p className="mt-1 text-sm font-medium truncate" style={{ color: "#a3a3a3" }}>
            {adminName}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors w-full text-left"
          style={{ color: "#737373" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1c1c1c";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#737373";
          }}
        >
          <LogOut size={16} strokeWidth={1.75} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
