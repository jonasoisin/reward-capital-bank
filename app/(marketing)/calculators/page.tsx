"use client";

import { useState } from "react";
import { ContentPage, SectionHeading } from "@/components/marketing/content-page";
import { FadeIn } from "@/components/marketing/fade-in";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function InputRow({ label, value, onChange, prefix, suffix, step = "1" }: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-13 font-medium text-foreground">{label}</label>
      <div className="flex items-center rounded-lg border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
        {prefix && <span className="px-3 py-2.5 text-sm text-muted-foreground border-r border-border bg-muted/30">{prefix}</span>}
        <input
          type="number" value={value} step={step} min="0"
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm text-foreground bg-transparent focus:outline-none"
        />
        {suffix && <span className="px-3 py-2.5 text-sm text-muted-foreground border-l border-border bg-muted/30">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-4 py-3 ${highlight ? "bg-foreground text-primary-foreground" : "bg-muted/40"}`}>
      <span className={`text-sm ${highlight ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
      <span className={`text-sm font-bold ${highlight ? "" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

// ── Loan Calculator ───────────────────────────────────────────────────────────
function LoanCalc() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate]           = useState("6.5");
  const [years, setYears]         = useState("5");

  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;

  const monthly = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total   = monthly * n;
  const interest = total - p;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-foreground">Loan Payment Calculator</h3>
      <InputRow label="Loan Amount"    value={principal} onChange={setPrincipal} prefix="$" />
      <InputRow label="Annual Rate"    value={rate}      onChange={setRate}      suffix="%" step="0.1" />
      <InputRow label="Term"           value={years}     onChange={setYears}     suffix="years" />
      <div className="space-y-2 pt-2">
        <ResultRow label="Monthly Payment"  value={isFinite(monthly) ? fmt(monthly) : "—"} highlight />
        <ResultRow label="Total Paid"       value={isFinite(total) ? fmt(total) : "—"} />
        <ResultRow label="Total Interest"   value={isFinite(interest) ? fmt(interest) : "—"} />
      </div>
    </div>
  );
}

// ── Savings / CD Calculator ───────────────────────────────────────────────────
function SavingsCalc() {
  const [deposit, setDeposit]   = useState("5000");
  const [rate, setRate]         = useState("3.25");
  const [years, setYears]       = useState("2");
  const [monthly, setMonthly]   = useState("0");

  const p  = parseFloat(deposit) || 0;
  const r  = (parseFloat(rate) || 0) / 100;
  const n  = parseFloat(years) || 0;
  const m  = parseFloat(monthly) || 0;

  const future = p * Math.pow(1 + r / 12, n * 12)
    + (m > 0 ? m * ((Math.pow(1 + r / 12, n * 12) - 1) / (r / 12)) : 0);
  const contributed = p + m * n * 12;
  const earned = future - contributed;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-foreground">Savings / CD Calculator</h3>
      <InputRow label="Initial Deposit"      value={deposit} onChange={setDeposit} prefix="$" />
      <InputRow label="Annual Rate (APY)"    value={rate}    onChange={setRate}    suffix="%" step="0.01" />
      <InputRow label="Term"                 value={years}   onChange={setYears}   suffix="years" />
      <InputRow label="Monthly Contribution" value={monthly} onChange={setMonthly} prefix="$" />
      <div className="space-y-2 pt-2">
        <ResultRow label="Future Value"      value={isFinite(future) ? fmt(future) : "—"} highlight />
        <ResultRow label="Total Contributed" value={isFinite(contributed) ? fmt(contributed) : "—"} />
        <ResultRow label="Interest Earned"   value={isFinite(earned) ? fmt(Math.max(0, earned)) : "—"} />
      </div>
    </div>
  );
}

// ── Mortgage Calculator ───────────────────────────────────────────────────────
function MortgageCalc() {
  const [home, setHome]         = useState("250000");
  const [down, setDown]         = useState("50000");
  const [rate, setRate]         = useState("7.0");
  const [years, setYears]       = useState("20");

  const p = (parseFloat(home) || 0) - (parseFloat(down) || 0);
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;

  const monthly = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total   = monthly * n;
  const interest = total - p;
  const downPct = parseFloat(home) > 0 ? ((parseFloat(down) || 0) / parseFloat(home)) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-foreground">Mortgage Calculator</h3>
      <InputRow label="Home Price"       value={home}  onChange={setHome}  prefix="$" />
      <InputRow label="Down Payment"     value={down}  onChange={setDown}  prefix="$" />
      <InputRow label="Annual Rate"      value={rate}  onChange={setRate}  suffix="%" step="0.1" />
      <InputRow label="Term"             value={years} onChange={setYears} suffix="years" />
      <div className="space-y-2 pt-2">
        <ResultRow label="Monthly Payment"  value={isFinite(monthly) && monthly > 0 ? fmt(monthly) : "—"} highlight />
        <ResultRow label="Loan Amount"      value={fmt(Math.max(0, p))} />
        <ResultRow label="Down Payment"     value={`${fmt(parseFloat(down) || 0)} (${downPct.toFixed(1)}%)`} />
        <ResultRow label="Total Interest"   value={isFinite(interest) && interest > 0 ? fmt(interest) : "—"} />
      </div>
    </div>
  );
}

export default function CalculatorsPage() {
  return (
    <ContentPage
      eyebrow="Resources & Tools"
      title={<>Financial <em>Calculators</em></>}
      subtitle="Estimate loan payments, project savings growth, and plan your mortgage — all in one place."
      imageUrl="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Financial planning calculators"
    >
      <FadeIn>
        <SectionHeading eyebrow="Tools" title="Interactive Calculators" />
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-3">
        <FadeIn delay={0}><LoanCalc /></FadeIn>
        <FadeIn delay={80}><SavingsCalc /></FadeIn>
        <FadeIn delay={160}><MortgageCalc /></FadeIn>
      </div>

      <FadeIn delay={200}>
        <p className="mt-6 text-xs text-muted-foreground text-center">
          Results are estimates for illustrative purposes only and do not constitute a loan offer. Actual rates and terms will vary. Contact us for a personalized quote.
        </p>
      </FadeIn>
    </ContentPage>
  );
}
