"use client";

import { useState } from "react";
import { formatCardNumber, maskCardNumber } from "@/lib/utils/luhn";
import { revealCardDetails, freezeCard, unfreezeCard } from "@/lib/actions/card.actions";
import { Eye, EyeOff, Snowflake, Zap, Loader2, Copy, Check } from "lucide-react";

interface RevealedData {
  cardNumber: string;
  cvv: string;
  expiryMonth: number;
  expiryYear: number;
}

const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: "Active",  color: "#16a34a", bg: "#f0fdf4" },
  frozen:  { label: "Frozen",  color: "#2563eb", bg: "#eff6ff" },
  blocked: { label: "Blocked", color: "#dc2626", bg: "#fef2f2" },
  expired: { label: "Expired", color: "#737373", bg: "#f5f5f5" },
};

export default function BankCard({ account, card, userName, showBalance = true }: BankCardProps) {
  const [revealed, setRevealed] = useState<RevealedData | null>(null);
  const [showCvv, setShowCvv] = useState(false);
  const [loading, setLoading] = useState<"reveal" | "freeze" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardStatus, setCardStatus] = useState(card?.status ?? "active");
  const [copied, setCopied] = useState(false);

  const status = statusStyles[cardStatus] ?? statusStyles.active;
  const isLocked = cardStatus === "blocked" || cardStatus === "expired";

  async function handleReveal() {
    if (revealed) {
      setRevealed(null);
      setShowCvv(false);
      return;
    }
    setLoading("reveal");
    setError(null);
    const result = await revealCardDetails();
    setLoading(null);
    if ("error" in result) { setError(result.error); return; }
    setRevealed(result);
  }

  async function handleFreeze() {
    if (isLocked) return;
    setLoading("freeze");
    setError(null);
    const result = cardStatus === "frozen"
      ? await unfreezeCard()
      : await freezeCard();
    setLoading(null);
    if ("error" in result) { setError(result.error); return; }
    setCardStatus(prev => prev === "frozen" ? "active" : "frozen");
    // Hide revealed details when freezing
    setRevealed(null);
    setShowCvv(false);
  }

  async function handleCopy() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed.cardNumber.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayNumber = revealed
    ? formatCardNumber(revealed.cardNumber)
    : card
      ? maskCardNumber("0000000000000000".slice(0, 12) + card.lastFour)
      : "•••• •••• •••• ••••";

  const expiryDisplay = revealed
    ? `${String(revealed.expiryMonth).padStart(2, "0")}/${String(revealed.expiryYear).slice(-2)}`
    : card
      ? `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`
      : "••/••";

  return (
    <div className="flex flex-col gap-3 select-none" style={{ width: 320 }}>
      {/* ── Card face ─────────────────────────────────────────────── */}
      <div
        style={{
          width: 320,
          height: 200,
          borderRadius: 16,
          background: cardStatus === "frozen"
            ? "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)"
            : cardStatus === "blocked"
              ? "linear-gradient(135deg, #1c1c1c 0%, #3f3f3f 100%)"
              : "linear-gradient(135deg, #0a0a0a 0%, #262626 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          transition: "background 0.4s ease",
          opacity: cardStatus === "blocked" || cardStatus === "expired" ? 0.7 : 1,
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", top: 20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        {/* Top row — chip + status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          {/* EMV Chip (CSS) */}
          <div style={{ width: 36, height: 28, borderRadius: 5, background: "linear-gradient(135deg, #d4a843 0%, #f0cc6a 50%, #c19328 100%)", border: "1px solid rgba(0,0,0,0.2)" }}>
            <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: 1, padding: 3 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ background: i === 4 ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.08)", borderRadius: 1 }} />
              ))}
            </div>
          </div>

          {/* Status badge */}
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
            color: status.color,
            background: status.bg,
            padding: "2px 8px",
            borderRadius: 999,
          }}>
            {status.label}
          </span>
        </div>

        {/* Card number */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "#ffffff",
            fontFamily: "ui-monospace, monospace",
            marginBottom: 4,
            lineHeight: 1.4,
          }}>
            {displayNumber}
          </p>
        </div>

        {/* Bottom row — name, expiry, Visa */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
          <div>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Card Holder</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#ffffff", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {card?.cardHolderName ?? userName.toUpperCase()}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Expires</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#ffffff", fontFamily: "ui-monospace, monospace" }}>
              {expiryDisplay}
            </p>
          </div>

          {/* Visa wordmark */}
          <span style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#ffffff",
            fontStyle: "italic",
            fontFamily: "serif",
            letterSpacing: "-0.03em",
            opacity: 0.9,
          }}>
            VISA
          </span>
        </div>
      </div>

      {/* ── Controls ──────────────────────────────────────────────── */}
      {card && (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Reveal / Hide */}
          <button
            onClick={handleReveal}
            disabled={!!loading || isLocked}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--ds-border)",
              background: "var(--ds-background)",
              color: "var(--ds-foreground)",
              fontSize: 12,
              fontWeight: 500,
              cursor: isLocked ? "not-allowed" : "pointer",
              opacity: isLocked ? 0.45 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!isLocked) (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ds-background)"; }}
          >
            {loading === "reveal"
              ? <Loader2 size={13} className="animate-spin" />
              : revealed ? <EyeOff size={13} /> : <Eye size={13} />
            }
            {revealed ? "Hide" : "Reveal"}
          </button>

          {/* Freeze / Unfreeze */}
          <button
            onClick={handleFreeze}
            disabled={!!loading || isLocked}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${cardStatus === "frozen" ? "#bfdbfe" : "var(--ds-border)"}`,
              background: cardStatus === "frozen" ? "#eff6ff" : "var(--ds-background)",
              color: cardStatus === "frozen" ? "#2563eb" : "var(--ds-foreground)",
              fontSize: 12,
              fontWeight: 500,
              cursor: isLocked ? "not-allowed" : "pointer",
              opacity: isLocked ? 0.45 : 1,
              transition: "background 0.15s",
            }}
          >
            {loading === "freeze"
              ? <Loader2 size={13} className="animate-spin" />
              : cardStatus === "frozen" ? <Zap size={13} /> : <Snowflake size={13} />
            }
            {cardStatus === "frozen" ? "Unfreeze" : "Freeze"}
          </button>
        </div>
      )}

      {/* ── Revealed details panel ─────────────────────────────────── */}
      {revealed && (
        <div style={{
          background: "#f9f9f9",
          border: "1px solid var(--ds-border)",
          borderRadius: 10,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {/* Full card number */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, color: "#737373", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "ui-monospace,monospace", marginBottom: 2 }}>Card Number</p>
              <p style={{ fontSize: 14, fontWeight: 600, fontFamily: "ui-monospace,monospace", letterSpacing: "0.12em", color: "#0a0a0a" }}>
                {formatCardNumber(revealed.cardNumber)}
              </p>
            </div>
            <button
              onClick={handleCopy}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--ds-border)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#525252" }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* CVV */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, color: "#737373", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "ui-monospace,monospace", marginBottom: 2 }}>CVV</p>
              <p style={{ fontSize: 14, fontWeight: 600, fontFamily: "ui-monospace,monospace", letterSpacing: "0.24em", color: "#0a0a0a" }}>
                {showCvv ? revealed.cvv : "•••"}
              </p>
            </div>
            <button
              onClick={() => setShowCvv(p => !p)}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--ds-border)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#525252" }}
            >
              {showCvv ? <EyeOff size={11} /> : <Eye size={11} />}
              {showCvv ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontSize: 12, color: "#dc2626", padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>
          {error}
        </p>
      )}

      {/* Limits info */}
      {card && (card.dailyLimit > 0 || card.monthlyLimit > 0) && (
        <p style={{ fontSize: 11, color: "#737373", fontFamily: "ui-monospace,monospace" }}>
          {card.dailyLimit > 0 && `Daily limit: $${card.dailyLimit.toLocaleString()}`}
          {card.dailyLimit > 0 && card.monthlyLimit > 0 && "  ·  "}
          {card.monthlyLimit > 0 && `Monthly limit: $${card.monthlyLimit.toLocaleString()}`}
        </p>
      )}
    </div>
  );
}
