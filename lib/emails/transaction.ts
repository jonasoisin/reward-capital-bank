export function transactionEmail(opts: {
  recipientName: string;
  type: "sent" | "received" | "credit" | "debit";
  amount: number;
  newBalance: number;
  counterparty?: string; // name of other party for transfers
  note?: string;
  date: Date;
}) {
  const { recipientName, type, amount, newBalance, counterparty, note, date } = opts;

  const typeLabels = {
    sent: "Transfer sent",
    received: "Transfer received",
    credit: "Credit added",
    debit: "Debit applied",
  };

  const amountFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const balanceFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(newBalance);

  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  const isDeduction = type === "sent" || type === "debit";
  const amountColor = isDeduction ? "#dc2626" : "#16a34a";
  const amountPrefix = isDeduction ? "−" : "+";
  const label = typeLabels[type];

  return {
    subject: `${label}: ${amountFormatted}`,
    text: `Hi ${recipientName},\n\n${label} of ${amountFormatted}${counterparty ? ` ${isDeduction ? "to" : "from"} ${counterparty}` : ""}.\n\nNew balance: ${balanceFormatted}\nDate: ${dateFormatted}${note ? `\nNote: ${note}` : ""}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${label}</title>
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
                Transaction
              </p>

              <!-- Amount -->
              <h1 style="margin:0 0 4px;font-size:36px;font-weight:600;color:${amountColor};letter-spacing:-0.03em;font-family:ui-monospace,monospace;">
                ${amountPrefix}${amountFormatted}
              </h1>
              <p style="margin:0 0 32px;font-size:14px;color:#737373;">${label}</p>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e5e5;">
                ${
                  counterparty
                    ? `<tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#737373;">${isDeduction ? "Sent to" : "Received from"}</td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f5f5f5;font-size:13px;font-weight:500;color:#0a0a0a;">${counterparty}</td>
                </tr>`
                    : ""
                }
                ${
                  note
                    ? `<tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#737373;">Note</td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#0a0a0a;">${note}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#737373;">New balance</td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f5f5f5;font-size:13px;font-weight:600;color:#0a0a0a;font-family:ui-monospace,monospace;">${balanceFormatted}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-size:13px;color:#737373;">Date</td>
                  <td align="right" style="padding:12px 0;font-size:13px;color:#0a0a0a;">${dateFormatted}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#a3a3a3;line-height:1.6;">
                If you didn't authorise this transaction, contact support immediately.
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
