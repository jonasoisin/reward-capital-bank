"use server";

import { connectDB } from "@/lib/mongodb";
import Card from "@/lib/models/Card";
import AdminLog from "@/lib/models/AdminLog";
import { getSessionUser } from "@/lib/auth";
import { parseStringify } from "@/lib/utils";
import { generateVisaCardNumber, validateLuhn } from "@/lib/utils/luhn";
import { encryptCVV, decryptCVV } from "@/lib/cardCrypto";

// ── Internal helpers ────────────────────────────────────────────────────────

function generateCVV(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

async function generateUniqueCardNumber(): Promise<string> {
  let cardNumber: string;
  let exists = true;
  let attempts = 0;
  do {
    if (attempts++ > 20) throw new Error("Could not generate unique card number");
    cardNumber = generateVisaCardNumber();
    exists = !!(await Card.findOne({ cardNumber }));
  } while (exists);
  return cardNumber!;
}

// ── Provisioning ─────────────────────────────────────────────────────────────

/** Called during sign-up/account creation. Idempotent — returns existing card if found. */
export async function provisionCard(
  userId: string,
  accountId: string,
  cardHolderName: string
) {
  await connectDB();

  const existing = await Card.findOne({ accountId }).lean();
  if (existing) return parseStringify(existing);

  const cardNumber = await generateUniqueCardNumber();
  if (!validateLuhn(cardNumber)) throw new Error("Generated card failed Luhn check");

  const cvv = generateCVV();
  const cvvEncrypted = encryptCVV(cvv);

  const now = new Date();
  // Virtual cards expire 3 years from issue month
  const expiryDate = new Date(now.getFullYear() + 3, now.getMonth(), 1);

  const card = await Card.create({
    userId,
    accountId,
    cardNumber,
    cvvEncrypted,
    expiryMonth: expiryDate.getMonth() + 1,
    expiryYear: expiryDate.getFullYear(),
    cardHolderName,
    type: "virtual",
    status: "active",
    dailyLimit: 0,
    monthlyLimit: 0,
  });

  return parseStringify(card);
}

// ── User actions ─────────────────────────────────────────────────────────────

/** Returns safe card data (no CVV, masked number) for the dashboard */
export async function getUserCard() {
  const session = getSessionUser();
  if (!session) return null;

  await connectDB();

  const card = await Card.findOne({ userId: session.userId }).lean();
  if (!card) return null;

  return parseStringify({
    _id: card._id,
    userId: card.userId,
    accountId: card.accountId,
    lastFour: card.cardNumber.slice(-4),
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cardHolderName: card.cardHolderName,
    type: card.type,
    status: card.status,
    dailyLimit: card.dailyLimit,
    monthlyLimit: card.monthlyLimit,
    createdAt: card.createdAt,
  });
}

/**
 * Reveals the full card number and CVV for the authenticated user.
 * Call this only when the user explicitly taps "Reveal".
 */
export async function revealCardDetails(): Promise<
  { cardNumber: string; cvv: string; expiryMonth: number; expiryYear: number } | { error: string }
> {
  const session = getSessionUser();
  if (!session) return { error: "Not authenticated." };

  await connectDB();

  const card = await Card.findOne({ userId: session.userId });
  if (!card) return { error: "Card not found." };
  if (card.status === "blocked") return { error: "This card has been blocked." };
  if (card.status === "expired")  return { error: "This card has expired." };

  // Check expiry
  const now = new Date();
  const isExpired =
    card.expiryYear < now.getFullYear() ||
    (card.expiryYear === now.getFullYear() && card.expiryMonth < now.getMonth() + 1);

  if (isExpired) {
    await Card.findByIdAndUpdate(card._id, { status: "expired" });
    return { error: "This card has expired." };
  }

  const cvv = decryptCVV(card.cvvEncrypted);

  return {
    cardNumber: card.cardNumber,
    cvv,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
  };
}

/** User freezes their own card */
export async function freezeCard(): Promise<{ success: boolean } | { error: string }> {
  const session = getSessionUser();
  if (!session) return { error: "Not authenticated." };

  await connectDB();

  const card = await Card.findOne({ userId: session.userId });
  if (!card) return { error: "Card not found." };
  if (card.status === "blocked")  return { error: "Card is blocked by admin and cannot be modified." };
  if (card.status === "expired")  return { error: "Card has expired." };
  if (card.status === "frozen")   return { error: "Card is already frozen." };

  card.status = "frozen";
  await card.save();
  return { success: true };
}

/** User unfreezes their own card */
export async function unfreezeCard(): Promise<{ success: boolean } | { error: string }> {
  const session = getSessionUser();
  if (!session) return { error: "Not authenticated." };

  await connectDB();

  const card = await Card.findOne({ userId: session.userId });
  if (!card) return { error: "Card not found." };
  if (card.status === "blocked")  return { error: "Card is blocked by admin." };
  if (card.status === "expired")  return { error: "Card has expired." };
  if (card.status === "active")   return { error: "Card is already active." };

  card.status = "active";
  await card.save();
  return { success: true };
}

// ── Admin actions ─────────────────────────────────────────────────────────────

export async function adminGetAllCards(page = 1) {
  await connectDB();

  const limit = 20;
  const skip = (page - 1) * limit;

  const [cards, total] = await Promise.all([
    Card.find({})
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Card.countDocuments(),
  ]);

  // Strip cvvEncrypted before returning to admin
  const safe = cards.map(({ cvvEncrypted: _, ...c }) => ({
    ...c,
    lastFour: (c.cardNumber as string).slice(-4),
  }));

  return parseStringify({ cards: safe, total, page, totalPages: Math.ceil(total / limit) });
}

export async function adminBlockCard(cardId: string, adminId: string) {
  await connectDB();

  const card = await Card.findById(cardId);
  if (!card) return { error: "Card not found." };
  if (card.status === "blocked") return { error: "Card is already blocked." };

  card.status = "blocked";
  await card.save();

  await AdminLog.create({
    adminId,
    action: "block_card",
    targetUserId: card.userId,
    note: `Virtual card ending ${card.cardNumber.slice(-4)} blocked`,
  });

  return { success: true };
}

export async function adminUnblockCard(cardId: string, adminId: string) {
  await connectDB();

  const card = await Card.findById(cardId);
  if (!card) return { error: "Card not found." };
  if (card.status !== "blocked") return { error: "Card is not blocked." };

  card.status = "active";
  await card.save();

  await AdminLog.create({
    adminId,
    action: "unblock_card",
    targetUserId: card.userId,
    note: `Virtual card ending ${card.cardNumber.slice(-4)} unblocked`,
  });

  return { success: true };
}

export async function adminSetCardLimits(
  cardId: string,
  adminId: string,
  dailyLimit: number,
  monthlyLimit: number
) {
  await connectDB();

  const card = await Card.findById(cardId);
  if (!card) return { error: "Card not found." };

  card.dailyLimit = dailyLimit;
  card.monthlyLimit = monthlyLimit;
  await card.save();

  await AdminLog.create({
    adminId,
    action: "set_card_limits",
    targetUserId: card.userId,
    targetCardId: card._id,
    note: `Limits set: daily=$${dailyLimit || "∞"}, monthly=$${monthlyLimit || "∞"}`,
  });

  return { success: true };
}

/**
 * Admin reveals full card number + CVV for a specific card.
 * Creates an audit log entry every time this is called.
 */
export async function adminRevealCardDetails(
  cardId: string,
  adminId: string
): Promise<
  | { cardNumber: string; cvv: string; expiryMonth: number; expiryYear: number }
  | { error: string }
> {
  await connectDB();

  const card = await Card.findById(cardId);
  if (!card) return { error: "Card not found." };

  const cvv = decryptCVV(card.cvvEncrypted);

  await AdminLog.create({
    adminId,
    action: "unblock_card", // closest available — audit trail that admin viewed sensitive data
    targetUserId: card.userId,
    targetCardId: card._id,
    note: `Admin revealed full card details for card ending ${card.cardNumber.slice(-4)}`,
  });

  return {
    cardNumber: card.cardNumber,
    cvv,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
  };
}

/** Admin temporarily freezes a card (reversible, distinct from permanent block) */
export async function adminFreezeCard(
  cardId: string,
  adminId: string
): Promise<{ success: boolean } | { error: string }> {
  await connectDB();

  const card = await Card.findById(cardId);
  if (!card) return { error: "Card not found." };
  if (card.status === "blocked")  return { error: "Card is permanently blocked." };
  if (card.status === "expired")  return { error: "Card has expired." };
  if (card.status === "frozen")   return { error: "Card is already frozen." };

  card.status = "frozen";
  await card.save();

  await AdminLog.create({
    adminId,
    action: "block_card",
    targetUserId: card.userId,
    targetCardId: card._id,
    note: `Admin froze card ending ${card.cardNumber.slice(-4)}`,
  });

  return { success: true };
}

/** Admin unfreezes a previously frozen card */
export async function adminUnfreezeCard(
  cardId: string,
  adminId: string
): Promise<{ success: boolean } | { error: string }> {
  await connectDB();

  const card = await Card.findById(cardId);
  if (!card) return { error: "Card not found." };
  if (card.status === "blocked")  return { error: "Card is permanently blocked." };
  if (card.status === "expired")  return { error: "Card has expired." };
  if (card.status === "active")   return { error: "Card is already active." };

  card.status = "active";
  await card.save();

  await AdminLog.create({
    adminId,
    action: "unblock_card",
    targetUserId: card.userId,
    targetCardId: card._id,
    note: `Admin unfroze card ending ${card.cardNumber.slice(-4)}`,
  });

  return { success: true };
}
