import { WeeklyIntelligenceReport } from '../../types/index.ts';
import { formatPKR } from '../../utils/rules.ts';

/**
 * Calm blue-teal Email-safe HTML generator for "PSX Weekly Intelligence & Portfolio Radar"
 * Dispatched Saturday 10:00 AM PKT. Max-width 600px.
 */
export function renderWeeklyRadarHtml(report: WeeklyIntelligenceReport, unsubscribeUrl: string = '#'): string {
  // 3-Bullet Macro Brief
  const macroBullets = report.macroSummary.map((b, i) => `
    <li style="margin-bottom: 10px; font-size: 13px; line-height: 1.5; color: #F2F5FA;">
      <strong style="color: #38BDF8;">Macro point ${i + 1}:</strong> ${b}
    </li>
  `).join('');

  // Top stocks worth watching (sample of 6 prominent selections for email brevity, linking to full radar)
  const watchCards = report.top24Buy.slice(0, 6).map(s => {
    const riskTag = s.category === 'Dividend/Defensive' ? 'Low Risk' : s.category === 'Growth' ? 'Medium Risk' : 'High Momentum';
    const tagBg = s.category === 'Dividend/Defensive' ? '#DCFCE7' : '#E0F2FE';
    const tagColor = s.category === 'Dividend/Defensive' ? '#15803D' : '#0369A1';

    return `
      <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: #0F172A;">${s.symbol}</span>
              <span style="font-size: 12px; color: #64748B; margin-left: 6px;">${s.name}</span>
            </td>
            <td align="right">
              <span style="display: inline-block; background-color: ${tagBg}; color: ${tagColor}; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ${riskTag}
              </span>
            </td>
          </tr>
        </table>
        <div style="margin-top: 4px; font-family: monospace; font-size: 12px; font-weight: 600; color: #334155;">
          ${formatPKR(s.price)} • <span style="color: #15803D; font-weight: 700;">+${s.weeklyChangePct}% 5-Day</span>
        </div>
        <div style="font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.4;">
          ${s.rationale}
        </div>
      </div>
    `;
  }).join('');

  // Stocks to be careful with (sample of 5)
  const avoidCards = report.top20Avoid.slice(0, 5).map(a => {
    return `
      <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: #0F172A;">${a.symbol}</span>
              <span style="font-size: 12px; color: #64748B; margin-left: 6px;">${a.name}</span>
            </td>
            <td align="right">
              <span style="display: inline-block; background-color: #FEE2E2; color: #B91C1C; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ${a.riskCategory}
              </span>
            </td>
          </tr>
        </table>
        <div style="font-size: 12px; color: #92400E; margin-top: 4px; line-height: 1.4;">
          <strong>Warning sign:</strong> ${a.warningSigns}
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PSX Weekly Intelligence & Portfolio Radar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F5FA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070B14; padding: 24px 8px;">
    <tr>
      <td align="center">
        <!-- 600px Max Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E1422; border-radius: 12px; overflow: hidden; border: 1px solid #1F2A40;" cellspacing="0" cellpadding="0">
          
          <!-- Top Masthead (Calm Blue-Teal) -->
          <tr>
            <td style="padding: 24px 28px; background-color: #0C1A30; border-bottom: 2px solid #0284C7;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; color: #38BDF8; letter-spacing: 1px; text-transform: uppercase;">
                      Saturday Weekend Intelligence
                    </div>
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-top: 3px;">
                      PSX Weekly Radar
                    </div>
                    <div style="font-size: 12px; color: #A3AEC2; margin-top: 3px;">
                      Week Ending ${report.weekEndingDate} • Delivered 10:00 AM PKT
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; background-color: #1E293B; border: 1px solid #334155; color: #38BDF8; font-size: 10px; font-family: monospace; font-weight: 700; padding: 3px 8px; border-radius: 4px;">
                      RADAR
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 1: Macro Brief (3 Points) -->
          <tr>
            <td style="padding: 20px 28px; background-color: #0E1422; border-bottom: 1px solid #1F2A40;">
              <div style="font-size: 12px; font-weight: 700; color: #38BDF8; text-transform: uppercase; margin-bottom: 10px;">
                3-Bullet Macro Brief (Week in Review)
              </div>
              <ul style="margin: 0; padding-left: 20px;">
                ${macroBullets}
              </ul>
            </td>
          </tr>

          <!-- Section 2: Stocks Worth Watching -->
          <tr>
            <td style="padding: 20px 28px; background-color: #F8FAFC; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
              <div style="font-size: 13px; font-weight: 800; color: #15803D; text-transform: uppercase; margin-bottom: 4px;">
                ✓ Stocks Worth Watching
              </div>
              <div style="font-size: 12px; color: #64748B; margin-bottom: 12px;">
                Selected for volume accumulation, clean balance sheets, and sector tailwinds
              </div>
              ${watchCards}

              <!-- Risk Tag Legend -->
              <div style="margin-top: 10px; padding: 8px 10px; background-color: #F1F5F9; border-radius: 6px; font-size: 11px; color: #64748B;">
                <strong>Risk legend:</strong> 
                <span style="color: #15803D; font-weight: 600;">Low Risk</span> = high cash flow / dividend • 
                <span style="color: #0369A1; font-weight: 600;">Medium Risk</span> = growth exporters • 
                <span style="color: #7E22CE; font-weight: 600;">High Momentum</span> = breakout volume.
              </div>
            </td>
          </tr>

          <!-- Section 3: Stocks to be Careful With -->
          <tr>
            <td style="padding: 20px 28px; background-color: #FFFFFF; color: #0F172A;">
              <div style="font-size: 13px; font-weight: 800; color: #B45309; text-transform: uppercase; margin-bottom: 4px;">
                ⚠ Stocks to Be Careful With
              </div>
              <div style="font-size: 12px; color: #64748B; margin-bottom: 12px;">
                Flagged for steep drops, circular debt exposure, or governance concerns
              </div>
              ${avoidCards}
            </td>
          </tr>

          <!-- Footer & Regulatory Compliance -->
          <tr>
            <td style="padding: 24px 28px; background-color: #070B14; color: #6B778D; font-size: 11px; line-height: 1.5; border-top: 1px solid #1F2A40;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #A3AEC2;">PSX AlphaBrief Compliance Note:</strong> Informational only. Not personal investment advice under SECP laws.
              </p>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #6B778D;">
                    Data source: PSX Data Portal & Financial Press RSS.
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
