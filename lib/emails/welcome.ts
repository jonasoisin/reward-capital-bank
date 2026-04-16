export function welcomeEmail(firstName: string, accountNumber: string) {
  const formatted = `${accountNumber.slice(0, 4)}-${accountNumber.slice(4, 8)}-${accountNumber.slice(8, 10)}`;

  return {
    subject: "Your account is ready",
    text: `Hi ${firstName},\n\nWelcome to Banking. Your account number is ${formatted}.\n\nYour starting balance is $0.00.\n\nIf you didn't create this account, contact support immediately.`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:14px;font-weight:600;color:#0a0a0a;letter-spacing:-0.01em;">Banking</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e5e5e5;padding:40px;">

              <!-- Eyebrow -->
              <p style="margin:0 0 16px;font-size:11px;font-weight:500;color:#737373;letter-spacing:0.1em;text-transform:uppercase;font-family:ui-monospace,monospace;">
                Account created
              </p>

              <!-- Heading -->
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#0a0a0a;letter-spacing:-0.02em;line-height:1.2;">
                Welcome, ${firstName}.
              </h1>

              <!-- Body -->
              <p style="margin:0 0 32px;font-size:14px;color:#525252;line-height:1.6;">
                Your account has been created and is ready to use. Here are your account details.
              </p>

              <!-- Account number block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f5f5f5;border-radius:8px;padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:500;color:#737373;letter-spacing:0.08em;text-transform:uppercase;font-family:ui-monospace,monospace;">Account number</p>
                    <p style="margin:0;font-size:20px;font-weight:600;color:#0a0a0a;letter-spacing:0.06em;font-family:ui-monospace,monospace;">${formatted}</p>
                  </td>
                </tr>
              </table>

              <!-- Balance row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:16px 0;">
                <tr>
                  <td style="font-size:13px;color:#737373;">Starting balance</td>
                  <td align="right" style="font-size:13px;font-weight:600;color:#0a0a0a;font-family:ui-monospace,monospace;">$0.00 USD</td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0a0a0a;border-radius:9999px;padding:0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard"
                       style="display:inline-block;padding:12px 28px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                      Go to dashboard →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#a3a3a3;line-height:1.6;">
                If you didn't create this account, ignore this email or contact support immediately.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
