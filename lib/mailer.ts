/**
 * Nodemailer singleton.
 *
 * Development (no SMTP_HOST set):
 *   Automatically creates an Ethereal test account on first use.
 *   Every sent email logs a click-to-preview URL in the terminal.
 *
 * Production (SMTP_HOST set):
 *   Uses the SMTP_* env vars from .env.
 */

import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

interface EtherealAccount {
  user: string;
  pass: string;
  smtp: { host: string; port: number; secure: boolean };
  web: string;
}

// Cache the Ethereal account across hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _etherealAccount: EtherealAccount | undefined;
}

async function getTransporter() {
  const isDev = process.env.NODE_ENV !== "production";
  const hasSmtp = !!process.env.SMTP_HOST;

  if (isDev && !hasSmtp) {
    // Auto-create Ethereal account once and cache it
    if (!global._etherealAccount) {
      const account = await nodemailer.createTestAccount();
      global._etherealAccount = account as unknown as EtherealAccount;
      console.log(
        `\n📧  Ethereal test account ready — ${global._etherealAccount.user}\n`
      );
    }

    const a = global._etherealAccount;
    return nodemailer.createTransport({
      host: a.smtp.host,
      port: a.smtp.port,
      secure: a.smtp.secure,
      auth: { user: a.user, pass: a.pass },
    });
  }

  // Production / staging: use real SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

function getFromAddress(): string {
  const isDev = process.env.NODE_ENV !== "production";
  const hasSmtp = !!process.env.SMTP_HOST;

  if (isDev && !hasSmtp && global._etherealAccount) {
    return global._etherealAccount.user;
  }
  return process.env.SMTP_FROM || "noreply@yourbank.com";
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: getFromAddress(),
      ...options,
    } as Mail.Options);

    // Dev: log the Ethereal preview link so you can inspect the email
    if (process.env.NODE_ENV !== "production") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`\n📬  Email to ${options.to}`);
        console.log(`    Subject : ${options.subject}`);
        console.log(`    Preview : ${previewUrl}\n`);
      }
    }
  } catch (err) {
    // Never let an email failure crash the calling action
    console.error("[mailer] Failed to send email:", err);
  }
}
