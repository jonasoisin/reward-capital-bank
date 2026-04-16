import { FadeIn } from "@/components/ui/fade-in";
import { CheckCircle2 } from "lucide-react";

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
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        {children}
      </div>

      {/* ── Visual side ── */}
      <div
        className="canvas-grid relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden border-l p-14"
        style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
      >
        {/* Top badge */}
        <FadeIn delay={0}>
          <span className="eyebrow">Internal banking platform</span>
        </FadeIn>

        {/* Centre headline */}
        <div className="space-y-6">
          <FadeIn delay={80}>
            <h2
              className="ds"
              style={{ color: "var(--ds-foreground)" }}
            >
              Your money.
              <br />
              Your <em>ledger.</em>
            </h2>
          </FadeIn>

          <FadeIn delay={160}>
            <p
              className="feature-text prose-width-sm"
              style={{ color: "var(--ds-muted-foreground)" }}
            >
              A fully internal banking platform — no third-party processors,
              no Plaid, no Dwolla. Every transaction lives on your own ledger.
            </p>
          </FadeIn>

          {/* Feature bullets */}
          <ul className="mt-8 space-y-3">
            {features.map((item, i) => (
              <FadeIn key={item} delay={240 + i * 40}>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: "var(--ds-primary)" }}
                  />
                  <span
                    className="feature-text"
                    style={{ color: "var(--ds-foreground)" }}
                  >
                    {item}
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>

        {/* Bottom stat row */}
        <FadeIn delay={480}>
          <dl
            className="grid grid-cols-3 divide-x"
            style={{ borderColor: "var(--ds-border)" }}
          >
            {[
              { stat: "100%", label: "In-house ledger" },
              { stat: "0 fees", label: "Internal transfers" },
              { stat: "JWT", label: "httpOnly auth" },
            ].map((s) => (
              <div key={s.stat} className="px-6 first:pl-0 last:pr-0">
                <dt
                  className="stat-number"
                  style={{ color: "var(--ds-foreground)" }}
                >
                  {s.stat}
                </dt>
                <dd
                  className="mt-1 feature-text"
                  style={{ color: "var(--ds-muted-foreground)" }}
                >
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
