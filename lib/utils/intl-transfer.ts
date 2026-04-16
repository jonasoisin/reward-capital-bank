// ─── Validation utilities for international transfers ───────────────────────

/**
 * IBAN validation using ISO 13616 MOD-97 algorithm.
 */
export function validateIBAN(raw: string): { valid: boolean; country: string | null; error?: string } {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  if (iban.length < 15 || iban.length > 34) {
    return { valid: false, country: null, error: "IBAN length is invalid" };
  }
  const country = iban.slice(0, 2);
  if (!/^[A-Z]{2}\d{2}/.test(iban)) {
    return { valid: false, country: null, error: "IBAN format is invalid" };
  }
  // Move first 4 chars to end, then replace letters A=10 … Z=35
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      return code >= 65 && code <= 90 ? (code - 55).toString() : c;
    })
    .join("");
  try {
    const remainder = BigInt(numeric) % BigInt(97);
    if (remainder !== BigInt(1)) {
      return { valid: false, country, error: "IBAN checksum is invalid" };
    }
  } catch {
    return { valid: false, country, error: "IBAN contains invalid characters" };
  }
  return { valid: true, country };
}

/**
 * ABA routing number checksum (US Federal Reserve algorithm).
 */
export function validateRoutingNumber(routing: string): boolean {
  const cleaned = routing.replace(/\D/g, "");
  if (cleaned.length !== 9) return false;
  const d = cleaned.split("").map(Number);
  const sum =
    3 * (d[0] + d[3] + d[6]) +
    7 * (d[1] + d[4] + d[7]) +
    1 * (d[2] + d[5] + d[8]);
  return sum % 10 === 0;
}

/**
 * UK sort code — 6 digits after stripping hyphens/spaces.
 */
export function validateSortCode(raw: string): boolean {
  return /^\d{6}$/.test(raw.replace(/[-\s]/g, ""));
}

/**
 * SWIFT/BIC: 6 alpha (bank + country) + 2 alphanumeric (location) + optional 3 (branch)
 */
export function validateSWIFT(bic: string): boolean {
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic.trim().toUpperCase());
}

/** Auto-format sort code as XX-XX-XX while user is typing */
export function formatSortCode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

/** Strip spaces and uppercase an IBAN for storage */
export function normalizeIBAN(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase();
}

// ─── Country / rail helpers ──────────────────────────────────────────────────

export const SEPA_COUNTRY_CODES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU",
  "IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES",
  "SE","NO","CH","LI","IS","GB", // GB is SEPA-adjacent for IBAN transfers
]);

export const TRANSFER_COUNTRIES = [
  // US
  { code: "US", name: "United States",         currency: "USD", group: "us"   },
  // UK
  { code: "GB", name: "United Kingdom",        currency: "GBP", group: "uk"   },
  // Eurozone
  { code: "DE", name: "Germany",               currency: "EUR", group: "sepa" },
  { code: "FR", name: "France",                currency: "EUR", group: "sepa" },
  { code: "IT", name: "Italy",                 currency: "EUR", group: "sepa" },
  { code: "ES", name: "Spain",                 currency: "EUR", group: "sepa" },
  { code: "NL", name: "Netherlands",           currency: "EUR", group: "sepa" },
  { code: "BE", name: "Belgium",               currency: "EUR", group: "sepa" },
  { code: "AT", name: "Austria",               currency: "EUR", group: "sepa" },
  { code: "PT", name: "Portugal",              currency: "EUR", group: "sepa" },
  { code: "IE", name: "Ireland",               currency: "EUR", group: "sepa" },
  { code: "FI", name: "Finland",               currency: "EUR", group: "sepa" },
  { code: "GR", name: "Greece",               currency: "EUR", group: "sepa" },
  { code: "LU", name: "Luxembourg",            currency: "EUR", group: "sepa" },
  { code: "MT", name: "Malta",                 currency: "EUR", group: "sepa" },
  { code: "CY", name: "Cyprus",                currency: "EUR", group: "sepa" },
  { code: "EE", name: "Estonia",               currency: "EUR", group: "sepa" },
  { code: "LV", name: "Latvia",                currency: "EUR", group: "sepa" },
  { code: "LT", name: "Lithuania",             currency: "EUR", group: "sepa" },
  { code: "SK", name: "Slovakia",              currency: "EUR", group: "sepa" },
  { code: "SI", name: "Slovenia",              currency: "EUR", group: "sepa" },
  // SEPA non-Euro
  { code: "CH", name: "Switzerland",           currency: "CHF", group: "sepa" },
  { code: "NO", name: "Norway",                currency: "NOK", group: "sepa" },
  { code: "SE", name: "Sweden",                currency: "SEK", group: "sepa" },
  { code: "DK", name: "Denmark",               currency: "DKK", group: "sepa" },
  { code: "PL", name: "Poland",                currency: "PLN", group: "sepa" },
  { code: "CZ", name: "Czech Republic",        currency: "CZK", group: "sepa" },
  // International (SWIFT)
  { code: "CA", name: "Canada",                currency: "CAD", group: "swift" },
  { code: "AU", name: "Australia",             currency: "AUD", group: "swift" },
  { code: "JP", name: "Japan",                 currency: "JPY", group: "swift" },
  { code: "SG", name: "Singapore",             currency: "SGD", group: "swift" },
  { code: "AE", name: "United Arab Emirates",  currency: "AED", group: "swift" },
  { code: "IN", name: "India",                 currency: "INR", group: "swift" },
  { code: "CN", name: "China",                 currency: "CNY", group: "swift" },
  { code: "BR", name: "Brazil",                currency: "BRL", group: "swift" },
  { code: "MX", name: "Mexico",                currency: "MXN", group: "swift" },
  { code: "ZA", name: "South Africa",          currency: "ZAR", group: "swift" },
  { code: "NG", name: "Nigeria",               currency: "NGN", group: "swift" },
  { code: "GH", name: "Ghana",                 currency: "GHS", group: "swift" },
  { code: "XX", name: "Other",                 currency: "USD", group: "swift" },
] as const;

export type TransferRail = "US_ACH" | "US_WIRE" | "UK_FPS" | "EU_SEPA" | "SWIFT";

export function computeRail(
  countryCode: string,
  transferType: "domestic" | "international",
  usSubRail?: "ACH" | "WIRE"
): TransferRail {
  if (transferType === "international") return "SWIFT";
  const country = TRANSFER_COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return "SWIFT";
  if (country.group === "us") return usSubRail === "WIRE" ? "US_WIRE" : "US_ACH";
  if (country.group === "uk") return "UK_FPS";
  if (country.group === "sepa") return "EU_SEPA";
  return "SWIFT";
}

export function getTargetCurrency(countryCode: string): string {
  return TRANSFER_COUNTRIES.find((c) => c.code === countryCode)?.currency ?? "USD";
}

// ─── Mock FX rates ────────────────────────────────────────────────────────────

export const FX_DATA: Record<string, { rate: number; fee: number; delivery: string }> = {
  USD: { rate: 1.000,  fee: 0.00,  delivery: "Instant"              },
  GBP: { rate: 0.790,  fee: 1.50,  delivery: "Within 2 hours"       },
  EUR: { rate: 0.920,  fee: 3.50,  delivery: "1 business day"       },
  CHF: { rate: 0.900,  fee: 5.00,  delivery: "1–2 business days"    },
  NOK: { rate: 10.70,  fee: 3.50,  delivery: "1–2 business days"    },
  SEK: { rate: 10.50,  fee: 3.50,  delivery: "1–2 business days"    },
  DKK: { rate: 6.920,  fee: 3.50,  delivery: "1–2 business days"    },
  PLN: { rate: 4.050,  fee: 5.00,  delivery: "1–2 business days"    },
  CZK: { rate: 22.80,  fee: 5.00,  delivery: "1–2 business days"    },
  CAD: { rate: 1.360,  fee: 8.00,  delivery: "2–4 business days"    },
  AUD: { rate: 1.540,  fee: 8.00,  delivery: "2–4 business days"    },
  JPY: { rate: 148.5,  fee: 12.00, delivery: "2–4 business days"    },
  SGD: { rate: 1.340,  fee: 10.00, delivery: "2–4 business days"    },
  AED: { rate: 3.670,  fee: 10.00, delivery: "2–4 business days"    },
  INR: { rate: 83.50,  fee: 15.00, delivery: "2–5 business days"    },
  CNY: { rate: 7.230,  fee: 15.00, delivery: "2–5 business days"    },
  BRL: { rate: 5.040,  fee: 15.00, delivery: "3–5 business days"    },
  MXN: { rate: 17.20,  fee: 10.00, delivery: "2–4 business days"    },
  ZAR: { rate: 18.90,  fee: 15.00, delivery: "3–5 business days"    },
  NGN: { rate: 1520,   fee: 25.00, delivery: "3–5 business days"    },
  GHS: { rate: 15.20,  fee: 20.00, delivery: "3–5 business days"    },
};

export const DEFAULT_FX = { rate: 1.00, fee: 25.00, delivery: "3–5 business days" };
