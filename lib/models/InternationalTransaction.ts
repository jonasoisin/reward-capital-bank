import mongoose, { Schema, Document, Model, Types } from "mongoose";
import type { TransferRail } from "@/lib/utils/intl-transfer";

export interface IInternationalTransaction extends Document {
  // Sender (always our user)
  senderId: Types.ObjectId;
  senderAccountId: Types.ObjectId;

  // Rail
  rail: TransferRail;
  transferType: "domestic" | "international";

  // Recipient info
  recipientName: string;
  recipientCountry: string;
  bankName: string;

  // Bank details (all optional — only the relevant fields are populated per rail)
  accountNumber?: string;
  routingNumber?: string;
  accountType?: "checking" | "savings";
  sortCode?: string;
  iban?: string;
  swiftCode?: string;
  bankAddress?: string;
  recipientAddress?: string;
  purpose?: string;

  // Amounts
  amount: number;        // USD amount the sender authorised
  fee: number;           // transfer fee in USD
  fxRate: number;        // rate at time of transfer
  toCurrency: string;    // recipient currency
  convertedAmount: number; // amount recipient gets

  note?: string;
  status: "pending" | "processing" | "completed" | "failed" | "blocked";
  initiatedBy: "user";

  createdAt: Date;
  updatedAt: Date;
}

const IntlTransactionSchema = new Schema<IInternationalTransaction>(
  {
    senderId:        { type: Schema.Types.ObjectId, ref: "User",    required: true },
    senderAccountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },

    rail:         { type: String, enum: ["US_ACH","US_WIRE","UK_FPS","EU_SEPA","SWIFT"], required: true },
    transferType: { type: String, enum: ["domestic","international"], required: true },

    recipientName:    { type: String, required: true },
    recipientCountry: { type: String, required: true },
    bankName:         { type: String, required: true },

    accountNumber:    { type: String, default: null },
    routingNumber:    { type: String, default: null },
    accountType:      { type: String, enum: ["checking","savings",null], default: null },
    sortCode:         { type: String, default: null },
    iban:             { type: String, default: null },
    swiftCode:        { type: String, default: null },
    bankAddress:      { type: String, default: null },
    recipientAddress: { type: String, default: null },
    purpose:          { type: String, default: null },

    amount:          { type: Number, required: true },
    fee:             { type: Number, required: true, default: 0 },
    fxRate:          { type: Number, required: true, default: 1 },
    toCurrency:      { type: String, required: true, default: "USD" },
    convertedAmount: { type: Number, required: true },

    note:        { type: String, default: "" },
    status:      { type: String, enum: ["pending","processing","completed","failed","blocked"], default: "completed" },
    initiatedBy: { type: String, enum: ["user"], required: true },
  },
  { timestamps: true }
);

IntlTransactionSchema.index({ senderId: 1, createdAt: -1 });

const InternationalTransaction: Model<IInternationalTransaction> =
  mongoose.models.InternationalTransaction ||
  mongoose.model<IInternationalTransaction>("InternationalTransaction", IntlTransactionSchema);

export default InternationalTransaction;
