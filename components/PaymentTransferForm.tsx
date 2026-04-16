"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Search,
  Star,
  Trash2,
  User2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/transaction.actions";
import {
  deleteRecipient,
  getSavedRecipients,
  lookupAccount,
  saveRecipient,
} from "@/lib/actions/recipient.actions";
import { formatAmount } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_TRANSFER = 10_000;
const LARGE_TRANSFER_THRESHOLD = 1_000;
const LOOKUP_DEBOUNCE_MS = 500;

// ── Schema ────────────────────────────────────────────────────────────────────
const formSchema = z.object({
  receiverAccountNumber: z
    .string()
    .min(10, "Enter a valid 10-digit account number")
    .regex(/^\d+$/, "Account number must contain digits only"),
  amount: z.string().refine(
    (v) => {
      const n = Number(v);
      return !isNaN(n) && n > 0 && n <= MAX_TRANSFER;
    },
    { message: `Enter an amount between $0.01 and $${MAX_TRANSFER.toLocaleString()}` }
  ),
  note: z.string().max(140, "Note must be 140 characters or less").optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ── Recipient chip ─────────────────────────────────────────────────────────────
function RecipientChip({
  recipient,
  onSelect,
  onDelete,
}: {
  recipient: SavedRecipient;
  onSelect: (r: SavedRecipient) => void;
  onDelete: (id: string) => void;
}) {
  const initials = recipient.recipientName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const label = recipient.nickname || recipient.recipientName.split(" ")[0];

  return (
    <div className="group relative flex shrink-0 flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => onSelect(recipient)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 ring-2 ring-transparent transition-all hover:ring-blue-400 focus:outline-none focus:ring-blue-500"
        title={`Send to ${recipient.recipientName} (${recipient.recipientAccountNumber})`}
      >
        {initials}
      </button>
      <span className="max-w-[56px] truncate text-center text-[10px] text-gray-500">
        {label}
      </span>
      {/* Delete button — visible on hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(recipient._id);
        }}
        className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
        title="Remove recipient"
      >
        <Trash2 size={8} />
      </button>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
const PaymentTransferForm = ({
  senderAccountNumber,
  senderBalance,
  prefillAccountNumber,
}: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recipient lookup state
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "found" | "not-found"
  >("idle");
  const [lookupName, setLookupName] = useState<string | null>(null);
  const lookupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save-recipient toggle (shown after a successful lookup)
  const [wantToSave, setWantToSave] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Address book
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);
  const [recipientsLoading, setRecipientsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverAccountNumber: prefillAccountNumber ?? "",
      amount: "",
      note: "",
    },
  });

  // Auto-lookup when a prefill account number is provided (e.g. from Recipients page)
  useEffect(() => {
    if (prefillAccountNumber) {
      triggerLookup(prefillAccountNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchedAmount = form.watch("amount");
  const amountNum = Number(watchedAmount) || 0;
  const insufficientFunds = amountNum > senderBalance;
  const largeTransfer = amountNum >= LARGE_TRANSFER_THRESHOLD && amountNum <= MAX_TRANSFER;

  // ── Load saved recipients on mount ──────────────────────────────────────────
  useEffect(() => {
    getSavedRecipients()
      .then((data) => {
        if (!("error" in data)) setSavedRecipients(data as SavedRecipient[]);
      })
      .finally(() => setRecipientsLoading(false));
  }, []);

  // ── Debounced account lookup ─────────────────────────────────────────────────
  const triggerLookup = useCallback((value: string) => {
    if (lookupTimerRef.current) clearTimeout(lookupTimerRef.current);

    const trimmed = value.trim();
    if (!/^\d{10,}$/.test(trimmed)) {
      setLookupStatus("idle");
      setLookupName(null);
      return;
    }

    setLookupStatus("loading");
    lookupTimerRef.current = setTimeout(async () => {
      const result = await lookupAccount(trimmed);
      if ("error" in result) {
        setLookupStatus("not-found");
        setLookupName(null);
      } else {
        setLookupStatus("found");
        setLookupName(result.name);
      }
    }, LOOKUP_DEBOUNCE_MS);
  }, []);

  // Reset lookup state when account number changes
  const handleAccountNumberChange = (value: string) => {
    setLookupName(null);
    setWantToSave(false);
    setSaveStatus("idle");
    triggerLookup(value);
  };

  // ── Select a saved recipient ─────────────────────────────────────────────────
  const handleSelectRecipient = (r: SavedRecipient) => {
    form.setValue("receiverAccountNumber", r.recipientAccountNumber, {
      shouldValidate: true,
    });
    setLookupStatus("found");
    setLookupName(r.recipientName);
    setWantToSave(false);
    setSaveStatus("idle");
  };

  // ── Delete a saved recipient ─────────────────────────────────────────────────
  const handleDeleteRecipient = async (id: string) => {
    await deleteRecipient(id);
    setSavedRecipients((prev) => prev.filter((r) => r._id !== id));
  };

  // ── Save recipient ────────────────────────────────────────────────────────────
  const handleSaveRecipient = async () => {
    if (!lookupName) return;
    const accountNumber = form.getValues("receiverAccountNumber");
    setSaveStatus("saving");
    const result = await saveRecipient({
      recipientAccountNumber: accountNumber,
      recipientName: lookupName,
    });
    if (!("error" in result)) {
      setSaveStatus("saved");
      setWantToSave(false);
      // Refresh the address book
      const fresh = await getSavedRecipients();
      if (!("error" in fresh)) setSavedRecipients(fresh as SavedRecipient[]);
    } else {
      setSaveStatus("idle");
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const submit = async (data: FormValues) => {
    if (insufficientFunds) return;

    setIsLoading(true);
    setError(null);

    const result = await createTransfer({
      receiverAccountNumber: data.receiverAccountNumber,
      amount: Number(data.amount),
      note: data.note,
    });

    setIsLoading(false);

    if (result && "error" in result) {
      setError(result.error as string);
      return;
    }

    form.reset();
    setLookupStatus("idle");
    setLookupName(null);
    router.push("/dashboard");
    router.refresh();
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        {/* Global error banner */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Header: title + available balance */}
        <div className="payment-transfer_form-details">
          <div>
            <h2 className="text-18 font-semibold text-gray-900">Transfer Details</h2>
            <p className="text-14 font-normal text-gray-600">
              From:{" "}
              <span className="font-semibold text-gray-800">{senderAccountNumber}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-12 text-gray-500">Available balance</p>
            <p
              className={`text-16 font-semibold ${senderBalance < 100 ? "text-red-600" : "text-green-600"
                }`}
            >
              {formatAmount(senderBalance)}
            </p>
          </div>
        </div>

        {/* ── Saved recipients ── */}
        {(recipientsLoading || savedRecipients.length > 0) && (
          <div className="border-t border-gray-200 py-4">
            <p className="mb-3 flex items-center gap-1.5 text-12 font-medium text-gray-500">
              <Star size={12} />
              Saved recipients
            </p>
            {recipientsLoading ? (
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-2 w-10 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-1">
                {savedRecipients.map((r) => (
                  <RecipientChip
                    key={r._id}
                    recipient={r}
                    onSelect={handleSelectRecipient}
                    onDelete={handleDeleteRecipient}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Recipient account number ── */}
        <FormField
          control={form.control}
          name="receiverAccountNumber"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient Account Number
                </FormLabel>
                <div className="flex w-full flex-col gap-1.5">
                  <FormControl>
                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        placeholder="Enter 10-digit account number"
                        className="input-class pl-9"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleAccountNumberChange(e.target.value);
                        }}
                      />
                      {/* Lookup indicator */}
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {lookupStatus === "loading" && (
                          <Loader2 size={15} className="animate-spin text-gray-400" />
                        )}
                        {lookupStatus === "found" && (
                          <CheckCircle2 size={15} className="text-green-500" />
                        )}
                        {lookupStatus === "not-found" && (
                          <XCircle size={15} className="text-red-400" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />

                  {/* Recipient name confirmation */}
                  {lookupStatus === "found" && lookupName && (
                    <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2">
                      <span className="flex items-center gap-2 text-13 text-green-700">
                        <User2 size={14} />
                        <strong>{lookupName}</strong>
                      </span>
                      {saveStatus === "saved" ? (
                        <span className="text-11 text-green-600">Saved ✓</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (wantToSave) {
                              handleSaveRecipient();
                            } else {
                              setWantToSave(true);
                            }
                          }}
                          className="text-11 text-blue-600 underline-offset-2 hover:underline"
                          disabled={saveStatus === "saving"}
                        >
                          {saveStatus === "saving"
                            ? "Saving…"
                            : wantToSave
                              ? "Confirm save"
                              : "Save recipient"}
                        </button>
                      )}
                    </div>
                  )}

                  {lookupStatus === "not-found" && (
                    <p className="text-12 text-red-500">
                      No active account found with this number.
                    </p>
                  )}
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* ── Amount ── */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount (USD)
                </FormLabel>
                <div className="flex w-full flex-col gap-1.5">
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-14">
                        $
                      </span>
                      <Input
                        placeholder="0.00"
                        className="input-class pl-7"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={MAX_TRANSFER}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />

                  {/* Insufficient funds warning */}
                  {insufficientFunds && amountNum > 0 && (
                    <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-12 text-red-600">
                      <AlertTriangle size={13} className="shrink-0" />
                      Insufficient balance. You have {formatAmount(senderBalance)}.
                    </div>
                  )}

                  {/* Large transfer advisory */}
                  {largeTransfer && !insufficientFunds && (
                    <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-2 text-12 text-amber-700">
                      <AlertTriangle size={13} className="shrink-0" />
                      Large transfer advisory: transfers over{" "}
                      {formatAmount(LARGE_TRANSFER_THRESHOLD)} may take longer to
                      process.
                    </div>
                  )}

                  {/* Max limit note */}
                  <p className="text-11 text-gray-400">
                    Maximum single transfer: {formatAmount(MAX_TRANSFER)}
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* ── Note ── */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Add a message for the recipient
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col gap-1">
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Rent for May, Thanks for lunch…"
                      className="input-class resize-none"
                      maxLength={140}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage className="text-12 text-red-500" />
                    <span className="ml-auto text-11 text-gray-400">
                      {(field.value ?? "").length}/140
                    </span>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* ── Submit ── */}
        <div className="payment-transfer_btn-box">
          <Button
            type="submit"
            className="payment-transfer_btn"
            disabled={isLoading || insufficientFunds || lookupStatus === "not-found"}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                &nbsp;Sending…
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
