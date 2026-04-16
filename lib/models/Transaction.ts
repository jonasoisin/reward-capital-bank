import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITransaction extends Document {
  type: "transfer" | "credit" | "debit";
  senderId?: Types.ObjectId;
  receiverId?: Types.ObjectId | null;
  senderAccountId?: Types.ObjectId;
  receiverAccountId?: Types.ObjectId | null;
  amount: number;
  note?: string;
  status: "pending" | "approved" | "rejected" | "completed" | "blocked";
  /** Ledger state: pending = impacts availableBalance only; posted = ledgerBalance updated. */
  ledgerState: "pending" | "posted";
  initiatedBy: "user" | "admin";
  adminId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["transfer", "credit", "debit"],
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    // receiverId / receiverAccountId are null for external debit entries
    // (international transfers that leave the internal ledger)
    receiverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    senderAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
    receiverAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "blocked"],
      default: "pending",
    },
    ledgerState: {
      type: String,
      enum: ["pending", "posted"],
      default: "pending",
    },
    initiatedBy: { type: String, enum: ["user", "admin"], required: true },
    adminId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

// Force-refresh the model in dev so schema changes take effect across HMR cycles.
// In production mongoose.models cache is fine as-is.
if (process.env.NODE_ENV === "development" && mongoose.models.Transaction) {
  mongoose.deleteModel("Transaction");
}

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
