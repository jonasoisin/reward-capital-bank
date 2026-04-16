/**
 * Luhn algorithm utilities for Visa card generation.
 * All generated numbers pass the Luhn check used by real card networks.
 */

/** Compute the Luhn check digit for a partial card number string */
function luhnCheckDigit(partial: string): number {
  const digits = partial.split("").map(Number).reverse();
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}

/** Generate a valid 16-digit Visa card number (starts with 4) */
export function generateVisaCardNumber(): string {
  let partial = "4"; // Visa BIN prefix
  while (partial.length < 15) {
    partial += Math.floor(Math.random() * 10);
  }
  return partial + luhnCheckDigit(partial);
}

/** Verify a card number passes the Luhn check */
export function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "").split("").map(Number).reverse();
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Format 16-digit string as "4111 1111 1111 1111" */
export function formatCardNumber(n: string): string {
  return n.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}

/** Mask as "•••• •••• •••• 1234" */
export function maskCardNumber(n: string): string {
  return `•••• •••• •••• ${n.slice(-4)}`;
}
