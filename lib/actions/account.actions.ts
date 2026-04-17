"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Account from "@/lib/models/Account";
import Transaction from "@/lib/models/Transaction";
import AdminLog from "@/lib/models/AdminLog";
import User from "@/lib/models/User";
import { getSessionUser } from "@/lib/auth";
import { parseStringify } from "@/lib/utils";

export async function getAccount(userId: string) {
  await connectDB();
  const account = await Account.findOne({ userId }).lean();
  if (!account) return null;
  return parseStringify(account);
}

export async function getAccountByNumber(accountNumber: string) {
  await connectDB();
  const account = await Account.findOne({ accountNumber }).lean();
  if (!account) return null;
  return parseStringify(account);
}

// ── Backdated history generator ───────────────────────────────────────────────

const CREDIT_NOTES = [
  "Direct Deposit — Payroll",
  "ACH Credit — Employer",
  "Zelle Transfer Received",
  "Mobile Check Deposit",
  "Wire Transfer Received",
  "Direct Deposit",
  "ACH Transfer In",
  "Salary Deposit",
  "Transfer from External Account",
  "Refund — Purchase Return",
  "Dividend Payment",
  "Interest Credit",
  "Direct Deposit — Benefits",
  "ACH Credit — Freelance",
  "Bank Transfer Received",
  "Direct Deposit — Bonus",
  "Venmo Transfer",
  "ACH Credit — Consulting",
];

const DEBIT_NOTES = [
  "Bill Payment — Utilities",
  "ATM Withdrawal",
  "ACH Debit — Insurance Premium",
  "Online Purchase",
  "Bill Payment — Internet",
  "Subscription Service",
  "Bill Payment — Phone",
  "Grocery Purchase",
  "Gas Station",
  "Restaurant Payment",
  "ACH Debit — Rent",
  "Bill Payment — Cable",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function randomDateInRange(from: Date, to: Date): Date {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

/**
 * Generates a realistic series of backdated credit/debit transactions
 * that net to `targetAmount`. Spread randomly over the past 2 years.
 * Transactions are returned sorted oldest → newest.
 */
function buildBackdatedHistory(
  targetAmount: number,
  userId: Types.ObjectId,
  accountId: Types.ObjectId
) {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);

  // Generate debit entries — small realistic amounts
  const numDebits = Math.floor(targetAmount / 3000) + Math.floor(Math.random() * 6) + 4;
  const debitAmounts: number[] = Array.from({ length: numDebits }, () =>
    randomBetween(45, Math.min(600, targetAmount * 0.03))
  );
  const totalDebits = debitAmounts.reduce((s, v) => s + v, 0);

  // Credits must cover debits + reach the target net
  const totalCreditsNeeded = Math.round((targetAmount + totalDebits) * 100) / 100;
  const numCredits = Math.floor(targetAmount / 2000) + Math.floor(Math.random() * 8) + 8;

  // Split totalCreditsNeeded across numCredits entries
  const creditAmounts: number[] = [];
  let remaining = totalCreditsNeeded;
  for (let i = 0; i < numCredits - 1; i++) {
    const lo = Math.max(100, remaining * 0.02);
    const hi = Math.min(remaining * 0.35, remaining - 100 * (numCredits - 1 - i));
    const chunk = hi > lo ? randomBetween(lo, hi) : lo;
    creditAmounts.push(chunk);
    remaining = Math.round((remaining - chunk) * 100) / 100;
  }
  creditAmounts.push(Math.round(remaining * 100) / 100);

  const shuffledCreditNotes = shuffle(CREDIT_NOTES);
  const shuffledDebitNotes  = shuffle(DEBIT_NOTES);

  const docs = [
    ...creditAmounts.map((amount, i) => ({
      type: "credit" as const,
      receiverId: userId,
      receiverAccountId: accountId,
      amount,
      note: shuffledCreditNotes[i % shuffledCreditNotes.length],
      status: "completed" as const,
      ledgerState: "posted" as const,
      initiatedBy: "user" as const,
      createdAt: randomDateInRange(twoYearsAgo, now),
    })),
    ...debitAmounts.map((amount, i) => ({
      type: "debit" as const,
      senderId: userId,
      senderAccountId: accountId,
      amount,
      note: shuffledDebitNotes[i % shuffledDebitNotes.length],
      status: "completed" as const,
      ledgerState: "posted" as const,
      initiatedBy: "user" as const,
      createdAt: randomDateInRange(twoYearsAgo, now),
    })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return docs;
}

// ── Credit account ─────────────────────────────────────────────────────────────

export async function creditAccount(
  accountId: string,
  amount: number,
  adminId: string,
  note: string
) {
  await connectDB();

  const schema = z.object({
    amount: z.number().positive(),
    note: z.string().min(1),
  });
  const parsed = schema.safeParse({ amount, note });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const account = await Account.findById(accountId);
  if (!account) return { error: "Account not found." };
  if (account.status !== "active") return { error: "Account is not active." };

  // Build backdated history before opening the DB transaction
  const historyDocs = buildBackdatedHistory(
    amount,
    account.userId as Types.ObjectId,
    account._id as Types.ObjectId
  );

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Update balance
    account.availableBalance += amount;
    account.ledgerBalance    += amount;
    await account.save({ session });

    // Insert backdated history — bypass auto-timestamp so createdAt sticks
    await Transaction.collection.insertMany(
      historyDocs.map(doc => ({
        ...doc,
        updatedAt: doc.createdAt,
        _id: new mongoose.Types.ObjectId(),
      })),
      { session }
    );

    // Admin audit log only — never visible to the user
    await AdminLog.create(
      [
        {
          adminId,
          action: "credit",
          targetUserId: account.userId,
          targetAccountId: account._id,
          amount,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    revalidatePath("/dashboard");
    revalidatePath("/transaction-history");
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return { error: "Transaction failed." };
  } finally {
    session.endSession();
  }
}

export async function debitAccount(
  accountId: string,
  amount: number,
  adminId: string,
  note: string
) {
  await connectDB();

  const schema = z.object({
    amount: z.number().positive(),
    note: z.string().min(1),
  });
  const parsed = schema.safeParse({ amount, note });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const account = await Account.findById(accountId);
  if (!account) return { error: "Account not found." };
  if (account.status !== "active") return { error: "Account is not active." };
  if (account.availableBalance < amount)
    return { error: "Insufficient balance for debit." };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    account.availableBalance -= amount;
    account.ledgerBalance    -= amount;
    await account.save({ session });

    const txn = await Transaction.create(
      [
        {
          type: "debit",
          receiverId: account.userId,
          receiverAccountId: account._id,
          amount,
          note,
          status: "completed",
          initiatedBy: "admin",
          adminId,
        },
      ],
      { session }
    );

    await AdminLog.create(
      [
        {
          adminId,
          action: "debit",
          targetUserId: account.userId,
          targetAccountId: account._id,
          targetTransactionId: txn[0]._id,
          amount,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    revalidatePath("/dashboard");
    revalidatePath("/transaction-history");
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return { error: "Transaction failed." };
  } finally {
    session.endSession();
  }
}

export async function blockAccount(
  accountId: string,
  adminId: string,
  reason: string
) {
  await connectDB();

  const account = await Account.findById(accountId);
  if (!account) return { error: "Account not found." };

  account.status = "frozen";
  await account.save();

  await AdminLog.create({
    adminId,
    action: "block_account",
    targetUserId: account.userId,
    targetAccountId: account._id,
    note: reason,
  });

  return { success: true };
}

export async function unblockAccount(accountId: string, adminId: string) {
  await connectDB();

  const account = await Account.findById(accountId);
  if (!account) return { error: "Account not found." };

  account.status = "active";
  await account.save();

  await AdminLog.create({
    adminId,
    action: "unblock_account",
    targetUserId: account.userId,
    targetAccountId: account._id,
    note: "Account unblocked by admin",
  });

  return { success: true };
}

export async function getUserAccountWithBalance(userId: string) {
  await connectDB();
  const account = await Account.findOne({ userId }).lean();
  if (!account) return null;

  const user = await User.findById(userId).select("-passwordHash").lean();
  if (!user) return null;

  return parseStringify({ account, user });
}
