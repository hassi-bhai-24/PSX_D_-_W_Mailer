import { Subscriber } from '../../types/index.ts';

export interface DispatchOptions {
  subject: string;
  htmlContent: string;
  subscribers: Subscriber[];
  campaignType: 'daily_digest' | 'weekly_radar' | 'news_update' | 'welcome';
}

export interface DispatchResult {
  /** True only when every addressed recipient was accepted by the provider. */
  success: boolean;
  /** Recipients the provider confirmed (returned a message id for). */
  recipientCount: number;
  provider: string;
  durationMs: number;
  /** Provider-returned message ids only. Never fabricated. */
  messageIds: string[];
  /** Human-readable provider/network errors, one per failed recipient (or config error). */
  errors: string[];
  /** Recipients whose send failed. */
  failedEmails: string[];
}

export interface SingleEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

export interface SingleEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const DEFAULT_RESEND_BASE_URL = 'https://api.resend.com';

function resendConfig(): { apiKey?: string; from?: string; baseUrl: string } {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
    baseUrl: (process.env.RESEND_BASE_URL || DEFAULT_RESEND_BASE_URL).replace(/\/$/, '')
  };
}

/**
 * PSX AlphaBrief Email Dispatch Engine — real sending via the Resend REST API.
 *
 * Previous versions of this file only simulated sending (a short wait, fake
 * message ids, always success). This implementation makes a real HTTP request
 * to Resend for every recipient and reports the provider's real outcome:
 * failures are returned as failures, message ids come only from Resend, and
 * no email is ever claimed sent when it was not accepted by the provider.
 *
 * Required environment:
 *   RESEND_API_KEY — Resend API key (never commit it; set it as an env var /
 *     secret on the host).
 *   EMAIL_FROM     — sender address, e.g. "PSX AlphaBrief <updates@example.com>".
 *     It must be a sender verified in Resend (verified domain or single
 *     sender address), or Resend rejects the send.
 * Optional (tests only):
 *   RESEND_BASE_URL — override the Resend API base URL so tests can point at
 *     a local mock server. Defaults to https://api.resend.com.
 */
export class EmailDispatcherService {
  /**
   * Send one HTML email to one recipient via Resend.
   * Returns the provider message id on success; on failure returns the
   * provider's own error message. Never logs or returns the API key.
   */
  public async sendEmail(options: SingleEmailOptions): Promise<SingleEmailResult> {
    const { apiKey, from, baseUrl } = resendConfig();
    if (!apiKey) {
      return { success: false, error: 'Email is not configured: RESEND_API_KEY is missing.' };
    }
    if (!from) {
      return { success: false, error: 'Email is not configured: EMAIL_FROM is missing.' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${baseUrl}/emails`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [options.to],
          subject: options.subject,
          html: options.htmlContent
        }),
        signal: controller.signal
      });
      const bodyText = await response.text();
      let body: { id?: string; message?: string; name?: string } = {};
      try {
        body = JSON.parse(bodyText) as typeof body;
      } catch {
        // Non-JSON provider response: fall through to the error branch below.
      }
      if (!response.ok || !body.id) {
        const detail = body.message || bodyText.slice(0, 200) || `Resend HTTP ${response.status}`;
        return { success: false, error: `Resend rejected the email (HTTP ${response.status}): ${detail}` };
      }
      return { success: true, messageId: body.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Email send failed: ${message}` };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Send an HTML email campaign to active subscribers, in batches of 25.
   * Every recipient is sent individually so a failure for one address does
   * not hide behind a batch, and failures are recorded per recipient.
   * `success` is true only when all recipients were accepted by Resend.
   */
  public async dispatchCampaign(options: DispatchOptions): Promise<DispatchResult> {
    const startTime = Date.now();
    const { subject, htmlContent, subscribers, campaignType } = options;
    const recipientEmails = subscribers.map(s => s.email);
    const messageIds: string[] = [];
    const errors: string[] = [];
    const failedEmails: string[] = [];

    console.log(`[Email Dispatcher] Starting bulk dispatch for ${campaignType} to ${recipientEmails.length} recipients...`);

    const { apiKey, from } = resendConfig();
    if (!apiKey || !from) {
      const missingVars = [!apiKey ? 'RESEND_API_KEY' : null, !from ? 'EMAIL_FROM' : null].filter(Boolean);
      const error = `Email is not configured: missing ${missingVars.join(' and ')}. No email was sent.`;
      console.error(`[Email Dispatcher] ${error}`);
      return {
        success: false,
        recipientCount: 0,
        provider: 'Resend API (not configured)',
        durationMs: Date.now() - startTime,
        messageIds,
        errors: recipientEmails.length > 0 ? [error] : [],
        failedEmails: [...recipientEmails]
      };
    }

    const batchSize = 25;
    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);
      for (const email of batch) {
        const result = await this.sendEmail({ to: email, subject, htmlContent });
        if (result.success && result.messageId) {
          messageIds.push(result.messageId);
        } else {
          failedEmails.push(email);
          errors.push(`${email}: ${result.error || 'Unknown send error'}`);
        }
      }
    }

    const durationMs = Date.now() - startTime;
    const success = failedEmails.length === 0;
    if (success) {
      console.log(`[Email Dispatcher] Dispatch accepted by Resend for ${messageIds.length} recipients in ${durationMs}ms`);
    } else {
      console.error(
        `[Email Dispatcher] Dispatch failed for ${failedEmails.length} of ${recipientEmails.length} recipients: ${errors.join('; ')}`
      );
    }

    return {
      success,
      recipientCount: messageIds.length,
      provider: 'Resend API',
      durationMs,
      messageIds,
      errors,
      failedEmails
    };
  }
}

export const emailDispatcher = new EmailDispatcherService();
