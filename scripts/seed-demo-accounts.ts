/**
 * Seed demo recipient accounts for development / demo purposes.
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register --project tsconfig.json scripts/seed-demo-accounts.ts
 *
 * Each account gets a fixed, memorable 10-digit account number so developers
 * can use them immediately without looking anything up.
 *
 * Existing accounts are skipped (idempotent — safe to re-run).
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in .env");
  process.exit(1);
}

// ── Inline schemas (avoid Next.js module resolution in a plain Node script) ──

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    accountNumber: { type: String, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

// ── Demo accounts data ────────────────────────────────────────────────────────

const DEMO_ACCOUNTS = [
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@demo.bank",
    accountNumber: "1000000001",
    balance: 5420.0,
    address: "142 Maple Street, Austin TX 78701",
    phone: "+1 512 555 0101",
    dateOfBirth: "1990-03-15",
  },
  {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@demo.bank",
    accountNumber: "1000000002",
    balance: 12800.5,
    address: "88 Oak Avenue, Denver CO 80203",
    phone: "+1 303 555 0202",
    dateOfBirth: "1985-07-22",
  },
  {
    firstName: "Carol",
    lastName: "Davis",
    email: "carol.davis@demo.bank",
    accountNumber: "1000000003",
    balance: 3215.75,
    address: "5 Birch Lane, Seattle WA 98101",
    phone: "+1 206 555 0303",
    dateOfBirth: "1993-11-08",
  },
  {
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@demo.bank",
    accountNumber: "1000000004",
    balance: 8900.0,
    address: "301 Pine Road, Chicago IL 60601",
    phone: "+1 312 555 0404",
    dateOfBirth: "1988-05-30",
  },
  {
    firstName: "Emma",
    lastName: "Brown",
    email: "emma.brown@demo.bank",
    accountNumber: "1000000005",
    balance: 1500.25,
    address: "17 Elm Court, Miami FL 33101",
    phone: "+1 305 555 0505",
    dateOfBirth: "1997-01-19",
  },
  {
    firstName: "Frank",
    lastName: "Miller",
    email: "frank.miller@demo.bank",
    accountNumber: "1000000006",
    balance: 25000.0,
    address: "900 Cedar Boulevard, New York NY 10001",
    phone: "+1 212 555 0606",
    dateOfBirth: "1979-09-03",
  },
  {
    firstName: "Grace",
    lastName: "Lee",
    email: "grace.lee@demo.bank",
    accountNumber: "1000000007",
    balance: 6750.8,
    address: "22 Spruce Way, Portland OR 97201",
    phone: "+1 503 555 0707",
    dateOfBirth: "1995-04-12",
  },
  {
    firstName: "Henry",
    lastName: "Taylor",
    email: "henry.taylor@demo.bank",
    accountNumber: "1000000008",
    balance: 15320.0,
    address: "7 Walnut Drive, Boston MA 02101",
    phone: "+1 617 555 0808",
    dateOfBirth: "1982-12-25",
  },
] as const;

const DEMO_PASSWORD = "Demo@12345"; // shared password for all demo accounts

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: "banking" });
  console.log("✅  Connected to MongoDB");

  const UserModel =
    mongoose.models.User || mongoose.model("User", UserSchema);
  const AccountModel =
    mongoose.models.Account || mongoose.model("Account", AccountSchema);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  let created = 0;
  let skipped = 0;

  for (const demo of DEMO_ACCOUNTS) {
    const existingUser = await UserModel.findOne({ email: demo.email });
    if (existingUser) {
      console.log(`⏭   Skipping ${demo.firstName} ${demo.lastName} (already exists)`);
      skipped++;
      continue;
    }

    const existingAccount = await AccountModel.findOne({
      accountNumber: demo.accountNumber,
    });
    if (existingAccount) {
      console.log(`⏭   Skipping account ${demo.accountNumber} (already exists)`);
      skipped++;
      continue;
    }

    const user = await UserModel.create({
      firstName: demo.firstName,
      lastName: demo.lastName,
      email: demo.email,
      passwordHash,
      phone: demo.phone,
      address: demo.address,
      dateOfBirth: demo.dateOfBirth,
      role: "user",
      status: "active",
    });

    await AccountModel.create({
      userId: user._id,
      accountNumber: demo.accountNumber,
      balance: demo.balance,
      currency: "USD",
      status: "active",
    });

    console.log(
      `✅  Created ${demo.firstName} ${demo.lastName} — account ${demo.accountNumber} — $${demo.balance.toFixed(2)}`
    );
    created++;
  }

  console.log(`\n🎉  Done. Created: ${created}  Skipped: ${skipped}`);
  console.log(`\nDemo account numbers (use these in the transfer form):`);
  for (const d of DEMO_ACCOUNTS) {
    console.log(`   ${d.accountNumber}  →  ${d.firstName} ${d.lastName}`);
  }
  console.log(`\nShared demo password: ${DEMO_PASSWORD}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
