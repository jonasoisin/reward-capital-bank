import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAccount extends Document {
  userId: Types.ObjectId;
  accountNumber: string;
  accountType: "checking" | "savings";
  /** Settled balance — updated only when a transaction is posted (admin approves). */
  ledgerBalance: number;
  /** Real-time spendable balance — immediately reflects pending debits/credits. */
  availableBalance: number;
  currency: string;
  status: "active" | "frozen" | "closed";
  /** Annual interest rate for savings accounts (e.g. 0.045 = 4.5%). */
  interestRate: number;
  /** Max monthly withdrawals. -1 = unlimited (checking). Savings default: 6. */
  withdrawalLimit: number;
  /** How many withdrawals used in current month (savings only). */
  withdrawalCount: number;
  /** When withdrawalCount resets. */
  withdrawalResetAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountNumber: { type: String, required: true, unique: true },
    accountType: { type: String, enum: ["checking", "savings"], default: "checking" },
    ledgerBalance:    { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      default: "active",
    },
    interestRate:    { type: Number, default: 0 },
    withdrawalLimit: { type: Number, default: -1 },     // -1 = unlimited
    withdrawalCount: { type: Number, default: 0 },
    withdrawalResetAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Force-refresh the compiled model in development so HMR schema changes take effect.
if (process.env.NODE_ENV === "development" && mongoose.models.Account) {
  mongoose.deleteModel("Account");
}

const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
