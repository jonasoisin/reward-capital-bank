"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Account from "@/lib/models/Account";
import Transaction from "@/lib/models/Transaction";
import AdminLog from "@/lib/models/AdminLog";
import { parseStringify } from "@/lib/utils";

export async function getAllUsers(
  page = 1,
  filters: { status?: string; search?: string } = {}
) {
  await connectDB();

  const limit = 20;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { role: "user" };
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { firstName: { $regex: filters.search, $options: "i" } },
      { lastName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return parseStringify({ users, total, page, totalPages: Math.ceil(total / limit) });
}

export async function getUserById(userId: string) {
  await connectDB();

  const user = await User.findById(userId).select("-passwordHash").lean();
  if (!user) return null;

  const account = await Account.findOne({ userId }).lean();

  return parseStringify({ user, account });
}

export async function blockUser(userId: string, adminId: string, reason: string) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) return { error: "User not found." };

  user.status = "blocked";
  await user.save();

  await AdminLog.create({
    adminId,
    action: "block_account",
    targetUserId: userId,
    note: reason || "User blocked by admin",
  });

  return { success: true };
}

export async function unblockUser(userId: string, adminId: string) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) return { error: "User not found." };

  user.status = "active";
  await user.save();

  await AdminLog.create({
    adminId,
    action: "unblock_account",
    targetUserId: userId,
    note: "User unblocked by admin",
  });

  return { success: true };
}

export async function getAdminLogs(page = 1) {
  await connectDB();

  const limit = 20;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AdminLog.find()
      .populate("adminId", "firstName lastName email")
      .populate("targetUserId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AdminLog.countDocuments(),
  ]);

  return parseStringify({ logs, total, page, totalPages: Math.ceil(total / limit) });
}

export async function getDashboardStats() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalTransactions,
    todayTransactions,
    pendingTransactions,
    volumeResult,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Transaction.countDocuments(),
    Transaction.countDocuments({ createdAt: { $gte: today } }),
    Transaction.countDocuments({ status: "pending" }),
    Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalVolume = volumeResult[0]?.total ?? 0;

  return parseStringify({
    totalUsers,
    totalTransactions,
    todayTransactions,
    pendingTransactions,
    totalVolume,
  });
}
