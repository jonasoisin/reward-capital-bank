import { NextRequest, NextResponse } from "next/server";
import { FX_DATA, DEFAULT_FX } from "@/lib/utils/intl-transfer";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const currency = (searchParams.get("currency") ?? "USD").toUpperCase();
  const amount   = parseFloat(searchParams.get("amount") ?? "0");

  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const fx = FX_DATA[currency] ?? DEFAULT_FX;
  const convertedAmount = parseFloat((amount * fx.rate).toFixed(2));

  return NextResponse.json({
    fromCurrency:    "USD",
    toCurrency:      currency,
    rate:            fx.rate,
    fee:             fx.fee,
    totalDebit:      parseFloat((amount + fx.fee).toFixed(2)),
    convertedAmount,
    estimatedDelivery: fx.delivery,
  });
}
