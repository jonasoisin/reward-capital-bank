"use client";

import { useState } from "react";
import { creditAccount } from "@/lib/actions/account.actions";
import { debitAccount } from "@/lib/actions/account.actions";
import { blockAccount, unblockAccount } from "@/lib/actions/account.actions";
import { blockUser, unblockUser } from "@/lib/actions/admin.actions";
import { sendEmailToUser } from "@/lib/actions/email.actions";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  user: User;
  account: BankAccount | null;
  adminId: string;
}

type ActivePanel =
  | "credit"
  | "debit"
  | "blockAccount"
  | "blockUser"
  | "email"
  | null;

// ─── Feedback message ─────────────────────────────────────────────────────────
function Feedback({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium ${
        type === "success"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-red-50 text-red-700 ring-1 ring-red-200"
      }`}
    >
      {message}
    </div>
  );
}

// ─── Panel button ─────────────────────────────────────────────────────────────
function PanelButton({
  label,
  onClick,
  active,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  variant?: "default" | "danger" | "success";
}) {
  const base = "w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors border";
  const styles = {
    default: active
      ? "bg-black text-white border-black"
      : "border-[var(--ds-border)] text-[var(--ds-foreground)] hover:bg-[var(--ds-muted)]",
    danger: active
      ? "bg-red-600 text-white border-red-600"
      : "border-red-200 text-red-700 hover:bg-red-50",
    success: active
      ? "bg-emerald-600 text-white border-emerald-600"
      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
  };

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles[variant]}`}>
      {label}
    </button>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  name,
  type = "text",
  placeholder,
  required = true,
  min,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--ds-muted-foreground)" }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        step={type === "number" ? "0.01" : undefined}
        className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-black/10"
        style={{
          borderColor: "var(--ds-border)",
          background: "var(--ds-background)",
          color: "var(--ds-foreground)",
        }}
      />
    </div>
  );
}

function TextareaField({
  label,
  id,
  name,
  placeholder,
  rows = 4,
}: {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--ds-muted-foreground)" }}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        required
        rows={rows}
        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-black/10 resize-none"
        style={{
          borderColor: "var(--ds-border)",
          background: "var(--ds-background)",
          color: "var(--ds-foreground)",
        }}
      />
    </div>
  );
}

// ─── Form wrapper ─────────────────────────────────────────────────────────────
function FormWrapper({
  children,
  onCancel,
  onSubmit,
  loading,
  submitLabel,
  submitVariant = "default",
}: {
  children: React.ReactNode;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  submitLabel: string;
  submitVariant?: "default" | "danger" | "success";
}) {
  const submitStyles = {
    default:
      "bg-black text-white hover:bg-black/90",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      {children}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${submitStyles[submitVariant]}`}
        >
          {loading ? "Processing…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-60"
          style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserActionPanel({ user, account, adminId }: Props) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isAccountBlocked = account?.status === "frozen";
  const isUserBlocked = user.status === "blocked";

  function togglePanel(panel: ActivePanel) {
    setActivePanel((prev) => (prev === panel ? null : panel));
    setFeedback(null);
  }

  function showFeedback(message: string, type: "success" | "error") {
    setFeedback({ message, type });
    if (type === "success") {
      setTimeout(() => {
        setFeedback(null);
        setActivePanel(null);
      }, 2500);
    }
  }

  // ── Credit ──────────────────────────────────────────────────────────────────
  async function handleCredit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!account) return;
    const fd = new FormData(e.currentTarget);
    const amount = parseFloat(fd.get("amount") as string);
    const note = fd.get("note") as string;
    setLoading(true);
    setFeedback(null);
    const res = await creditAccount(account._id, amount, adminId, note);
    setLoading(false);
    if ("error" in res) showFeedback((res as { error: string }).error, "error");
    else showFeedback("Account credited successfully.", "success");
  }

  // ── Debit ───────────────────────────────────────────────────────────────────
  async function handleDebit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!account) return;
    const fd = new FormData(e.currentTarget);
    const amount = parseFloat(fd.get("amount") as string);
    const note = fd.get("note") as string;
    setLoading(true);
    setFeedback(null);
    const res = await debitAccount(account._id, amount, adminId, note);
    setLoading(false);
    if ("error" in res) showFeedback((res as { error: string }).error, "error");
    else showFeedback("Account debited successfully.", "success");
  }

  // ── Block/Unblock Account ───────────────────────────────────────────────────
  async function handleToggleAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!account) return;
    const fd = new FormData(e.currentTarget);
    const reason = fd.get("reason") as string;
    setLoading(true);
    setFeedback(null);
    const res = isAccountBlocked
      ? await unblockAccount(account._id, adminId)
      : await blockAccount(account._id, adminId, reason);
    setLoading(false);
    if ("error" in res) showFeedback((res as { error: string }).error, "error");
    else
      showFeedback(
        isAccountBlocked
          ? "Account unblocked successfully."
          : "Account blocked (frozen) successfully.",
        "success"
      );
  }

  // ── Block/Unblock User ──────────────────────────────────────────────────────
  async function handleToggleUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = fd.get("reason") as string;
    setLoading(true);
    setFeedback(null);
    const res = isUserBlocked
      ? await unblockUser(user._id, adminId)
      : await blockUser(user._id, adminId, reason);
    setLoading(false);
    if ("error" in res) showFeedback((res as { error: string }).error, "error");
    else
      showFeedback(
        isUserBlocked ? "User unblocked successfully." : "User blocked successfully.",
        "success"
      );
  }

  // ── Send Email ───────────────────────────────────────────────────────────────
  async function handleEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = fd.get("subject") as string;
    const body = fd.get("body") as string;
    setLoading(true);
    setFeedback(null);
    const res = await sendEmailToUser({ userId: user._id, subject, body, adminId });
    setLoading(false);
    if ("error" in res) showFeedback((res as { error: string }).error, "error");
    else showFeedback("Email sent successfully.", "success");
  }

  return (
    <div className="space-y-2">
      {/* ── Credit ── */}
      <PanelButton
        label="Credit Account"
        active={activePanel === "credit"}
        onClick={() => togglePanel("credit")}
        variant="success"
      />
      {activePanel === "credit" && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ds-foreground)" }}>
            Credit Account
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
            Funds will be added to the user&apos;s balance immediately.
          </p>
          {!account ? (
            <p className="mt-3 text-sm text-amber-600">This user has no bank account.</p>
          ) : (
            <FormWrapper
              onCancel={() => togglePanel(null)}
              onSubmit={handleCredit}
              loading={loading}
              submitLabel="Credit Account"
              submitVariant="success"
            >
              <Field
                label="Amount (USD)"
                id="credit-amount"
                name="amount"
                type="number"
                placeholder="0.00"
                min="0.01"
              />
              <Field
                label="Note"
                id="credit-note"
                name="note"
                placeholder="Reason for credit…"
              />
            </FormWrapper>
          )}
          {feedback && activePanel === "credit" && (
            <Feedback message={feedback.message} type={feedback.type} />
          )}
        </div>
      )}

      {/* ── Debit ── */}
      <PanelButton
        label="Debit Account"
        active={activePanel === "debit"}
        onClick={() => togglePanel("debit")}
        variant="danger"
      />
      {activePanel === "debit" && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ds-foreground)" }}>
            Debit Account
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
            Funds will be deducted from the user&apos;s balance immediately.
          </p>
          {!account ? (
            <p className="mt-3 text-sm text-amber-600">This user has no bank account.</p>
          ) : (
            <FormWrapper
              onCancel={() => togglePanel(null)}
              onSubmit={handleDebit}
              loading={loading}
              submitLabel="Debit Account"
              submitVariant="danger"
            >
              <Field
                label="Amount (USD)"
                id="debit-amount"
                name="amount"
                type="number"
                placeholder="0.00"
                min="0.01"
              />
              <Field
                label="Note"
                id="debit-note"
                name="note"
                placeholder="Reason for debit…"
              />
            </FormWrapper>
          )}
          {feedback && activePanel === "debit" && (
            <Feedback message={feedback.message} type={feedback.type} />
          )}
        </div>
      )}

      {/* ── Block/Unblock Account ── */}
      <PanelButton
        label={isAccountBlocked ? "Unblock Account" : "Block Account (Freeze)"}
        active={activePanel === "blockAccount"}
        onClick={() => togglePanel("blockAccount")}
        variant={isAccountBlocked ? "success" : "danger"}
      />
      {activePanel === "blockAccount" && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ds-foreground)" }}>
            {isAccountBlocked ? "Unblock Account" : "Block Account (Freeze)"}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
            {isAccountBlocked
              ? "The account will be unfrozen and restored to active status."
              : "The account will be frozen — no transactions will be allowed."}
          </p>
          {!account ? (
            <p className="mt-3 text-sm text-amber-600">This user has no bank account.</p>
          ) : (
            <FormWrapper
              onCancel={() => togglePanel(null)}
              onSubmit={handleToggleAccount}
              loading={loading}
              submitLabel={isAccountBlocked ? "Unblock Account" : "Freeze Account"}
              submitVariant={isAccountBlocked ? "success" : "danger"}
            >
              {!isAccountBlocked && (
                <Field
                  label="Reason"
                  id="block-account-reason"
                  name="reason"
                  placeholder="Reason for freezing…"
                />
              )}
              {isAccountBlocked && (
                <input type="hidden" name="reason" value="Unblocked by admin" />
              )}
            </FormWrapper>
          )}
          {feedback && activePanel === "blockAccount" && (
            <Feedback message={feedback.message} type={feedback.type} />
          )}
        </div>
      )}

      {/* ── Block/Unblock User ── */}
      <PanelButton
        label={isUserBlocked ? "Unblock User" : "Block User"}
        active={activePanel === "blockUser"}
        onClick={() => togglePanel("blockUser")}
        variant={isUserBlocked ? "success" : "danger"}
      />
      {activePanel === "blockUser" && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ds-foreground)" }}>
            {isUserBlocked ? "Unblock User" : "Block User"}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
            {isUserBlocked
              ? "The user's account will be restored to active."
              : "The user will be blocked from accessing their account."}
          </p>
          <FormWrapper
            onCancel={() => togglePanel(null)}
            onSubmit={handleToggleUser}
            loading={loading}
            submitLabel={isUserBlocked ? "Unblock User" : "Block User"}
            submitVariant={isUserBlocked ? "success" : "danger"}
          >
            {!isUserBlocked && (
              <Field
                label="Reason"
                id="block-user-reason"
                name="reason"
                placeholder="Reason for blocking…"
              />
            )}
            {isUserBlocked && (
              <input type="hidden" name="reason" value="Unblocked by admin" />
            )}
          </FormWrapper>
          {feedback && activePanel === "blockUser" && (
            <Feedback message={feedback.message} type={feedback.type} />
          )}
        </div>
      )}

      {/* ── Send Email ── */}
      <PanelButton
        label="Send Email"
        active={activePanel === "email"}
        onClick={() => togglePanel("email")}
      />
      {activePanel === "email" && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--ds-border)", background: "var(--ds-background)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ds-foreground)" }}>
            Send Email to User
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
            An email will be sent directly to {user.email}.
          </p>
          <FormWrapper
            onCancel={() => togglePanel(null)}
            onSubmit={handleEmail}
            loading={loading}
            submitLabel="Send Email"
          >
            <Field
              label="Subject"
              id="email-subject"
              name="subject"
              placeholder="Email subject…"
            />
            <TextareaField
              label="Message"
              id="email-body"
              name="body"
              placeholder="Write your message here…"
              rows={5}
            />
          </FormWrapper>
          {feedback && activePanel === "email" && (
            <Feedback message={feedback.message} type={feedback.type} />
          )}
        </div>
      )}
    </div>
  );
}
