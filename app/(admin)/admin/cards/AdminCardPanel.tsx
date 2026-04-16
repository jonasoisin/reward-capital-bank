"use client";

import { useState } from "react";
import {
  adminRevealCardDetails,
  adminFreezeCard,
  adminUnfreezeCard,
  adminBlockCard,
  adminUnblockCard,
  adminSetCardLimits,
} from "@/lib/actions/card.actions";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CardRow {
  _id: string;
  userId: { _id: string; firstName: string; lastName: string; email: string } | string;
  lastFour: string;
  cardNumber?: string; // only present after reveal
  expiryMonth: number;
  expiryYear: number;
  cardHolderName: string;
  type: string;
  status: "active" | "frozen" | "blocked" | "expired";
  dailyLimit: number;
  monthlyLimit: number;
  createdAt?: string;
}

interface Props {
  card: CardRow;
  adminId: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusColor(status: string) {
  switch (status) {
    case "active":  return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "frozen":  return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
    case "blocked": return "bg-red-50 text-red-700 ring-1 ring-red-200";
    case "expired": return "bg-gray-100 text-gray-500 ring-1 ring-gray-200";
    default:        return "bg-gray-100 text-gray-500";
  }
}

function Feedback({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`rounded-xl px-4 py-3 text-sm font-medium ${
        type === "success"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-red-50 text-red-700 ring-1 ring-red-200"
      }`}
    >
      {message}
    </div>
  );
}

// ── Card panel ────────────────────────────────────────────────────────────────
export default function AdminCardPanel({ card: initialCard, adminId }: Props) {
  const [card, setCard] = useState(initialCard);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Revealed sensitive data (client-side only, never persisted)
  const [revealed, setRevealed] = useState<{
    cardNumber: string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
  } | null>(null);
  const [showCvv, setShowCvv] = useState(false);
  const [showLimitsForm, setShowLimitsForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const owner =
    typeof card.userId === "object"
      ? card.userId
      : { firstName: "Unknown", lastName: "", email: "" };

  function showFeedback(message: string, type: "success" | "error") {
    setFeedback({ message, type });
    if (type === "success") setTimeout(() => setFeedback(null), 3000);
  }

  async function handleReveal() {
    setLoading(true);
    const res = await adminRevealCardDetails(card._id, adminId);
    setLoading(false);
    if ("error" in res) {
      showFeedback(res.error, "error");
    } else {
      setRevealed(res);
    }
  }

  function handleHide() {
    setRevealed(null);
    setShowCvv(false);
  }

  async function handleCopy() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed.cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFreezeToggle() {
    setLoading(true);
    const res =
      card.status === "frozen"
        ? await adminUnfreezeCard(card._id, adminId)
        : await adminFreezeCard(card._id, adminId);
    setLoading(false);
    if ("error" in res) {
      showFeedback(res.error, "error");
    } else {
      const newStatus = card.status === "frozen" ? "active" : "frozen";
      setCard((prev) => ({ ...prev, status: newStatus }));
      showFeedback(
        card.status === "frozen" ? "Card unfrozen." : "Card frozen.",
        "success"
      );
    }
  }

  async function handleBlockToggle() {
    setLoading(true);
    const res =
      card.status === "blocked"
        ? await adminUnblockCard(card._id, adminId)
        : await adminBlockCard(card._id, adminId);
    setLoading(false);
    if ("error" in res) {
      showFeedback((res as { error: string }).error, "error");
    } else {
      const newStatus = card.status === "blocked" ? "active" : "blocked";
      setCard((prev) => ({ ...prev, status: newStatus }));
      showFeedback(
        card.status === "blocked" ? "Card unblocked." : "Card blocked.",
        "success"
      );
    }
  }

  async function handleSetLimits(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dailyLimit = parseFloat(fd.get("dailyLimit") as string) || 0;
    const monthlyLimit = parseFloat(fd.get("monthlyLimit") as string) || 0;
    setLoading(true);
    const res = await adminSetCardLimits(card._id, adminId, dailyLimit, monthlyLimit);
    setLoading(false);
    if ("error" in res) {
      showFeedback((res as { error: string }).error, "error");
    } else {
      setCard((prev) => ({ ...prev, dailyLimit, monthlyLimit }));
      setShowLimitsForm(false);
      showFeedback("Spending limits updated.", "success");
    }
  }

  function formatCard(num: string) {
    return num.replace(/(.{4})/g, "$1 ").trim();
  }

  const expiry = `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`;

  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
    >
      {/* ── Header row ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold" style={{ color: "var(--ds-foreground)" }}>
              {card.cardHolderName}
            </p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor(card.status)}`}>
              {card.status}
            </span>
          </div>
          <p className="mt-0.5 text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
            {owner.firstName} {owner.lastName} · {owner.email}
          </p>
        </div>
        <div className="text-right text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
          <p>•••• •••• •••• {card.lastFour}</p>
          <p className="mt-0.5">Expires {expiry}</p>
        </div>
      </div>

      {/* ── Revealed card data ── */}
      {revealed && (
        <div
          className="rounded-xl border p-4 space-y-3 font-mono text-sm"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-muted)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--ds-muted-foreground)" }}>
                Full Card Number
              </p>
              <p className="text-lg tracking-widest" style={{ color: "var(--ds-foreground)" }}>
                {formatCard(revealed.cardNumber)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/50"
              style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--ds-muted-foreground)" }}>
                CVV
              </p>
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--ds-foreground)" }}>
                  {showCvv ? revealed.cvv : "•••"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCvv((v) => !v)}
                  className="text-xs underline"
                  style={{ color: "var(--ds-muted-foreground)" }}
                >
                  {showCvv ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--ds-muted-foreground)" }}>
                Expiry
              </p>
              <span style={{ color: "var(--ds-foreground)" }}>{expiry}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Spending limits ── */}
      <div className="flex flex-wrap gap-6 text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
        <span>
          Daily limit:{" "}
          <strong style={{ color: "var(--ds-foreground)" }}>
            {card.dailyLimit ? `$${card.dailyLimit.toLocaleString()}` : "Unlimited"}
          </strong>
        </span>
        <span>
          Monthly limit:{" "}
          <strong style={{ color: "var(--ds-foreground)" }}>
            {card.monthlyLimit ? `$${card.monthlyLimit.toLocaleString()}` : "Unlimited"}
          </strong>
        </span>
      </div>

      {/* ── Set limits form ── */}
      {showLimitsForm && (
        <form onSubmit={handleSetLimits} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ds-muted-foreground)" }}>
            Set Spending Limits (0 = unlimited)
          </p>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="block text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
                Daily ($)
              </label>
              <input
                name="dailyLimit"
                type="number"
                min="0"
                step="0.01"
                defaultValue={card.dailyLimit || ""}
                placeholder="0 = unlimited"
                className="h-9 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)", color: "var(--ds-foreground)" }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
                Monthly ($)
              </label>
              <input
                name="monthlyLimit"
                type="number"
                min="0"
                step="0.01"
                defaultValue={card.monthlyLimit || ""}
                placeholder="0 = unlimited"
                className="h-9 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)", color: "var(--ds-foreground)" }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-black py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save Limits"}
            </button>
            <button
              type="button"
              onClick={() => setShowLimitsForm(false)}
              disabled={loading}
              className="flex-1 rounded-xl border py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-60"
              style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Feedback ── */}
      {feedback && <Feedback message={feedback.message} type={feedback.type} />}

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-2 pt-1">
        {/* Reveal / Hide */}
        {!revealed ? (
          <button
            type="button"
            onClick={handleReveal}
            disabled={loading}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-60"
            style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
          >
            Reveal Card
          </button>
        ) : (
          <button
            type="button"
            onClick={handleHide}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
          >
            Hide Card
          </button>
        )}

        {/* Copy — only when revealed */}
        {revealed && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
          >
            {copied ? "Copied!" : "Copy Number"}
          </button>
        )}

        {/* Freeze / Unfreeze */}
        {card.status !== "blocked" && card.status !== "expired" && (
          <button
            type="button"
            onClick={handleFreezeToggle}
            disabled={loading}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
              card.status === "frozen"
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "border border-sky-200 text-sky-700 hover:bg-sky-50"
            }`}
          >
            {card.status === "frozen" ? "Unfreeze" : "Freeze"}
          </button>
        )}

        {/* Block / Unblock */}
        <button
          type="button"
          onClick={handleBlockToggle}
          disabled={loading || card.status === "expired"}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            card.status === "blocked"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-red-200 text-red-700 hover:bg-red-50"
          }`}
        >
          {card.status === "blocked" ? "Unblock" : "Block"}
        </button>

        {/* Set limits */}
        <button
          type="button"
          onClick={() => setShowLimitsForm((v) => !v)}
          className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
        >
          Set Limits
        </button>
      </div>
    </div>
  );
}
