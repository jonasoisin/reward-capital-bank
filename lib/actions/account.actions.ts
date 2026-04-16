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

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    account.balance += amount;
    await account.save({ session });

    const txn = await Transaction.create(
      [
        {
          type: "credit",
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
          action: "credit",
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
  if (account.balance < amount)
    return { error: "Insufficient balance for debit." };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    account.balance -= amount;
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
