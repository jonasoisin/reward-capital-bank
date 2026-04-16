"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Account from "@/lib/models/Account";
import Transaction from "@/lib/models/Transaction";
import AdminLog from "@/lib/models/AdminLog";
import User from "@/lib/models/User";
import { getSessionUser } from "@/lib/auth";
import { parseStringify } from "@/lib/utils";
import { sendMail } from "@/lib/mailer";
import { transactionEmail } from "@/lib/emails/transaction";
import { _markRecipientUsed } from "@/lib/actions/recipient.actions";

// ── Transfer limits ───────────────────────────────────────────────────────────

/** Daily outgoing limit for domestic (internal) transfers. */
const DOMESTIC_DAILY_LIMIT = 10_000;

/** Check how much a user has already sent today (pending + non-rejected). */
async function getDailyOutgoing(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const agg = await Transaction.aggregate([
    {
      $match: {
        senderId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startOfDay },
        status: { $ne: "rejected" },
        initiatedBy: "user",
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return agg[0]?.total ?? 0;
}

// ── Schema ────────────────────────────────────────────────────────────────────

const transferSchema = z.object({
  receiverAccountNumber: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().optional(),
});

// ── Create domestic transfer ──────────────────────────────────────────────────

export async function createTransfer(data: unknown) {
  const session = getSessionUser();
  if (!session || session.role !== "user") return { error: "Not authenticated." };

  const parsed = transferSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { receiverAccountNumber, amount, note } = parsed.data;

  await connectDB();

  const senderAccount = await Account.findOne({ userId: session.userId });
  if (!senderAccount) return { error: "Your account was not found." };
  if (senderAccount.status !== "active") return { error: "Your account is frozen or closed." };

  // Savings withdrawal limit
  if (senderAccount.accountType === "savings" && senderAccount.withdrawalLimit !== -1) {
    if (senderAccount.withdrawalCount >= senderAccount.withdrawalLimit) {
      return { error: `Savings withdrawal limit reached (${senderAccount.withdrawalLimit}/month). Try again next month.` };
    }
  }

  // Daily limit
  const usedToday = await getDailyOutgoing(session.userId);
  if (usedToday + amount > DOMESTIC_DAILY_LIMIT) {
    const remaining = Math.max(0, DOMESTIC_DAILY_LIMIT - usedToday);
    return { error: `Daily transfer limit exceeded. You can send up to ${remaining.toLocaleString("en-US", { style: "currency", currency: "USD" })} more today.` };
  }

  const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber });
  if (!receiverAccount) return { error: "Recipient account not found." };
  if (receiverAccount.status !== "active") return { error: "Recipient account is not active." };
  if (senderAccount._id.equals(receiverAccount._id)) return { error: "Cannot transfer to your own account." };

  // Guard against available balance (not ledger)
  if (senderAccount.availableBalance < amount) return { error: "Insufficient balance." };

  await Transaction.createCollection().catch(() => { });

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    // Adjust available balances immediately (pending debit/credit)
    senderAccount.availableBalance -= amount;
    await senderAccount.save({ session: dbSession });

    receiverAccount.availableBalance += amount;
    await receiverAccount.save({ session: dbSession });

    // Increment savings withdrawal counter
    if (senderAccount.accountType === "savings" && senderAccount.withdrawalLimit !== -1) {
      senderAccount.withdrawalCount += 1;
      await senderAccount.save({ session: dbSession });
    }

    await Transaction.create(
      [
        {
          type: "transfer",
          senderId: session.userId,
          receiverId: receiverAccount.userId,
          senderAccountId: senderAccount._id,
          receiverAccountId: receiverAccount._id,
          amount,
          note: note ?? "",
          status: "pending",
          ledgerState: "pending",
          initiatedBy: "user",
        },
      ],
      { session: dbSession }
    );

    await dbSession.commitTransaction();

    // Fire-and-forget emails
    const [sender, receiver] = await Promise.all([
      User.findById(session.userId).select("email firstName lastName").lean(),
      User.findById(receiverAccount.userId).select("email firstName lastName").lean(),
    ]);
    const now = new Date();
    if (sender) {
      const { subject, html, text } = transactionEmail({
        recipientName: (sender as { firstName: string }).firstName,
        type: "sent",
        amount,
        newBalance: senderAccount.availableBalance,
        counterparty: receiver ? `${(receiver as { firstName: string; lastName: string }).firstName} ${(receiver as { firstName: string; lastName: string }).lastName}` : undefined,
        note: note || undefined,
        date: now,
      });
      sendMail({ to: (sender as { email: string }).email, subject, html, text });
    }
    if (receiver) {
      const { subject, html, text } = transactionEmail({
        recipientName: (receiver as { firstName: string }).firstName,
        type: "received",
        amount,
        newBalance: receiverAccount.availableBalance,
        counterparty: sender ? `${(sender as { firstName: string; lastName: string }).firstName} ${(sender as { firstName: string; lastName: string }).lastName}` : undefined,
        note: note || undefined,
        date: now,
      });
      sendMail({ to: (receiver as { email: string }).email, subject, html, text });
    }

    _markRecipientUsed(session.userId, receiverAccountNumber).catch(() => { });
    return { success: true };
  } catch (err) {
    await dbSession.abortTransaction();
    console.error(err);
    return { error: "Transfer failed. Please try again." };
  } finally {
    dbSession.endSession();
  }
}

// ── Query helpers ─────────────────────────────────────────────────────────────

export async function getTransactionsByUser(
  userId: string,
  page = 1,
  filters: {
    type?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  } = {}
) {
  await connectDB();

  const limit = 10;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    $or: [{ senderId: userId }, { receiverId: userId }],
    initiatedBy: "user",
  };

  if (filters.type) query.type = filters.type;
  if (filters.startDate || filters.endDate) {
    query.createdAt = {
      ...(filters.startDate && { $gte: new Date(filters.startDate) }),
      ...(filters.endDate && { $lte: new Date(filters.endDate) }),
    };
  }
  if (filters.search?.trim()) {
    query.note = { $regex: filters.search.trim(), $options: "i" };
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(query),
  ]);

  return parseStringify({ transactions, total, page, totalPages: Math.ceil(total / limit) });
}

export async function getAllTransactions(
  page = 1,
  filters: {
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  } = {}
) {
  await connectDB();

  const limit = 20;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.startDate || filters.endDate) {
    query.createdAt = {
      ...(filters.startDate && { $gte: new Date(filters.startDate) }),
      ...(filters.endDate && { $lte: new Date(filters.endDate) }),
    };
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate("senderId", "firstName lastName email")
      .populate("receiverId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query),
  ]);

  return parseStringify({ transactions, total, page, totalPages: Math.ceil(total / limit) });
}

// ── Admin: approve → post to ledger ──────────────────────────────────────────

export async function approveTransaction(transactionId: string, adminId: string) {
  await connectDB();

  const txn = await Transaction.findById(transactionId);
  if (!txn) return { error: "Transaction not found." };
  if (txn.status !== "pending") return { error: "Transaction is not pending." };

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    // Post to ledger
    if (txn.senderAccountId) {
      await Account.findByIdAndUpdate(
        txn.senderAccountId,
        { $inc: { ledgerBalance: -txn.amount } },
        { session: dbSession }
      );
    }
    // Domestic transfer: credit receiver ledger too
    if (txn.type === "transfer" && txn.receiverAccountId) {
      await Account.findByIdAndUpdate(
        txn.receiverAccountId,
        { $inc: { ledgerBalance: txn.amount } },
        { session: dbSession }
      );
    }

    txn.status = "approved";
    txn.ledgerState = "posted";
    await txn.save({ session: dbSession });

    await AdminLog.create(
      [{
        adminId,
        action: "approve_transaction",
        targetUserId: txn.senderId ?? txn.receiverId,
        targetTransactionId: txn._id,
        note: "Transaction approved and posted to ledger",
      }],
      { session: dbSession }
    );

    await dbSession.commitTransaction();
    return { success: true };
  } catch (err) {
    await dbSession.abortTransaction();
    console.error(err);
    return { error: "Approval failed." };
  } finally {
    dbSession.endSession();
  }
}

// ── Admin: reject → reverse available balance ─────────────────────────────────

export async function rejectTransaction(transactionId: string, adminId: string) {
  await connectDB();

  const txn = await Transaction.findById(transactionId);
  if (!txn) return { error: "Transaction not found." };
  if (txn.status !== "pending") return { error: "Transaction is not pending." };

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    // Reverse the pending available balance impact
    if (txn.senderAccountId) {
      await Account.findByIdAndUpdate(
        txn.senderAccountId,
        { $inc: { availableBalance: txn.amount } },
        { session: dbSession }
      );
    }
    // Domestic transfer: also reverse receiver credit
    if (txn.type === "transfer" && txn.receiverAccountId) {
      await Account.findByIdAndUpdate(
        txn.receiverAccountId,
        { $inc: { availableBalance: -txn.amount } },
        { session: dbSession }
      );
    }

    txn.status = "rejected";
    await txn.save({ session: dbSession });

    await AdminLog.create(
      [{
        adminId,
        action: "reject_transaction",
        targetUserId: txn.senderId ?? txn.receiverId,
        targetTransactionId: txn._id,
        note: "Transaction rejected — available balance restored",
      }],
      { session: dbSession }
    );

    await dbSession.commitTransaction();
    return { success: true };
  } catch (err) {
    await dbSession.abortTransaction();
    console.error(err);
    return { error: "Rejection failed." };
  } finally {
    dbSession.endSession();
  }
}

// ── Admin: block ──────────────────────────────────────────────────────────────

export async function blockTransaction(transactionId: string, adminId: string) {
  await connectDB();

  const txn = await Transaction.findById(transactionId);
  if (!txn) return { error: "Transaction not found." };

  txn.status = "blocked";
  await txn.save();

  await AdminLog.create({
    adminId,
    action: "block_transaction",
    targetUserId: txn.senderId ?? txn.receiverId,
    targetTransactionId: txn._id,
    note: "Transaction blocked by admin",
  });

  return { success: true };
}
