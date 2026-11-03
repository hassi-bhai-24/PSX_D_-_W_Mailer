/**
 * Email-safe HTML generator for the one-off welcome email sent when a
 * genuinely new subscriber signs up. This email confirms the subscription
 * only; it does not promise any report that has not been generated.
 */
export function renderWelcomeHtml(email: string, unsubscribeUrl: string = '#'): string {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to PSX AlphaBrief</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F5FA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070B14; padding: 24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E1422; border-radius: 12px; overflow: hidden; border: 1px solid #1F2A40;" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 28px; background-color: #0C1A30; border-bottom: 2px solid #0284C7;">
              <div style="font-size: 11px; font-weight: 700; color: #38BDF8; letter-spacing: 1px; text-transform: uppercase;">
                PSX AlphaBrief
              </div>
              <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-top: 3px;">
                Welcome — your subscription is confirmed
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 28px; font-size: 13px; line-height: 1.6; color: #F2F5FA;">
              <p style="margin: 0 0 12px 0;">Hello,</p>
              <p style="margin: 0 0 12px 0;">
                You signed up with ${email} to receive PSX AlphaBrief emails.
                This message confirms your subscription is saved.
              </p>
              <p style="margin: 0 0 6px 0;"><strong>What you signed up for:</strong></p>
              <ul style="margin: 0 0 12px 0; padding-left: 20px;">
                <li>Daily digest — Monday to Friday at 08:00 AM PKT.</li>
                <li>Weekly radar — Saturday at 10:00 AM PKT.</li>
                <li>News update — weekdays at 17:00 PKT.</li>
              </ul>
              <p style="margin: 0 0 12px 0;">
                Emails are sent only while the PSX AlphaBrief server is running.
                Market figures in the digests are generated from the market-data
                feeds available to the server; where live feeds are unreachable,
                figures are calibrated simulated data and are labelled as such
                in the email. Nothing in these emails is personal investment
                advice.
              </p>
              <p style="margin: 0;">
                You can unsubscribe at any time:
                <a href="${unsubscribeUrl}" style="color: #38BDF8; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 28px; background-color: #070B14; color: #6B778D; font-size: 11px; line-height: 1.5; border-top: 1px solid #1F2A40;">
              <p style="margin: 0;">
                <strong style="color: #A3AEC2;">PSX AlphaBrief Compliance Note:</strong>
                Informational only. Not personal investment advice under SECP laws.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
