"use server";

import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import AdminLog from "@/lib/models/AdminLog";
import { sendMail } from "@/lib/mailer";

const emailSchema = z.object({
  userId: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  adminId: z.string().min(1),
});

export async function sendEmailToUser(data: unknown) {
  const parsed = emailSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { userId, subject, body, adminId } = parsed.data;

  await connectDB();

  const user = await User.findById(userId).select("email firstName lastName");
  if (!user) return { error: "User not found." };

  await sendMail({
    to: user.email,
    subject,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:14px;font-weight:600;color:#0a0a0a;">Banking</span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e5e5e5;padding:40px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:500;color:#737373;letter-spacing:0.1em;text-transform:uppercase;font-family:ui-monospace,monospace;">Message from Banking</p>
              <h1 style="margin:0 0 24px;font-size:20px;font-weight:600;color:#0a0a0a;letter-spacing:-0.02em;">${subject}</h1>
              <p style="margin:0;font-size:14px;color:#525252;line-height:1.7;">Hi ${user.firstName},</p>
              <p style="margin:12px 0 0;font-size:14px;color:#525252;line-height:1.7;">${body}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#a3a3a3;">Banking — automated message, do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text: `Hi ${user.firstName},\n\n${body}`,
  });

  await AdminLog.create({
    adminId,
    action: "send_email",
    targetUserId: userId,
    note: `Subject: ${subject}`,
  });

  return { success: true };
}
