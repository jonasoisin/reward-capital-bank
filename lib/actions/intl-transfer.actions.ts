"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Account from "@/lib/models/Account";
import Transaction from "@/lib/models/Transaction";
import InternationalTransaction from "@/lib/models/InternationalTransaction";
import User from "@/lib/models/User";
import { getSessionUser } from "@/lib/auth";
import { parseStringify } from "@/lib/utils";
import { sendMail } from "@/lib/mailer";
import { transactionEmail } from "@/lib/emails/transaction";
import {
  validateIBAN,
  validateRoutingNumber,
  validateSortCode,
  validateSWIFT,
  normalizeIBAN,
} from "@/lib/utils/intl-transfer";

// ── Validation schema (server-side, rail-aware) ───────────────────────────────

const baseSchema = z.object({
  amount:           z.number().positive().max(50000),
  transferType:     z.enum(["domestic", "international"]),
  rail:             z.enum(["US_ACH", "US_WIRE", "UK_FPS", "EU_SEPA", "SWIFT"]),
  toCurrency:       z.string().min(3).max(3),
  fxRate:           z.number().positive(),
  fee:              z.number().min(0),
  convertedAmount:  z.number().positive(),

  recipientName:    z.string().min(2).max(120),
  recipientCountry: z.string().min(2).max(2),
  bankName:         z.string().min(2).max(120),

  // All bank-detail fields optional at base level
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
}).superRefine((data, ctx) => {
  const err = (path: string, msg: string) =>
    ctx.addIssue({ code: "custom", path: [path], message: msg });

  switch (data.rail) {
    case "US_ACH":
      if (!data.accountNumber?.trim()) err("accountNumber", "Account number is required");
      if (!data.routingNumber || !validateRoutingNumber(data.routingNumber))
        err("routingNumber", "Valid 9-digit ABA routing number is required");
      if (!data.accountType)
        err("accountType", "Account type is required");
      break;
    case "US_WIRE":
      if (!data.accountNumber?.trim()) err("accountNumber", "Account number is required");
      if (!data.routingNumber || !validateRoutingNumber(data.routingNumber))
        err("routingNumber", "Valid wire routing number is required");
      break;
    case "UK_FPS":
      if (!data.accountNumber || !/^\d{8}$/.test(data.accountNumber.replace(/\s/g, "")))
        err("accountNumber", "8-digit account number is required");
      if (!data.sortCode || !validateSortCode(data.sortCode))
        err("sortCode", "Valid 6-digit sort code is required (XX-XX-XX)");
      break;
    case "EU_SEPA": {
      if (!data.iban) { err("iban", "IBAN is required"); break; }
      const res = validateIBAN(data.iban);
      if (!res.valid) err("iban", res.error ?? "Invalid IBAN");
      break;
    }
    case "SWIFT":
      if (!data.swiftCode || !validateSWIFT(data.swiftCode))
        err("swiftCode", "Valid SWIFT/BIC code is required (8–11 characters)");
      if (!data.iban?.trim() && !data.accountNumber?.trim())
        err("accountNumber", "IBAN or account number is required");
      break;
  }
});

// ── Main server action ────────────────────────────────────────────────────────

export async function createInternationalTransfer(data: unknown) {
  const session = getSessionUser();
  if (!session || session.role !== "user") return { error: "Not authenticated." };

  const parsed = baseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const d = parsed.data;
  const totalDebit = d.amount + d.fee;

  await connectDB();

  // Sender checks
  const senderAccount = await Account.findOne({ userId: session.userId });
  if (!senderAccount) return { error: "Your account was not found." };
  if (senderAccount.status !== "active") return { error: "Your account is frozen or closed." };
  if (senderAccount.balance < totalDebit) {
    return { error: `Insufficient balance. You need $${totalDebit.toFixed(2)} (amount + fee) but have $${senderAccount.balance.toFixed(2)}.` };
  }

  // All user-submitted transfers start as pending; admin approves/rejects.
  const txnStatus = "pending" as const;

  const note = `${d.rail} transfer to ${d.recipientName} (${d.recipientCountry})${d.note ? ` — ${d.note}` : ""}`;

  // Ensure both collections exist BEFORE opening a transaction.
  // MongoDB Atlas (and replica sets) cannot create a new collection inside a
  // multi-document transaction — it throws WriteConflict (code 112).
  // createCollection() is a no-op when the collection already exists.
  await Promise.all([
    InternationalTransaction.createCollection().catch(() => {}),
    Transaction.createCollection().catch(() => {}),
  ]);

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    // 1. Debit sender
    senderAccount.balance -= totalDebit;
    await senderAccount.save({ session: dbSession });

    // 2. Create InternationalTransaction record
    const [intlTxn] = await InternationalTransaction.create(
      [
        {
          senderId:         session.userId,
          senderAccountId:  senderAccount._id,
          rail:             d.rail,
          transferType:     d.transferType,
          recipientName:    d.recipientName,
          recipientCountry: d.recipientCountry,
          bankName:         d.bankName,
          accountNumber:    d.accountNumber ?? null,
          routingNumber:    d.routingNumber ?? null,
          accountType:      d.accountType ?? null,
          sortCode:         d.sortCode ? d.sortCode.replace(/\D/g, "") : null,
          iban:             d.iban ? normalizeIBAN(d.iban) : null,
          swiftCode:        d.swiftCode?.toUpperCase() ?? null,
          bankAddress:      d.bankAddress ?? null,
          recipientAddress: d.recipientAddress ?? null,
          purpose:          d.purpose ?? null,
          amount:           d.amount,
          fee:              d.fee,
          fxRate:           d.fxRate,
          toCurrency:       d.toCurrency,
          convertedAmount:  d.convertedAmount,
          note:             d.note ?? "",
          status:           txnStatus,
          initiatedBy:      "user",
        },
      ],
      { session: dbSession }
    );

    // 3. Create a Transaction debit record so it appears in history
    await Transaction.create(
      [
        {
          type:              "debit",
          senderId:          session.userId,
          receiverId:        null,
          senderAccountId:   senderAccount._id,
          receiverAccountId: null,
          amount:            totalDebit,
          note,
          status:            txnStatus,
          initiatedBy:       "user",
        },
      ],
      { session: dbSession }
    );

    await dbSession.commitTransaction();

    // 4. Confirmation email (fire-and-forget)
    const sender = await User.findById(session.userId).select("email firstName").lean() as { email: string; firstName: string } | null;
    if (sender) {
      const { subject, html, text } = transactionEmail({
        recipientName: sender.firstName,
        type: "sent",
        amount: totalDebit,
        newBalance: senderAccount.balance,
        counterparty: `${d.recipientName} (${d.recipientCountry} · ${d.rail.replace("_", " ")})`,
        note: d.note || undefined,
        date: new Date(),
      });
      sendMail({ to: sender.email, subject, html, text });
    }

    return { success: true, transactionId: intlTxn._id.toString(), status: txnStatus };
  } catch (err) {
    await dbSession.abortTransaction();
    console.error("[intl-transfer]", err);
    return { error: "Transfer failed. Please try again." };
  } finally {
    dbSession.endSession();
  }
}

// ── History ───────────────────────────────────────────────────────────────────

export async function getInternationalTransfersByUser(userId: string, page = 1) {
  await connectDB();
  const limit = 10;
  const skip = (page - 1) * limit;

  const [transfers, total] = await Promise.all([
    InternationalTransaction.find({ senderId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    InternationalTransaction.countDocuments({ senderId: userId }),
  ]);

  return parseStringify({ transfers, total, page, totalPages: Math.ceil(total / limit) });
}
