import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Account from "@/lib/models/Account";
import { signToken } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { welcomeEmail } from "@/lib/emails/welcome";
import { provisionCard } from "@/lib/actions/card.actions";

async function generateAccountNumber(): Promise<string> {
  let accountNumber: string;
  let exists = true;
  do {
    accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
    exists = !!(await Account.findOne({ accountNumber }));
  } while (exists);
  return accountNumber;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone, address, dateOfBirth } =
      await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      phone: phone ?? "",
      address: address ?? "",
      dateOfBirth: dateOfBirth ?? "",
      role: "user",
      status: "active",
    });

    const accountNumber = await generateAccountNumber();
    const account = await Account.create({
      userId: user._id,
      accountNumber,
      balance: 0,
      currency: "USD",
      status: "active",
    });

    // Auto-provision a virtual Visa card for the new account
    await provisionCard(
      user._id.toString(),
      account._id.toString(),
      `${user.firstName} ${user.lastName}`.toUpperCase()
    );

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Fire-and-forget welcome email
    const { subject, html, text } = welcomeEmail(user.firstName, accountNumber);
    sendMail({ to: user.email, subject, html, text });

    const response = NextResponse.json({ success: true, redirectTo: "/dashboard" });

    response.cookies.set("banking-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/signup]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
