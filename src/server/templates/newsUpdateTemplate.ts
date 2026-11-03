import { NewsUpdateReport } from '../../types/index.ts';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Email-safe HTML generator for the PSX news update email.
 *
 * Honesty labelling is part of the template itself: when the stories came
 * from the calibrated archive (live RSS feeds were unreachable), the email
 * says so plainly and does not present the archive stories as current news.
 * The macro bullets are an LLM-generated (or fallback) summary of the
 * stories in the email, not verified reporting.
 */
export function renderNewsUpdateHtml(report: NewsUpdateReport, unsubscribeUrl: string = '#'): string {
  const isLive = report.newsSource === 'live-rss';
  const sourceNote = isLive
    ? 'Stories below were read from financial press RSS feeds just now.'
    : 'Live financial press feeds were unreachable when this email was built, so the stories below come from a stored archive. They are NOT current news — treat them as background context only.';

  const articleCards = report.articles.map(a => `
      <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
        <div style="font-size: 14px; font-weight: 700; color: #0F172A; line-height: 1.4;">
          <a href="${escapeHtml(a.url)}" style="color: #0F172A; text-decoration: underline;">${escapeHtml(a.title)}</a>
        </div>
        <div style="font-size: 11px; color: #64748B; margin-top: 3px;">
          ${escapeHtml(a.source)} • ${escapeHtml(a.publishedAt.slice(0, 10))}
        </div>
        <div style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">
          ${escapeHtml(a.summary)}
        </div>
      </div>
  `).join('');

  const macroBullets = report.macroSummary.map(b => `
    <li style="margin-bottom: 8px; font-size: 13px; line-height: 1.5; color: #F2F5FA;">
      ${escapeHtml(b)}
    </li>
  `).join('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PSX News Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F5FA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070B14; padding: 24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E1422; border-radius: 12px; overflow: hidden; border: 1px solid #1F2A40;" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 28px; background-color: #0C1A30; border-bottom: 2px solid #0284C7;">
              <div style="font-size: 11px; font-weight: 700; color: #38BDF8; letter-spacing: 1px; text-transform: uppercase;">
                PSX News Update
              </div>
              <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-top: 3px;">
                Market news roundup
              </div>
              <div style="font-size: 12px; color: #A3AEC2; margin-top: 3px;">
                ${escapeHtml(report.generatedAt.slice(0, 10))} • Weekday roundup, 17:00 PKT
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 28px; background-color: #0E1422; border-bottom: 1px solid #1F2A40;">
              <div style="font-size: 12px; font-weight: 700; color: #38BDF8; text-transform: uppercase; margin-bottom: 8px;">
                About these stories
              </div>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #A3AEC2;">${sourceNote}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 28px; background-color: #F8FAFC; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
              <div style="font-size: 13px; font-weight: 800; color: #0F172A; text-transform: uppercase; margin-bottom: 12px;">
                Headlines
              </div>
              ${articleCards}
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 28px; background-color: #0E1422; border-bottom: 1px solid #1F2A40;">
              <div style="font-size: 12px; font-weight: 700; color: #38BDF8; text-transform: uppercase; margin-bottom: 10px;">
                Macro context — LLM-generated summary, not verified reporting
              </div>
              <ul style="margin: 0; padding-left: 20px;">
                ${macroBullets}
              </ul>
              <p style="margin: 12px 0 0 0; font-size: 11px; line-height: 1.5; color: #A3AEC2;">
                This summary is generated from the stories above. It may be
                inaccurate or out of date. It is not investment advice.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 28px; background-color: #070B14; color: #6B778D; font-size: 11px; line-height: 1.5; border-top: 1px solid #1F2A40;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #A3AEC2;">PSX AlphaBrief Compliance Note:</strong> Informational only. Not personal investment advice under SECP laws.
              </p>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #6B778D;">
                    Data basis: financial press RSS feeds when reachable; otherwise a stored news archive (labelled above).
                  </td>
                  <td align="right">
                    <a href="${unsubscribeUrl}" style="color: #A3AEC2; text-decoration: underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
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
