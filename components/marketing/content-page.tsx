import { FadeIn } from "./fade-in";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children: React.ReactNode;
}

export function ContentPage({
  eyebrow, title, subtitle, imageUrl, imageAlt,
  ctaHref, ctaLabel, secondaryHref, secondaryLabel, children,
}: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Glassmorphic overlay — blurs + darkens the image */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-28">
          <FadeIn>
            <div className="inline-block max-w-3xl rounded-2xl border border-white/15 bg-white/5 px-8 py-10 shadow-[0_8px_64px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <span className="eyebrow text-white/60">{eyebrow}</span>
              <h1 className="ds text-white mt-3">{title}</h1>
              {subtitle && (
                <p className="mt-4 feature-text text-white prose-width">{subtitle}</p>
              )}
              {(ctaHref || secondaryHref) && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {ctaHref && ctaLabel && (
                    <Link
                      href={ctaHref}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
                    >
                      {ctaLabel} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {secondaryHref && secondaryLabel && (
                    <Link
                      href={secondaryHref}
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                    >
                      {secondaryLabel}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        {children}
      </div>
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────────────────────────── */

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 space-y-2">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="ds text-foreground">{title}</h2>
      {subtitle && <p className="feature-text text-muted-foreground prose-width">{subtitle}</p>}
    </div>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function RateTable({ headers, rows, note }: {
  headers: string[];
  rows: string[][];
  note?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-muted/30 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-3 text-muted-foreground ${ci === 0 ? "font-medium text-foreground" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
