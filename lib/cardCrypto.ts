/**
 * AES-256-GCM encryption for card CVV.
 * CVV is never stored in plaintext — only the encrypted blob is persisted.
 * The key is derived from JWT_SECRET so rotating the secret invalidates all CVVs.
 */

import crypto from "crypto";

function getKey(): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  // Derive a 32-byte key from the secret
  return crypto.scryptSync(secret, "banking-card-cvv-v1", 32);
}

export function encryptCVV(cvv: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(cvv, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 128-bit authentication tag
  // Store as iv:ciphertext:authTag (all hex)
  return `${iv.toString("hex")}:${encrypted.toString("hex")}:${authTag.toString("hex")}`;
}

export function decryptCVV(blob: string): string {
  const parts = blob.split(":");
  if (parts.length !== 3) throw new Error("Invalid CVV blob");
  const [ivHex, encHex, tagHex] = parts;
  const key = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
