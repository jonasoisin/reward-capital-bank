"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();

      if (result.error) { setError(result.error); return; }
      if (result.redirectTo !== "/admin/dashboard") {
        setError("Not authorised. Admin access only.");
        return;
      }
      window.location.href = "/admin/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="flex min-h-screen w-full"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* ── Form side (left) ── */}
      <div
        className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12"
        style={{ background: "var(--ds-background)" }}
      >
        <div className="w-full max-w-sm">
          <FadeIn delay={0} direction="up">
            <span className="eyebrow">Admin Access</span>
          </FadeIn>

          <FadeIn delay={80} direction="up">
            <h1
              className="ds mt-4"
              style={{ color: "var(--ds-foreground)" }}
            >
              Sign in to your <em>admin</em> console.
            </h1>
          </FadeIn>

          <FadeIn delay={160} direction="up">
            <p
              className="mt-3 feature-text"
              style={{ color: "var(--ds-muted-foreground)" }}
            >
              Restricted access. Authorised personnel only.
            </p>
          </FadeIn>

          <FadeIn delay={220} direction="up">
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                  style={{ color: "var(--ds-foreground)" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
                  style={{
                    border: "1px solid var(--ds-border)",
                    background: "var(--ds-background)",
                    color: "var(--ds-foreground)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid var(--ds-foreground)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid var(--ds-border)";
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: "var(--ds-foreground)" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
                  style={{
                    border: "1px solid var(--ds-border)",
                    background: "var(--ds-background)",
                    color: "var(--ds-foreground)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid var(--ds-foreground)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid var(--ds-border)";
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  className="rounded-lg px-4 py-3 text-sm"
                  style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-full px-8 py-2.5 text-sm font-semibold transition-opacity"
                style={{
                  background: "var(--ds-primary)",
                  color: "var(--ds-primary-fg)",
                  opacity: loading ? 0.65 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>

      {/* ── Visual side (right) ── */}
      <div
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-14"
        style={{ background: "#0a0a0a" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top badge */}
        <FadeIn delay={0}>
          <span
            className="relative z-10 inline-block text-xs tracking-widest uppercase"
            style={{
              fontFamily: "ui-monospace, monospace",
              color: "#525252",
              letterSpacing: "0.12em",
            }}
          >
            Banking Platform
          </span>
        </FadeIn>

        {/* Centre content */}
        <div className="relative z-10 space-y-6">
          <FadeIn delay={100}>
            <div
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "#1c1c1c" }}
            >
              <ShieldCheck size={22} style={{ color: "#a3a3a3" }} strokeWidth={1.5} />
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <h2
              className="ds"
              style={{ color: "#fafafa", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 550, letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Full control.
              <br />
              Zero <em style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>compromise.</em>
            </h2>
          </FadeIn>

          <FadeIn delay={240}>
            <p
              className="feature-text prose-width-sm"
              style={{ color: "#737373" }}
            >
              Manage users, review transactions, audit every action.
              The admin console gives you complete visibility over the entire banking platform.
            </p>
          </FadeIn>

          {/* Feature list */}
          <ul className="mt-8 space-y-3">
            {[
              "Real-time dashboard stats across all accounts",
              "Block, unblock or audit any user instantly",
              "Full transaction ledger with status filters",
              "Immutable admin action log for compliance",
            ].map((item, i) => (
              <FadeIn key={item} delay={320 + i * 50}>
                <li className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "#525252" }}
                  />
                  <span className="feature-text" style={{ color: "#737373" }}>
                    {item}
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>

        {/* Bottom stat row */}
        <FadeIn delay={520}>
          <dl
            className="relative z-10 grid grid-cols-3 divide-x"
            style={{ borderColor: "#1c1c1c" }}
          >
            {[
              { stat: "Live", label: "Real-time stats" },
              { stat: "Audit", label: "Every action logged" },
              { stat: "JWT", label: "Role-secured access" },
            ].map((s) => (
              <div key={s.stat} className="px-6 first:pl-0 last:pr-0">
                <dt
                  className="stat-number"
                  style={{ color: "#fafafa", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                >
                  {s.stat}
                </dt>
                <dd className="mt-1 feature-text" style={{ color: "#525252" }}>
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </main>
  );
}
