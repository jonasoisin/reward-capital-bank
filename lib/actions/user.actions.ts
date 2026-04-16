"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Account from "@/lib/models/Account";
import { signToken, setAuthCookie, clearAuthCookie, getSessionUser } from "@/lib/auth";
import { parseStringify } from "@/lib/utils";
import { sendMail } from "@/lib/mailer";
import { welcomeEmail } from "@/lib/emails/welcome";

async function generateAccountNumber(): Promise<string> {
  let accountNumber: string;
  let exists = true;
  do {
    accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
    exists = !!(await Account.findOne({ accountNumber }));
  } while (exists);
  return accountNumber;
}

const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signUp(data: unknown) {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { firstName, lastName, email, password, phone, address, dateOfBirth } =
    parsed.data;

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    phone: phone ?? "",
    address: address ?? "",
    dateOfBirth: dateOfBirth ?? "",
    role: "user",
    status: "active",
  });

  // Auto-create bank account
  const accountNumber = await generateAccountNumber();
  await Account.create({
    userId: user._id,
    accountNumber,
    balance: 0,
    currency: "USD",
    status: "active",
  });

  const token = await signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  setAuthCookie(token);

  // Fire-and-forget — don't let email failure block account creation
  const { subject, html, text } = welcomeEmail(user.firstName, accountNumber);
  sendMail({ to: user.email, subject, html, text });

  return { redirectTo: "/dashboard" };
}

// ── Shared auth core (not exported) ────────────────────────────────────────
async function _authenticate(data: unknown) {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid email or password." };

  const { email, password } = parsed.data;
  await connectDB();

  // Lowercase to match how the schema stores it
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return { error: "Invalid email or password." };

  if (user.status === "blocked") {
    return { error: "Your account has been blocked. Please contact support." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Invalid email or password." };

  const token = await signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  setAuthCookie(token);
  return { ok: true, role: user.role as "user" | "admin" };
}

// ── User sign-in
export async function signInUser(
  data: unknown
): Promise<{ error: string } | { redirectTo: string }> {
  const result = await _authenticate(data);
  if ("error" in result) return { error: result.error ?? "Authentication failed." };
  return { redirectTo: "/dashboard" };
}

// ── Admin sign-in — validates role
export async function adminSignIn(
  data: unknown
): Promise<{ error: string } | { redirectTo: string }> {
  const result = await _authenticate(data);
  if ("error" in result) return { error: result.error ?? "Authentication failed." };
  if (result.role !== "admin") return { error: "Not authorised. Admin access only." };
  return { redirectTo: "/admin/dashboard" };
}

// ── Raw — returns role, no redirect (for internal use)
export async function signIn(data: unknown) {
  const result = await _authenticate(data);
  if ("error" in result) return result;
  return { role: result.role };
}

export async function getLoggedInUser() {
  const session = getSessionUser();
  if (!session) return null;

  await connectDB();

  const user = await User.findById(session.userId).select("-passwordHash");
  if (!user) return null;

  return parseStringify(user);
}

export async function logoutAccount(): Promise<{ redirectTo: string }> {
  clearAuthCookie();
  return { redirectTo: "/sign-in" };
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = getSessionUser();
  if (!session) return { error: "Not authenticated." };

  if (!data.newPassword || data.newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  await connectDB();

  const user = await User.findById(session.userId);
  if (!user) return { error: "User not found." };

  const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  user.passwordHash = await bcrypt.hash(data.newPassword, 12);
  await user.save();

  return { success: true };
}

export async function updateProfile(data: {
  phone?: string;
  address?: string;
}) {
  const session = getSessionUser();
  if (!session) return { error: "Not authenticated." };

  await connectDB();

  await User.findByIdAndUpdate(session.userId, {
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.address !== undefined && { address: data.address }),
  });

  return { success: true };
}
