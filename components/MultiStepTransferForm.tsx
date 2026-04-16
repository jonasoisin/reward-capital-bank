"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check,
  CheckCircle2, Clock, DollarSign, Globe, Loader2,
  Lock, Send, Shield, User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createInternationalTransfer } from "@/lib/actions/intl-transfer.actions";
import {
  TRANSFER_COUNTRIES,
  TransferRail,
  computeRail,
  formatSortCode,
  getTargetCurrency,
  validateIBAN,
  validateRoutingNumber,
  validateSortCode,
  validateSWIFT,
} from "@/lib/utils/intl-transfer";
import { formatAmount } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem,
  FormLabel, FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";

// ── Schema (loose — per-step validation via trigger()) ───────────────────────

const schema = z.object({
  amount:       z.string().refine(v => Number(v) > 0 && Number(v) <= 50000, {
    message: "Enter an amount between $0.01 and $50,000",
  }),
  transferType: z.enum(["domestic", "international"]),

  recipientName:    z.string().min(2, "Full name is required"),
  recipientCountry: z.string().min(1, "Select a country"),
  bankName:         z.string().min(2, "Bank name is required"),
  usSubRail:        z.enum(["ACH", "WIRE"]).optional(),

  accountNumber:    z.string().optional(),
  routingNumber:    z.string().optional(),
  accountType:      z.enum(["checking", "savings"]).optional(),
  sortCode:         z.string().optional(),
  iban:             z.string().optional(),
  swiftCode:        z.string().optional(),
  bankAddress:      z.string().optional(),
  recipientAddress: z.string().optional(),
  purpose:          z.string().optional(),

  note:             z.string().max(140).optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Step field map ────────────────────────────────────────────────────────────

function getStep3Fields(rail: TransferRail): Array<keyof FormValues> {
  switch (rail) {
    case "US_ACH":   return ["accountNumber", "routingNumber", "accountType"];
    case "US_WIRE":  return ["accountNumber", "routingNumber"];
    case "UK_FPS":   return ["accountNumber", "sortCode"];
    case "EU_SEPA":  return ["iban"];
    case "SWIFT":    return ["swiftCode"];
    default:         return [];
  }
}

const STEP_LABELS = ["Setup", "Recipient", "Bank Details", "Review Fees", "Confirm"];

// ── Step progress bar ─────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const done = num < current;
          const active = num === current;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-12 font-bold transition-all
                  ${done   ? "bg-green-500 text-white"          : ""}
                  ${active ? "bg-blue-600 text-white ring-4 ring-blue-100" : ""}
                  ${!done && !active ? "bg-gray-100 text-gray-400" : ""}
                `}>
                  {done ? <Check size={13} /> : num}
                </div>
                <span className={`hidden text-10 font-medium sm:block ${active ? "text-blue-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 transition-all ${num < current ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Rail badge ────────────────────────────────────────────────────────────────

const RAIL_LABELS: Record<TransferRail, { label: string; flag: string; desc: string }> = {
  US_ACH:  { label: "ACH",           flag: "🇺🇸", desc: "1–3 business days" },
  US_WIRE: { label: "Wire Transfer", flag: "🇺🇸", desc: "Same day"          },
  UK_FPS:  { label: "Faster Payments",flag: "🇬🇧", desc: "Within 2 hours"   },
  EU_SEPA: { label: "SEPA",          flag: "🇪🇺", desc: "1 business day"    },
  SWIFT:   { label: "SWIFT",         flag: "🌍", desc: "3–5 business days"  },
};

function RailBadge({ rail }: { rail: TransferRail }) {
  const { label, flag, desc } = RAIL_LABELS[rail];
  return (
    <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-13">
      <span>{flag}</span>
      <span className="font-semibold text-blue-800">{label}</span>
      <span className="text-blue-500">·</span>
      <span className="text-blue-600">{desc}</span>
    </div>
  );
}

// ── Step 1: Amount & Type ─────────────────────────────────────────────────────

function Step1({
  form,
  senderAccountNumber,
  senderBalance,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  senderAccountNumber: string;
  senderBalance: number;
}) {
  const amount = Number(form.watch("amount")) || 0;
  const insufficient = amount > senderBalance;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="eyebrow mb-1">From account</p>
        <p className="font-mono text-14 font-semibold text-gray-900">{senderAccountNumber}</p>
        <p className={`mt-1 text-12 font-medium ${senderBalance < 100 ? "text-red-500" : "text-green-600"}`}>
          Available: {formatAmount(senderBalance)}
        </p>
      </div>

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-14 font-medium text-gray-700">Amount (USD)</FormLabel>
            <FormControl>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="0.00" type="number" step="0.01" min="0.01" max="50000"
                  className="input-class pl-8" {...field} />
              </div>
            </FormControl>
            <FormMessage className="text-12 text-red-500" />
            {insufficient && amount > 0 && (
              <p className="flex items-center gap-1.5 text-12 text-red-600">
                <AlertTriangle size={12} /> Insufficient balance
              </p>
            )}
            {amount > 5000 && !insufficient && (
              <p className="flex items-center gap-1.5 text-12 text-amber-600">
                <AlertTriangle size={12} /> Transfers over $5,000 may require additional review
              </p>
            )}
            <p className="text-11 text-gray-400">Maximum: $50,000 per transfer</p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transferType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-14 font-medium text-gray-700">Transfer Type</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {(["domestic", "international"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => field.onChange(type)}
                  className={`
                    flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all
                    ${field.value === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  {type === "domestic" ? <DollarSign size={20} className={field.value === type ? "text-blue-600" : "text-gray-400"} />
                    : <Globe size={20} className={field.value === type ? "text-blue-600" : "text-gray-400"} />}
                  <span className={`text-13 font-semibold capitalize ${field.value === type ? "text-blue-700" : "text-gray-600"}`}>
                    {type}
                  </span>
                  <span className="text-11 text-gray-400">
                    {type === "domestic" ? "US, UK, EU rails" : "SWIFT worldwide"}
                  </span>
                </button>
              ))}
            </div>
            <FormMessage className="text-12 text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
}

// ── Step 2: Recipient ─────────────────────────────────────────────────────────

function Step2({
  form,
  transferType,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  transferType: "domestic" | "international";
}) {
  const country = form.watch("recipientCountry");
  const usSubRail = form.watch("usSubRail");
  const rail = computeRail(country, transferType, usSubRail);

  return (
    <div className="flex flex-col gap-5">
      <FormField
        control={form.control}
        name="recipientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-14 font-medium text-gray-700">Full Name</FormLabel>
            <FormControl>
              <div className="relative">
                <User2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="John Smith" className="input-class pl-8" {...field} />
              </div>
            </FormControl>
            <FormMessage className="text-12 text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="recipientCountry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-14 font-medium text-gray-700">Country</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="input-class">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-64">
                {TRANSFER_COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name} ({c.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-12 text-red-500" />
          </FormItem>
        )}
      />

      {/* US domestic sub-rail selector */}
      {transferType === "domestic" && country === "US" && (
        <FormField
          control={form.control}
          name="usSubRail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Transfer Method</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {(["ACH", "WIRE"] as const).map((r) => (
                  <button key={r} type="button"
                    onClick={() => field.onChange(r)}
                    className={`rounded-lg border-2 p-3 text-13 font-medium transition-all
                      ${field.value === r ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    {r === "ACH" ? "ACH (1–3 days · Free)" : "Wire (Same day · $25)"}
                  </button>
                ))}
              </div>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-14 font-medium text-gray-700">Bank Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Barclays, Deutsche Bank" className="input-class" {...field} />
            </FormControl>
            <FormMessage className="text-12 text-red-500" />
          </FormItem>
        )}
      />

      {country && <RailBadge rail={rail} />}
    </div>
  );
}

// ── Step 3: Bank Details ──────────────────────────────────────────────────────

function Step3({
  form,
  rail,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  rail: TransferRail;
}) {
  return (
    <div className="flex flex-col gap-5">
      <RailBadge rail={rail} />

      {/* US ACH & Wire */}
      {(rail === "US_ACH" || rail === "US_WIRE") && (
        <>
          <FormField control={form.control} name="accountNumber" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Account Number</FormLabel>
              <FormControl><Input placeholder="4–17 digits" className="input-class font-mono" {...field} /></FormControl>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          <FormField control={form.control} name="routingNumber" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Routing Number (ABA)</FormLabel>
              <FormControl>
                <Input placeholder="9-digit routing number" className="input-class font-mono" maxLength={9} {...field}
                  onChange={e => {
                    field.onChange(e);
                    // Show checksum feedback inline
                  }}
                />
              </FormControl>
              <FormDescription className="text-11 text-gray-400">
                {field.value && field.value.length === 9 && (
                  validateRoutingNumber(field.value)
                    ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={11} /> Valid routing number</span>
                    : <span className="text-red-500">Invalid checksum</span>
                )}
              </FormDescription>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          {rail === "US_ACH" && (
            <FormField control={form.control} name="accountType" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-medium text-gray-700">Account Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-class"><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-12 text-red-500" />
              </FormItem>
            )} />
          )}
        </>
      )}

      {/* UK FPS */}
      {rail === "UK_FPS" && (
        <>
          <FormField control={form.control} name="accountNumber" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Account Number</FormLabel>
              <FormControl><Input placeholder="8 digits" className="input-class font-mono" maxLength={8} {...field} /></FormControl>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          <FormField control={form.control} name="sortCode" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Sort Code</FormLabel>
              <FormControl>
                <Input placeholder="00-00-00" className="input-class font-mono" maxLength={8}
                  value={field.value}
                  onChange={e => field.onChange(formatSortCode(e.target.value))}
                />
              </FormControl>
              <FormDescription className="text-11 text-gray-400">
                {field.value && validateSortCode(field.value) && (
                  <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={11} /> Valid sort code</span>
                )}
              </FormDescription>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
        </>
      )}

      {/* EU SEPA */}
      {rail === "EU_SEPA" && (
        <FormField control={form.control} name="iban" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-14 font-medium text-gray-700">IBAN</FormLabel>
            <FormControl>
              <Input placeholder="e.g. DE89 3704 0044 0532 0130 00" className="input-class font-mono tracking-wider"
                {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
            </FormControl>
            <FormDescription className="text-11 text-gray-400">
              {field.value && field.value.length >= 15 && (() => {
                const r = validateIBAN(field.value);
                return r.valid
                  ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={11} /> Valid IBAN{r.country ? ` (${r.country})` : ""}</span>
                  : <span className="text-red-500">{r.error}</span>;
              })()}
            </FormDescription>
            <FormMessage className="text-12 text-red-500" />
          </FormItem>
        )} />
      )}

      {/* SWIFT */}
      {rail === "SWIFT" && (
        <>
          <FormField control={form.control} name="swiftCode" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">SWIFT / BIC Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. DEUTDEDB" className="input-class font-mono tracking-wider" maxLength={11}
                  {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormDescription className="text-11 text-gray-400">
                {field.value && field.value.length >= 8 && (
                  validateSWIFT(field.value)
                    ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={11} /> Valid BIC</span>
                    : <span className="text-red-500">Invalid BIC format</span>
                )}
              </FormDescription>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          <FormField control={form.control} name="iban" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">IBAN <span className="text-gray-400 font-normal">(if available)</span></FormLabel>
              <FormControl>
                <Input placeholder="International bank account number" className="input-class font-mono"
                  {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          <FormField control={form.control} name="accountNumber" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Account Number <span className="text-gray-400 font-normal">(if no IBAN)</span></FormLabel>
              <FormControl><Input placeholder="Bank account number" className="input-class font-mono" {...field} /></FormControl>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          <FormField control={form.control} name="bankAddress" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Bank Address <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
              <FormControl><Input placeholder="Bank street address, city, country" className="input-class" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="recipientAddress" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Recipient Address <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
              <FormControl><Input placeholder="Recipient's full address" className="input-class" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="purpose" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-14 font-medium text-gray-700">Purpose of Transfer <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="input-class"><SelectValue placeholder="Select purpose" /></SelectTrigger>
                  <SelectContent>
                    {["Family support","Goods/Services","Education","Investment","Real estate","Medical","Other"].map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )} />
        </>
      )}
    </div>
  );
}

// ── Step 4: FX & Fees ─────────────────────────────────────────────────────────

function Step4({
  fxQuote,
  fxLoading,
  amount,
  toCurrency,
}: {
  fxQuote: FXQuote | null;
  fxLoading: boolean;
  amount: number;
  toCurrency: string;
}) {
  if (fxLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!fxQuote) {
    return <p className="text-13 text-red-500">Could not load exchange rate. Please go back and try again.</p>;
  }

  const isSameCurrency = toCurrency === "USD";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="text-13 font-semibold text-gray-700">Transfer breakdown</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: "You send",      value: `$${amount.toFixed(2)} USD`,                  bold: false },
            !isSameCurrency && { label: "Exchange rate", value: `1 USD = ${fxQuote.rate} ${toCurrency}`, bold: false },
            { label: "Transfer fee",  value: fxQuote.fee === 0 ? "Free" : `$${fxQuote.fee.toFixed(2)}`, bold: false },
            { label: "Total debit",   value: `$${fxQuote.totalDebit.toFixed(2)} USD`,       bold: true  },
            { label: "Recipient gets",value: `${fxQuote.convertedAmount.toFixed(2)} ${toCurrency}`, bold: true },
          ].filter((x): x is { label: string; value: string; bold: boolean } => Boolean(x)).map(({ label, value, bold }) => (
            <div key={label} className={`flex justify-between px-4 py-3 ${bold ? "bg-green-50" : ""}`}>
              <span className="text-13 text-gray-600">{label}</span>
              <span className={`text-13 font-mono ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-12 text-blue-700">
        <Clock size={13} className="shrink-0" />
        <span>Estimated delivery: <strong>{fxQuote.estimatedDelivery}</strong></span>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-12 text-amber-700">
        <Shield size={13} className="mt-0.5 shrink-0" />
        <span>Exchange rates are locked at the time of confirmation. The rate shown is indicative until you confirm.</span>
      </div>
    </div>
  );
}

// ── Step 5: Review & Confirm ──────────────────────────────────────────────────

function Step5({
  form,
  formData,
  rail,
  fxQuote,
  senderAccountNumber,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  formData: FormValues;
  rail: TransferRail;
  fxQuote: FXQuote | null;
  senderAccountNumber: string;
}) {
  const { label, flag } = RAIL_LABELS[rail];
  const amount = Number(formData.amount);
  const isLarge = amount > 5000;

  const maskMiddle = (s: string) => {
    if (!s || s.length <= 4) return s;
    return s.slice(0, 2) + "•".repeat(s.length - 4) + s.slice(-2);
  };

  const bankDetails: Array<[string, string]> = [];
  if (formData.accountNumber) bankDetails.push(["Account", maskMiddle(formData.accountNumber)]);
  if (formData.routingNumber) bankDetails.push(["Routing", maskMiddle(formData.routingNumber)]);
  if (formData.accountType)   bankDetails.push(["Type", formData.accountType]);
  if (formData.sortCode)      bankDetails.push(["Sort code", formData.sortCode]);
  if (formData.iban)          bankDetails.push(["IBAN", maskMiddle(formData.iban)]);
  if (formData.swiftCode)     bankDetails.push(["SWIFT/BIC", formData.swiftCode]);

  return (
    <div className="flex flex-col gap-5">
      {isLarge && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-13 text-amber-800">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>Large transfer: this transaction may require additional review (1–2 business days processing).</span>
        </div>
      )}

      {/* Summary card */}
      <div className="rounded-xl border border-gray-200 overflow-hidden text-13">
        {[
          ["From",      senderAccountNumber],
          ["To",        `${formData.recipientName} · ${flag} ${formData.recipientCountry}`],
          ["Bank",      formData.bankName],
          ["Rail",      label],
          ...bankDetails,
          ["Amount",    `$${amount.toFixed(2)}`],
          fxQuote && fxQuote.fee > 0 ? ["Fee", `$${fxQuote.fee.toFixed(2)}`] : null,
          fxQuote ? ["Total debit", `$${fxQuote.totalDebit.toFixed(2)}`] : null,
          fxQuote ? ["Recipient gets", `${fxQuote.convertedAmount.toFixed(2)} ${fxQuote.toCurrency}`] : null,
          fxQuote ? ["Delivery", fxQuote.estimatedDelivery] : null,
        ].filter((x): x is [string, string] => Array.isArray(x)).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-gray-100 px-4 py-2.5 last:border-0">
            <span className="text-gray-500">{k}</span>
            <span className="font-medium text-gray-900">{v}</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <FormField control={form.control} name="note" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-14 font-medium text-gray-700">Reference / Note <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
          <FormControl>
            <Textarea placeholder="Add a reference for your records" className="input-class resize-none" maxLength={140} {...field} />
          </FormControl>
          <div className="flex justify-end">
            <span className="text-11 text-gray-400">{(field.value ?? "").length}/140</span>
          </div>
        </FormItem>
      )} />

      <div className="flex items-start gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-12 text-green-700">
        <Lock size={13} className="mt-0.5 shrink-0" />
        <span>Your transfer is protected. By confirming, you authorise this debit from your account.</span>
      </div>
    </div>
  );
}

// ── Main form orchestrator ────────────────────────────────────────────────────

export default function MultiStepTransferForm({
  senderAccountNumber,
  senderBalance,
  prefillAccountNumber,
}: PaymentTransferFormProps) {
  const router = useRouter();
  const [step, setStep]           = useState(1);
  const [fxQuote, setFxQuote]     = useState<FXQuote | null>(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      transferType: "domestic",
      recipientName: "",
      recipientCountry: "US",
      bankName: "",
      usSubRail: "ACH",
      note: "",
    },
  });

  const watchedType    = form.watch("transferType");
  const watchedCountry = form.watch("recipientCountry");
  const watchedSubRail = form.watch("usSubRail");
  const rail = computeRail(watchedCountry, watchedType, watchedSubRail);
  const toCurrency = getTargetCurrency(watchedCountry);
  const amount = Number(form.watch("amount")) || 0;

  // ── FX quote fetcher ─────────────────────────────────────────────────────────
  const fetchFXQuote = useCallback(async () => {
    setFxLoading(true);
    try {
      const res = await fetch(`/api/fx-quote?currency=${toCurrency}&amount=${amount}`);
      if (res.ok) setFxQuote(await res.json());
    } finally {
      setFxLoading(false);
    }
  }, [toCurrency, amount]);

  // ── Step navigation ───────────────────────────────────────────────────────────
  const handleNext = async () => {
    let fields: Array<keyof FormValues> = [];

    if (step === 1) {
      fields = ["amount", "transferType"];
      if (Number(form.getValues("amount")) > senderBalance) return;
    } else if (step === 2) {
      fields = ["recipientName", "recipientCountry", "bankName"];
      if (watchedType === "domestic" && watchedCountry === "US") fields.push("usSubRail");
    } else if (step === 3) {
      fields = getStep3Fields(rail);
      // Custom per-rail validation before trigger
      const vals = form.getValues();
      let ok = true;
      if (rail === "US_ACH" || rail === "US_WIRE") {
        if (vals.routingNumber && !validateRoutingNumber(vals.routingNumber)) {
          form.setError("routingNumber", { message: "Invalid ABA routing number" });
          ok = false;
        }
      }
      if (rail === "UK_FPS" && vals.sortCode && !validateSortCode(vals.sortCode)) {
        form.setError("sortCode", { message: "Sort code must be 6 digits" });
        ok = false;
      }
      if (rail === "EU_SEPA" && vals.iban) {
        const r = validateIBAN(vals.iban);
        if (!r.valid) { form.setError("iban", { message: r.error }); ok = false; }
      }
      if (rail === "SWIFT" && vals.swiftCode && !validateSWIFT(vals.swiftCode)) {
        form.setError("swiftCode", { message: "Invalid SWIFT/BIC format" });
        ok = false;
      }
      if (!ok) return;
    }

    if (fields.length > 0) {
      const valid = await form.trigger(fields);
      if (!valid) return;
    }

    if (step === 3) await fetchFXQuote();
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(s => s - 1);
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = form.handleSubmit(async (data) => {
    if (!fxQuote) { setError("Exchange rate not available. Please go back and try again."); return; }

    setSubmitting(true);
    setError(null);

    const result = await createInternationalTransfer({
      amount:           Number(data.amount),
      transferType:     data.transferType,
      rail,
      toCurrency,
      fxRate:           fxQuote.rate,
      fee:              fxQuote.fee,
      convertedAmount:  fxQuote.convertedAmount,
      recipientName:    data.recipientName,
      recipientCountry: data.recipientCountry,
      bankName:         data.bankName,
      accountNumber:    data.accountNumber,
      routingNumber:    data.routingNumber,
      accountType:      data.accountType,
      sortCode:         data.sortCode,
      iban:             data.iban,
      swiftCode:        data.swiftCode,
      bankAddress:      data.bankAddress,
      recipientAddress: data.recipientAddress,
      purpose:          data.purpose,
      note:             data.note,
    });

    setSubmitting(false);

    if ("error" in result) {
      setError(result.error as string);
      return;
    }

    const params = new URLSearchParams({
      amount:    String(Number(data.amount) + (fxQuote?.fee ?? 0)),
      currency:  toCurrency,
      recipient: encodeURIComponent(data.recipientName),
      rail,
      delivery:  fxQuote?.estimatedDelivery ?? "",
      status:    (result as { status?: string }).status ?? "completed",
      txnId:     (result as { transactionId?: string }).transactionId ?? "",
    });
    router.push(`/transfer-success?${params.toString()}`);
  });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">
        <StepBar current={step} />

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-13 text-red-600">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {step === 1 && <Step1 form={form} senderAccountNumber={senderAccountNumber} senderBalance={senderBalance} />}
        {step === 2 && <Step2 form={form} transferType={watchedType} />}
        {step === 3 && <Step3 form={form} rail={rail} />}
        {step === 4 && <Step4 fxQuote={fxQuote} fxLoading={fxLoading} amount={amount} toCurrency={toCurrency} />}
        {step === 5 && (
          <Step5
            form={form}
            formData={form.getValues()}
            rail={rail}
            fxQuote={fxQuote}
            senderAccountNumber={senderAccountNumber}
          />
        )}

        {/* Navigation buttons */}
        <div className={`flex gap-3 pt-2 ${step === 1 ? "justify-end" : "justify-between"}`}>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="gap-1.5">
              <ArrowLeft size={15} /> Back
            </Button>
          )}
          {step < 5 && (
            <Button type="button" onClick={handleNext} className="payment-transfer_btn gap-1.5">
              Next <ArrowRight size={15} />
            </Button>
          )}
          {step === 5 && (
            <Button type="submit" className="payment-transfer_btn gap-1.5" disabled={submitting}>
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                : <><Send size={15} /> Confirm Transfer</>
              }
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
