import { DailyDigestReport } from '../../types/index.ts';
import { formatPKR, formatVolume } from '../../utils/rules.ts';

/**
 * Premium Email-safe HTML generator for "PSX Top 100 Daily Digest"
 * Max-width 600px, inline CSS, responsive for Gmail, Outlook, Apple Mail & dark mode.
 */
export function renderDailyDigestHtml(report: DailyDigestReport, unsubscribeUrl: string = '#'): string {
  const isBullish = report.kse100.changePercent >= 0;
  const changeSign = isBullish ? '+' : '';
  const accentColor = isBullish ? '#22C55E' : '#EF4444';
  const accentBg = isBullish ? '#DCFCE7' : '#FEE2E2';

  const totalBreadth = (report.kse100.advances + report.kse100.declines) || 100;
  const advancesPct = Math.round((report.kse100.advances / totalBreadth) * 100);
  const declinesPct = 100 - advancesPct;

  // Sector chips mini-row
  const sectorChips = report.sectorSummaries.slice(0, 5).map(s => {
    const isUp = s.avgChangePercent >= 0;
    const bg = isUp ? '#ECFDF5' : '#FEF2F2';
    const text = isUp ? '#059669' : '#DC2626';
    return `
      <td style="padding: 4px 6px;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="background-color: ${bg}; border-radius: 4px; padding: 4px 8px;">
          <tr>
            <td style="font-size: 11px; font-weight: 600; color: #1E293B;">${s.sector.replace('Commercial ', '').replace(' & Communication', '')}:</td>
            <td style="font-size: 11px; font-weight: 700; color: ${text}; padding-left: 4px; font-family: monospace;">${isUp ? '+' : ''}${s.avgChangePercent}%</td>
          </tr>
        </table>
      </td>
    `;
  }).join('');

  // Top Gainers Rows with "Why it moved"
  const gainersRows = report.topGainers.map((g, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
      <td style="padding: 10px 8px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-family: monospace; font-weight: 700; font-size: 13px; color: #0F172A;">${g.symbol}</div>
        <div style="font-size: 12px; color: #334155;">${g.name}</div>
        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Why it moved: ${g.keyDriver || 'Strong sector accumulation'}</div>
      </td>
      <td style="padding: 10px 8px; text-align: right; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
        <div style="font-family: monospace; font-size: 13px; font-weight: 600; color: #0F172A;">${formatPKR(g.close)}</div>
        <div style="font-size: 11px; color: #64748B;">Vol: ${formatVolume(g.volume)}</div>
      </td>
      <td style="padding: 10px 8px; text-align: right; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
        <span style="display: inline-block; background-color: #DCFCE7; color: #15803D; font-family: monospace; font-weight: 700; font-size: 11px; padding: 3px 6px; border-radius: 4px;">
          +${g.changePercent}%
        </span>
      </td>
    </tr>
  `).join('');

  // Top Losers Rows with "Why it moved"
  const losersRows = report.topLosers.map((l, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
      <td style="padding: 10px 8px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-family: monospace; font-weight: 700; font-size: 13px; color: #0F172A;">${l.symbol}</div>
        <div style="font-size: 12px; color: #334155;">${l.name}</div>
        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Why it moved: ${l.keyDriver || 'Profit taking into resistance'}</div>
      </td>
      <td style="padding: 10px 8px; text-align: right; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
        <div style="font-family: monospace; font-size: 13px; font-weight: 600; color: #0F172A;">${formatPKR(l.close)}</div>
        <div style="font-size: 11px; color: #64748B;">Vol: ${formatVolume(l.volume)}</div>
      </td>
      <td style="padding: 10px 8px; text-align: right; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
        <span style="display: inline-block; background-color: #FEE2E2; color: #B91C1C; font-family: monospace; font-weight: 700; font-size: 11px; padding: 3px 6px; border-radius: 4px;">
          ${l.changePercent}%
        </span>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PSX Top 100 Daily Digest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F5FA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070B14; padding: 24px 8px;">
    <tr>
      <td align="center">
        <!-- 600px Max Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E1422; border-radius: 12px; overflow: hidden; border: 1px solid #1F2A40;" cellspacing="0" cellpadding="0">
          
          <!-- Top Masthead -->
          <tr>
            <td style="padding: 24px 28px; background-color: #121A2B; border-bottom: 1px solid #1F2A40;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; color: #10B981; letter-spacing: 1px; text-transform: uppercase;">
                      PSX AlphaBrief • Daily Bulletin
                    </div>
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-top: 3px;">
                      PSX Top 100 Daily Digest
                    </div>
                    <div style="font-size: 12px; color: #A3AEC2; margin-top: 3px;">
                      Session Date: ${report.sessionDate} • Delivered 8:00 AM PKT
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; background-color: #162035; border: 1px solid #2D3D5E; color: #10B981; font-size: 10px; font-family: monospace; font-weight: 700; padding: 3px 8px; border-radius: 4px;">
                      EOD DISPATCH
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Benchmark Snapshot Card -->
          <tr>
            <td style="padding: 24px 28px; background-color: #0E1422; border-bottom: 1px solid #1F2A40;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="top">
                    <div style="font-size: 11px; color: #6B778D; text-transform: uppercase; font-weight: 600;">KSE-100 Benchmark Index</div>
                    <div style="font-family: monospace; font-size: 32px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">
                      ${report.kse100.close.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                    </div>
                    <div style="margin-top: 6px;">
                      <span style="display: inline-block; background-color: ${accentBg}; color: ${accentColor}; font-family: monospace; font-weight: 700; font-size: 13px; padding: 3px 8px; border-radius: 4px;">
                        ${isBullish ? '▲ +' : '▼ '}${report.kse100.netChange} pts (${changeSign}${report.kse100.changePercent}%)
                      </span>
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <!-- Inline SVG Sparkline -->
                    <svg width="120" height="40" viewBox="0 0 120 40" style="display: block;">
                      <polyline fill="none" stroke="${accentColor}" stroke-width="2" points="4,32 30,22 60,26 90,14 116,6" />
                      <circle cx="116" cy="6" r="3" fill="${accentColor}" />
                    </svg>
                    <div style="font-size: 10px; color: #6B778D; margin-top: 4px;">5-Day Index Trend</div>
                  </td>
                </tr>
              </table>

              <!-- 3 Stat Tiles -->
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td width="32%" style="background-color: #121A2B; border: 1px solid #1F2A40; border-radius: 8px; padding: 10px 12px;">
                    <div style="font-size: 10px; color: #A3AEC2;">TRADED VALUE</div>
                    <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">
                      PKR ${report.kse100.totalTradedValuePKR}B
                    </div>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" style="background-color: #121A2B; border: 1px solid #1F2A40; border-radius: 8px; padding: 10px 12px;">
                    <div style="font-size: 10px; color: #A3AEC2;">SHARES VOLUME</div>
                    <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">
                      ${formatVolume(report.kse100.totalVolume)}
                    </div>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" style="background-color: #121A2B; border: 1px solid #1F2A40; border-radius: 8px; padding: 10px 12px;">
                    <div style="font-size: 10px; color: #A3AEC2;">MARKET BREADTH</div>
                    <div style="font-family: monospace; font-size: 12px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">
                      <span style="color: #22C55E;">${report.kse100.advances}</span> / <span style="color: #EF4444;">${report.kse100.declines}</span>
                    </div>
                    <!-- Breadth Progress Bar -->
                    <table width="100%" height="4" cellspacing="0" cellpadding="0" style="margin-top: 4px; border-radius: 2px; overflow: hidden;">
                      <tr>
                        <td width="${advancesPct}%" style="background-color: #22C55E;"></td>
                        <td width="${declinesPct}%" style="background-color: #EF4444;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Sector Heat Mini-Row -->
              <div style="margin-top: 16px;">
                <div style="font-size: 10px; color: #6B778D; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Sector Heat</div>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    ${sectorChips}
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Executive Takeaway Callout -->
          <tr>
            <td style="padding: 20px 28px; background-color: #0E1422; border-bottom: 1px solid #1F2A40;">
              <div style="border-left: 3px solid #10B981; background-color: #121A2B; border-radius: 0 8px 8px 0; padding: 14px 16px;">
                <div style="font-size: 11px; font-weight: 700; color: #10B981; text-transform: uppercase;">
                  Why the market moved
                </div>
                <p style="margin: 4px 0 0 0; font-size: 13px; line-height: 1.5; color: #F2F5FA;">
                  ${report.llmNarrative}
                </p>
              </div>
            </td>
          </tr>

          <!-- Top Gainers Section -->
          <tr>
            <td style="padding: 20px 28px; background-color: #FFFFFF; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
              <div style="font-size: 13px; font-weight: 800; color: #15803D; text-transform: uppercase; margin-bottom: 8px;">
                ▲ Top 5 Gainers
              </div>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                ${gainersRows}
              </table>
            </td>
          </tr>

          <!-- Top Losers Section -->
          <tr>
            <td style="padding: 20px 28px; background-color: #FFFFFF; color: #0F172A;">
              <div style="font-size: 13px; font-weight: 800; color: #B91C1C; text-transform: uppercase; margin-bottom: 8px;">
                ▼ Top 5 Losers
              </div>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                ${losersRows}
              </table>
            </td>
          </tr>

          <!-- Footer & Regulatory Compliance -->
          <tr>
            <td style="padding: 24px 28px; background-color: #070B14; color: #6B778D; font-size: 11px; line-height: 1.5; border-top: 1px solid #1F2A40;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #A3AEC2;">PSX AlphaBrief Compliance Note:</strong> Published strictly for informational and educational analysis. Does not constitute investment advice or SECP licensed financial advisory.
              </p>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #6B778D;">
                    Data source: PSX Data Portal (DPS).
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
