import { FadeIn } from "@/components/ui/fade-in";
import { CheckCircle2, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

const features = [
  "Zero-fee internal transfers, instantly settled",
  "Full transaction history with real-time updates",
  "Role-based access — user and admin flows",
  "Atomic balance operations, never a drift",
];

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen w-full font-inter">

      {/* ── Form side ── */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        {/* Form content */}
        <div className="relative z-10 w-full max-w-[420px]">
          {children}
        </div>
      </div>

      {/* ── Visual side ── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-14">

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark glassmorphic overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* ── Floating UI cards ── */}

        {/* Balance card — top right */}
        <div
          className="absolute right-10 top-24 w-56 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl auth-float-slow"
          style={{ animationDelay: "0s" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Total Balance</p>
          <p className="mt-1 text-2xl font-bold text-white">$84,291.40</p>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400/20">
              <ArrowUpRight size={11} className="text-green-400" />
            </div>
            <span className="text-[11px] text-green-400 font-medium">+2.4% this month</span>
          </div>
        </div>

        {/* Transaction notification — middle right */}
        <div
          className="absolute right-6 top-[46%] w-64 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl auth-float-mid"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/30">
              <Zap size={15} className="text-blue-300" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">Transfer Complete</p>
              <p className="text-[10px] text-white/50">Wire · $12,500.00 · Just now</p>
            </div>
          </div>
        </div>

        {/* Security badge — bottom right */}
        <div
          className="absolute bottom-28 right-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl auth-float-fast"
        >
          <ShieldCheck size={18} className="text-green-400 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-white">256-bit SSL Encrypted</p>
            <p className="text-[10px] text-white/50">Bank-grade security</p>
          </div>
        </div>

        {/* ── Text content (relative, above overlay) ── */}
        <div className="relative z-10 flex flex-col justify-between h-full">

          {/* Top badge */}
          <FadeIn delay={0}>
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-sm">
              Gainsburry Capital Bank
            </span>
          </FadeIn>

          {/* Centre headline */}
          <div className="space-y-6">
            <FadeIn delay={80}>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
                Your money.<br />
                Your <em className="font-serif font-normal not-italic text-white/80">ledger.</em>
              </h2>
            </FadeIn>

            <FadeIn delay={160}>
              <p className="text-sm leading-relaxed text-white/60 max-w-xs">
                A fully internal banking platform — no third-party processors,
                no Plaid, no Dwolla. Every transaction lives on your own ledger.
              </p>
            </FadeIn>

            <ul className="mt-2 space-y-3">
              {features.map((item, i) => (
                <FadeIn key={item} delay={240 + i * 50}>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    <span className="text-sm text-white/80">{item}</span>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>

          {/* Bottom stat row */}
          <FadeIn delay={500}>
            <dl className="grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-6">
              {[
                { stat: "100%", label: "In-house ledger" },
                { stat: "0 fees", label: "Internal transfers" },
                { stat: "JWT", label: "httpOnly auth" },
              ].map((s) => (
                <div key={s.stat} className="px-5 first:pl-0 last:pr-0">
                  <dt className="text-xl font-bold text-white">{s.stat}</dt>
                  <dd className="mt-0.5 text-xs text-white/50">{s.label}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
