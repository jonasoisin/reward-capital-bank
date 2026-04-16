"use client";

import {
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  Send,
  Trash2,
  User2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import {
  deleteRecipient,
  getSavedRecipients,
  lookupAccount,
  saveRecipient,
} from "@/lib/actions/recipient.actions";
import { formatAccountNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const letters = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return <>{letters}</>;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never used";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

// ── Recipient card ─────────────────────────────────────────────────────────────

function RecipientCard({
  recipient,
  onDelete,
}: {
  recipient: SavedRecipient;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteRecipient(recipient._id);
    onDelete(recipient._id);
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          <Initials name={recipient.recipientName} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">
            {recipient.recipientName}
          </p>
          {recipient.nickname && (
            <p className="truncate text-12 text-gray-500">"{recipient.nickname}"</p>
          )}
        </div>
      </div>

      {/* Account number */}
      <div className="rounded-md bg-gray-50 px-3 py-2 font-mono text-13 text-gray-600">
        {formatAccountNumber(recipient.recipientAccountNumber)}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-11 text-gray-400">
        <span>Used {recipient.useCount} {recipient.useCount === 1 ? "time" : "times"}</span>
        <span>{timeAgo(recipient.lastUsedAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/payment-transfer?account=${recipient.recipientAccountNumber}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-13 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Send size={13} />
          Send Money
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
          title="Remove recipient"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
}

// ── Add-recipient panel ────────────────────────────────────────────────────────

function AddRecipientPanel({ onAdded }: { onAdded: (r: SavedRecipient) => void }) {
  const [open, setOpen] = useState(false);
  const [accountInput, setAccountInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "found" | "not-found">("idle");
  const [lookupName, setLookupName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerLookup = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!/^\d{10,}$/.test(value.trim())) {
      setLookupStatus("idle");
      setLookupName(null);
      return;
    }
    setLookupStatus("loading");
    timerRef.current = setTimeout(async () => {
      const result = await lookupAccount(value.trim());
      if ("error" in result) {
        setLookupStatus("not-found");
        setLookupName(null);
      } else {
        setLookupStatus("found");
        setLookupName(result.name);
      }
    }, 500);
  }, []);

  const handleSave = async () => {
    if (!lookupName) return;
    setSaving(true);
    const result = await saveRecipient({
      recipientAccountNumber: accountInput.trim(),
      recipientName: lookupName,
      nickname: nickname.trim() || undefined,
    });
    if (!("error" in result)) {
      // Fetch fresh list to get the new _id
      const fresh = await getSavedRecipients();
      if (!("error" in fresh)) {
        const added = (fresh as SavedRecipient[]).find(
          (r) => r.recipientAccountNumber === accountInput.trim()
        );
        if (added) onAdded(added);
      }
      setOpen(false);
      setAccountInput("");
      setNickname("");
      setLookupStatus("idle");
      setLookupName(null);
    }
    setSaving(false);
  };

  const handleClose = () => {
    setOpen(false);
    setAccountInput("");
    setNickname("");
    setLookupStatus("idle");
    setLookupName(null);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-5 text-gray-400 transition-colors hover:border-blue-300 hover:text-blue-500 w-full"
      >
        <Plus size={18} />
        <span className="text-14 font-medium">Add new recipient</span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50/40 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-14 font-semibold text-gray-800">Add Recipient</p>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      {/* Account number input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-12 font-medium text-gray-600">Account Number</label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Enter 10-digit account number"
            className="pl-8 text-13"
            value={accountInput}
            onChange={(e) => {
              setAccountInput(e.target.value);
              setLookupName(null);
              triggerLookup(e.target.value);
            }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {lookupStatus === "loading" && <Loader2 size={13} className="animate-spin text-gray-400" />}
            {lookupStatus === "found" && <CheckCircle2 size={13} className="text-green-500" />}
            {lookupStatus === "not-found" && <XCircle size={13} className="text-red-400" />}
          </span>
        </div>

        {lookupStatus === "found" && lookupName && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-12 text-green-700">
            <User2 size={12} />
            <strong>{lookupName}</strong>
          </div>
        )}
        {lookupStatus === "not-found" && (
          <p className="text-12 text-red-500">No active account found.</p>
        )}
      </div>

      {/* Optional nickname */}
      {lookupStatus === "found" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-12 font-medium text-gray-600">
            Nickname <span className="text-gray-400">(optional)</span>
          </label>
          <Input
            placeholder={`e.g. "Landlord", "Mom"`}
            className="text-13"
            value={nickname}
            maxLength={40}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={lookupStatus !== "found" || saving}
        className="payment-transfer_btn"
      >
        {saving ? (
          <><Loader2 size={14} className="animate-spin" /> Saving…</>
        ) : (
          "Save Recipient"
        )}
      </Button>
    </div>
  );
}

// ── Main manager ──────────────────────────────────────────────────────────────

export default function RecipientsManager({
  initialRecipients,
}: {
  initialRecipients: SavedRecipient[];
}) {
  const [recipients, setRecipients] = useState<SavedRecipient[]>(initialRecipients);

  const handleDelete = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r._id !== id));
  };

  const handleAdded = (r: SavedRecipient) => {
    setRecipients((prev) => {
      // Upsert: replace if already exists (after re-save), else prepend
      const exists = prev.find((p) => p._id === r._id);
      if (exists) return prev.map((p) => (p._id === r._id ? r : p));
      return [r, ...prev];
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add panel */}
      <AddRecipientPanel onAdded={handleAdded} />

      {/* Recipient grid */}
      {recipients.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Users size={24} className="text-gray-400" />
          </div>
          <p className="text-15 font-medium text-gray-500">No saved recipients yet</p>
          <p className="text-13 text-gray-400">
            Add recipients above to send money faster next time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipients.map((r) => (
            <RecipientCard key={r._id} recipient={r} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
