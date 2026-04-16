"use server";

import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Account from "@/lib/models/Account";
import User from "@/lib/models/User";
import Recipient from "@/lib/models/Recipient";
import { getSessionUser } from "@/lib/auth";
import { parseStringify } from "@/lib/utils";

/**
 * Look up who owns an account number.
 * Returns only the full name — never exposes email or internal IDs.
 */
export async function lookupAccount(accountNumber: string) {
  const session = getSessionUser();
  if (!session || session.role !== "user") return { error: "Not authenticated." };

  if (!/^\d{10,}$/.test(accountNumber.trim())) {
    return { error: "Enter a valid account number." };
  }

  await connectDB();

  const account = await Account.findOne({
    accountNumber: accountNumber.trim(),
    status: "active",
  }).lean();

  if (!account) return { error: "Account not found." };

  // Prevent self-lookup (caller just needs to know it won't work)
  const senderAccount = await Account.findOne({ userId: session.userId }).lean();
  if (senderAccount && String(senderAccount._id) === String(account._id)) {
    return { error: "Cannot send money to your own account." };
  }

  const owner = await User.findById(account.userId)
    .select("firstName lastName status")
    .lean() as { firstName: string; lastName: string; status: string } | null;

  if (!owner) return { error: "Account not found." };
  if (owner.status === "blocked") return { error: "Recipient account is unavailable." };

  return { name: `${owner.firstName} ${owner.lastName}` };
}

/**
 * Save a recipient to the current user's address book.
 * Upserts so re-saving an existing entry just updates the nickname.
 */
export async function saveRecipient(data: unknown) {
  const session = getSessionUser();
  if (!session || session.role !== "user") return { error: "Not authenticated." };

  const schema = z.object({
    recipientAccountNumber: z.string().min(10),
    recipientName: z.string().min(1),
    nickname: z.string().max(40).optional(),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  await connectDB();

  await Recipient.findOneAndUpdate(
    {
      userId: session.userId,
      recipientAccountNumber: parsed.data.recipientAccountNumber,
    },
    {
      recipientName: parsed.data.recipientName,
      nickname: parsed.data.nickname ?? "",
    },
    { upsert: true, new: true }
  );

  return { success: true };
}

/**
 * Return all saved recipients for the current user, sorted by most recently used.
 */
export async function getSavedRecipients() {
  const session = getSessionUser();
  if (!session || session.role !== "user") return { error: "Not authenticated." };

  await connectDB();

  const recipients = await Recipient.find({ userId: session.userId })
    .sort({ lastUsedAt: -1, useCount: -1, createdAt: -1 })
    .lean();

  return parseStringify(recipients);
}

/**
 * Remove a saved recipient from the current user's address book.
 */
export async function deleteRecipient(recipientId: string) {
  const session = getSessionUser();
  if (!session || session.role !== "user") return { error: "Not authenticated." };

  await connectDB();

  await Recipient.deleteOne({ _id: recipientId, userId: session.userId });

  return { success: true };
}

/**
 * Called after a successful transfer to bump lastUsedAt and useCount.
 * Internal — not exported as a public server action endpoint.
 */
export async function _markRecipientUsed(userId: string, accountNumber: string) {
  await Recipient.findOneAndUpdate(
    { userId, recipientAccountNumber: accountNumber },
    { $set: { lastUsedAt: new Date() }, $inc: { useCount: 1 } }
  );
}
