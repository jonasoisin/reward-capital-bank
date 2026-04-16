import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAdminLog extends Document {
  adminId: Types.ObjectId;
  action:
    | "credit"
    | "debit"
    | "block_account"
    | "unblock_account"
    | "block_user"
    | "unblock_user"
    | "block_transaction"
    | "approve_transaction"
    | "reject_transaction"
    | "block_card"
    | "unblock_card"
    | "set_card_limits"
    | "send_email";
  targetUserId: Types.ObjectId;
  targetAccountId?: Types.ObjectId;
  targetTransactionId?: Types.ObjectId;
  targetCardId?: Types.ObjectId;
  amount?: number;
  note: string;
  createdAt: Date;
}

const AdminLogSchema = new Schema<IAdminLog>(
  {
    adminId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: [
        "credit", "debit",
        "block_account", "unblock_account",
        "block_user", "unblock_user",
        "block_transaction", "approve_transaction", "reject_transaction",
        "block_card", "unblock_card", "set_card_limits",
        "send_email",
      ],
      required: true,
    },
    targetUserId:        { type: Schema.Types.ObjectId, ref: "User",        required: true },
    targetAccountId:     { type: Schema.Types.ObjectId, ref: "Account",     default: null },
    targetTransactionId: { type: Schema.Types.ObjectId, ref: "Transaction", default: null },
    targetCardId:        { type: Schema.Types.ObjectId, ref: "Card",        default: null },
    amount: { type: Number, default: null },
    note:   { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AdminLog: Model<IAdminLog> =
  mongoose.models.AdminLog || mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);

export default AdminLog;
