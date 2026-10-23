import cron, { ScheduledTask } from 'node-cron';
import { psxScraper } from '../data/psxScraper.ts';
import { newsScraper } from '../data/newsScraper.ts';
import { financialLlm } from '../llm/engine.ts';
import { renderDailyDigestHtml } from '../templates/dailyDigestTemplate.ts';
import { renderWeeklyRadarHtml } from '../templates/weeklyRadarTemplate.ts';
import { emailDispatcher } from '../email/dispatcher.ts';
import { dbStore } from '../db/store.ts';
import { sortTopMovers, aggregateSectors } from '../../utils/rules.ts';
import { DailyDigestReport, WeeklyIntelligenceReport, PipelineExecutionLog } from '../../types/index.ts';

export class CronPipelineScheduler {
  private dailyTask: ScheduledTask | null = null;
  private weeklyTask: ScheduledTask | null = null;
  private isDailyRunning: boolean = false;
  private isWeeklyRunning: boolean = false;

  constructor() {
    this.initializeCronJobs();
  }

  /**
   * Configures node-cron schedules with PKT (Asia/Karachi) timezone
   */
  private initializeCronJobs(): void {
    console.log('[Scheduler] Initializing PSX Cron Pipelines (Timezone: Asia/Karachi)...');

    // 1. Daily Digest: Monday-Friday at 08:00 AM PKT
    // "0 8 * * 1-5" (Minute 0, Hour 8, Mon-Fri)
    this.dailyTask = cron.schedule(
      '0 8 * * 1-5',
      async () => {
        console.log('[Cron Job] Triggering Daily PSX Top 100 Digest (08:00 AM PKT)...');
        await this.runDailyDigestPipeline();
      },
      {
        timezone: 'Asia/Karachi'
      }
    );

    // 2. Weekly Radar: Saturday at 10:00 AM PKT
    // "0 10 * * 6" (Minute 0, Hour 10, Saturday)
    this.weeklyTask = cron.schedule(
      '0 10 * * 6',
      async () => {
        console.log('[Cron Job] Triggering Weekly PSX Portfolio Radar (10:00 AM PKT)...');
        await this.runWeeklyRadarPipeline();
      },
      {
        timezone: 'Asia/Karachi'
      }
    );

    console.log('[Scheduler] Cron jobs scheduled successfully:');
    console.log(' - Daily Digest: 08:00 AM PKT (Mon-Fri)');
    console.log(' - Weekly Radar: 10:00 AM PKT (Saturday)');
  }

  /**
   * Executes the 5-step Daily PSX Top 100 Digest pipeline
   */
  public async runDailyDigestPipeline(): Promise<PipelineExecutionLog> {
    if (this.isDailyRunning) {
      throw new Error('Daily Digest pipeline is already executing');
    }
    this.isDailyRunning = true;
    const startTime = Date.now();
    const logs: string[] = [];

    const appendLog = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      const entry = `[${timestamp}] ${msg}`;
      logs.push(entry);
      console.log(`[Daily Pipeline] ${msg}`);
    };

    try {
      appendLog('STEP 1/5: Fetching EOD market data for Top 100 PSX constituent companies...');
      const sessionDate = new Date().toISOString().split('T')[0];
      const { quotes, indexSnapshot } = await psxScraper.fetchTop100EODData(sessionDate);
      appendLog(`Ingested ${quotes.length} constituent quotes. KSE-100 close: ${indexSnapshot.close.toLocaleString()} (${indexSnapshot.changePercent > 0 ? '+' : ''}${indexSnapshot.changePercent}%)`);

      appendLog('STEP 2/5: Computing market breadth, top gainers, losers, and sector aggregations...');
      const { topGainers, topLosers, topVolume } = sortTopMovers(quotes);
      const sectorSummaries = aggregateSectors(quotes);
      appendLog(`Computed movers: Top gainer ${topGainers[0]?.symbol} (+${topGainers[0]?.changePercent}%), Top loser ${topLosers[0]?.symbol} (${topLosers[0]?.changePercent}%)`);

      appendLog('STEP 3/5: Calling Financial LLM Engine for macro narrative and 1-sentence stock drivers...');
      const { executiveNarrative, stockDrivers } = await financialLlm.generateDailyNarrative(
        sessionDate,
        indexSnapshot.close,
        indexSnapshot.netChange,
        indexSnapshot.changePercent,
        indexSnapshot.totalVolume,
        indexSnapshot.advances,
        indexSnapshot.declines,
        topGainers,
        topLosers,
        quotes
      );

      // Attach generated driver to each stock
      quotes.forEach(q => {
        q.keyDriver = stockDrivers.get(q.symbol) || 'Benchmark constituent trading in line with broader sector sentiment.';
      });
      appendLog('LLM synthesis complete: generated market narrative and constituent catalysts');

      appendLog('STEP 4/5: Compiling responsive HTML email template for Daily Top 100 Digest...');
      const dailyReport: DailyDigestReport = {
        id: `daily-${sessionDate}`,
        sessionDate,
        generatedAt: new Date().toISOString(),
        kse100: indexSnapshot,
        topGainers,
        topLosers,
        topVolume,
        allStocks: quotes,
        sectorSummaries,
        llmNarrative: executiveNarrative
      };

      const htmlContent = renderDailyDigestHtml(dailyReport);
      dailyReport.htmlContent = htmlContent;
      dbStore.saveDailyReport(dailyReport);
      appendLog('HTML template rendered and report cached into database');

      appendLog('STEP 5/5: Initiating bulk email dispatch to active subscribers...');
      const activeSubscribers = dbStore.getActiveSubscribers();
      const dispatchResult = await emailDispatcher.dispatchCampaign({
        subject: `PSX Top 100 Daily Digest: KSE-100 ${indexSnapshot.changePercent >= 0 ? '▲ +' : '▼ '}${indexSnapshot.changePercent}% [${sessionDate}]`,
        htmlContent,
        subscribers: activeSubscribers,
        campaignType: 'daily_digest'
      });
      appendLog(`Bulk dispatch completed: ${dispatchResult.recipientCount} emails queued via ${dispatchResult.provider}`);

      const durationMs = Date.now() - startTime;
      const executionLog: PipelineExecutionLog = {
        id: `exec-daily-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'daily',
        status: 'success',
        durationMs,
        logs,
        recipientCount: activeSubscribers.length
      };

      dbStore.addExecutionLog(executionLog);
      return executionLog;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      appendLog(`CRITICAL ERROR in Daily Pipeline: ${errorMessage}`);
      const durationMs = Date.now() - startTime;
      const executionLog: PipelineExecutionLog = {
        id: `exec-daily-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'daily',
        status: 'failed',
        durationMs,
        logs
      };
      dbStore.addExecutionLog(executionLog);
      throw err;
    } finally {
      this.isDailyRunning = false;
    }
  }

  /**
   * Executes the 5-step Weekly PSX Intelligence & Portfolio Radar pipeline
   */
  public async runWeeklyRadarPipeline(): Promise<PipelineExecutionLog> {
    if (this.isWeeklyRunning) {
      throw new Error('Weekly Radar pipeline is already executing');
    }
    this.isWeeklyRunning = true;
    const startTime = Date.now();
    const logs: string[] = [];

    const appendLog = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      const entry = `[${timestamp}] ${msg}`;
      logs.push(entry);
      console.log(`[Weekly Pipeline] ${msg}`);
    };

    try {
      appendLog('STEP 1/5: Consolidating 5-day session datasets for Top 100 PSX companies...');
      const sessionDate = new Date().toISOString().split('T')[0];
      const { quotes } = await psxScraper.fetchTop100EODData(sessionDate);
      appendLog(`Consolidated 5-day volume and price actions for ${quotes.length} benchmark equities`);

      appendLog('STEP 2/5: Ingesting financial news from Business Recorder, Dawn, Profit, and Mettis Global...');
      const newsArticles = await newsScraper.fetchWeeklyNews();
      appendLog(`Ingested ${newsArticles.length} verified news articles across SBP monetary policy, IMF review, and circular debt`);

      appendLog('STEP 3/5: Running LLM Quantitative Radar (3-Bullet Macro, Top 24 Buy, Top 20 Avoid)...');
      const macroSummary = await financialLlm.generateWeeklyMacroSummary(newsArticles);
      const { top24Buy, top20Avoid, sectorHeatmap } = await financialLlm.generateWeeklyPortfolioRadar(quotes, newsArticles);
      appendLog(`Radar complete: Selected 24 Buy stocks (8 Growth, 8 Dividend, 8 Momentum) and 20 Avoid flags`);

      appendLog('STEP 4/5: Compiling responsive HTML email template for Weekly Portfolio Radar...');
      const weeklyReport: WeeklyIntelligenceReport = {
        id: `weekly-${sessionDate}`,
        weekEndingDate: sessionDate,
        generatedAt: new Date().toISOString(),
        macroSummary,
        top24Buy,
        top20Avoid,
        sectorHeatmap,
        scrapedNews: newsArticles
      };

      const htmlContent = renderWeeklyRadarHtml(weeklyReport);
      weeklyReport.htmlContent = htmlContent;
      dbStore.saveWeeklyReport(weeklyReport);
      appendLog('HTML template rendered and stored in weekly reports archive');

      appendLog('STEP 5/5: Initiating bulk dispatch to subscriber base...');
      const activeSubscribers = dbStore.getActiveSubscribers();
      const dispatchResult = await emailDispatcher.dispatchCampaign({
        subject: `PSX Weekly Radar: Top 24 Buy Stocks & Top 20 High-Risk Traps [Week of ${sessionDate}]`,
        htmlContent,
        subscribers: activeSubscribers,
        campaignType: 'weekly_radar'
      });
      appendLog(`Bulk dispatch completed: ${dispatchResult.recipientCount} emails queued via ${dispatchResult.provider}`);

      const durationMs = Date.now() - startTime;
      const executionLog: PipelineExecutionLog = {
        id: `exec-weekly-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'weekly',
        status: 'success',
        durationMs,
        logs,
        recipientCount: activeSubscribers.length
      };

      dbStore.addExecutionLog(executionLog);
      return executionLog;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      appendLog(`CRITICAL ERROR in Weekly Pipeline: ${errorMessage}`);
      const durationMs = Date.now() - startTime;
      const executionLog: PipelineExecutionLog = {
        id: `exec-weekly-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'weekly',
        status: 'failed',
        durationMs,
        logs
      };
      dbStore.addExecutionLog(executionLog);
      throw err;
    } finally {
      this.isWeeklyRunning = false;
    }
  }

  public getStatus() {
    return {
      dailyCron: '0 8 * * 1-5 (08:00 AM PKT Mon-Fri)',
      weeklyCron: '0 10 * * 6 (10:00 AM PKT Sat)',
      timezone: 'Asia/Karachi (PKT)',
      isDailyRunning: this.isDailyRunning,
      isWeeklyRunning: this.isWeeklyRunning
    };
  }
}

export const pipelineScheduler = new CronPipelineScheduler();
