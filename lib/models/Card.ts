import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICard extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  cardNumber: string;       // 16-digit Luhn-valid Visa number, unique
  cvvEncrypted: string;     // AES-256-GCM encrypted CVV
  expiryMonth: number;      // 1–12
  expiryYear: number;       // 4-digit e.g. 2028
  cardHolderName: string;
  type: "virtual";
  status: "active" | "frozen" | "blocked" | "expired";
  dailyLimit: number;       // 0 = unlimited
  monthlyLimit: number;     // 0 = unlimited
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    userId:          { type: Schema.Types.ObjectId, ref: "User",    required: true },
    accountId:       { type: Schema.Types.ObjectId, ref: "Account", required: true },
    cardNumber:      { type: String, required: true, unique: true },
    cvvEncrypted:    { type: String, required: true },
    expiryMonth:     { type: Number, required: true, min: 1, max: 12 },
    expiryYear:      { type: Number, required: true },
    cardHolderName:  { type: String, required: true },
    type:            { type: String, enum: ["virtual"], default: "virtual" },
    status: {
      type: String,
      enum: ["active", "frozen", "blocked", "expired"],
      default: "active",
    },
    dailyLimit:   { type: Number, default: 0 },
    monthlyLimit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for fast per-user and per-account lookups
CardSchema.index({ userId: 1 });
CardSchema.index({ accountId: 1 });

const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;
