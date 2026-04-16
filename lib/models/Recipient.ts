import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRecipient extends Document {
  userId: Types.ObjectId;
  recipientAccountNumber: string;
  recipientName: string;
  nickname: string;
  lastUsedAt: Date;
  useCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecipientSchema = new Schema<IRecipient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientAccountNumber: { type: String, required: true },
    recipientName: { type: String, required: true },
    nickname: { type: String, default: "" },
    lastUsedAt: { type: Date, default: null },
    useCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One saved entry per user+account pair
RecipientSchema.index({ userId: 1, recipientAccountNumber: 1 }, { unique: true });

const Recipient: Model<IRecipient> =
  mongoose.models.Recipient || mongoose.model<IRecipient>("Recipient", RecipientSchema);

export default Recipient;
