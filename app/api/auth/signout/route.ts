import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: "/sign-in" });

  response.cookies.set("banking-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
