import React, { useState } from 'react';
import { Database, Code2, Sparkles, Mail, Clock, Copy, Check } from 'lucide-react';

export const ArchitectureDeliverables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'scraper' | 'prompts' | 'templates' | 'cron'>('schema');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'schema', label: '1. Database Schema', icon: Database },
    { id: 'scraper', label: '2. Scraping Pipeline', icon: Code2 },
    { id: 'prompts', label: '3. LLM Prompts', icon: Sparkles },
    { id: 'templates', label: '4. Email Templates', icon: Mail },
    { id: 'cron', label: '5. Cron Controller', icon: Clock }
  ] as const;

  const codeSnippets: Record<typeof activeTab, { title: string; filename: string; language: string; code: string }> = {
    schema: {
      title: 'PostgreSQL & Prisma Production Schema',
      filename: 'src/server/db/schema.sql',
      language: 'sql',
      code: `-- 1. SUBSCRIBERS TABLE (Captures landing signups & verification)
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    verification_token VARCHAR(64),
    source VARCHAR(50) DEFAULT 'web_landing'
);

-- 2. DAILY MARKET SESSIONS (KSE-100 summary and LLM takeaways)
CREATE TABLE daily_market_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_date DATE NOT NULL UNIQUE,
    kse100_close NUMERIC(12, 2) NOT NULL,
    net_change NUMERIC(10, 2) NOT NULL,
    change_pct NUMERIC(6, 2) NOT NULL,
    total_volume BIGINT NOT NULL,
    total_value_pkr_bn NUMERIC(10, 2) NOT NULL,
    advances INT NOT NULL,
    declines INT NOT NULL,
    llm_narrative TEXT NOT NULL,
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. STOCK DAILY QUOTES (EOD Quotes for Top 100 Companies)
CREATE TABLE stock_daily_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_date DATE NOT NULL REFERENCES daily_market_sessions(session_date),
    symbol VARCHAR(12) NOT NULL,
    open_price NUMERIC(10, 2) NOT NULL,
    close_price NUMERIC(10, 2) NOT NULL,
    net_change NUMERIC(10, 2) NOT NULL,
    change_pct NUMERIC(6, 2) NOT NULL,
    volume BIGINT NOT NULL,
    key_driver VARCHAR(255)
);

-- 4. WEEKLY INTELLIGENCE REPORTS (Top 24 Buy / Top 20 Avoid)
CREATE TABLE weekly_intelligence_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_ending_date DATE NOT NULL UNIQUE,
    macro_summary JSONB NOT NULL,
    top_24_buy JSONB NOT NULL,
    top_20_avoid JSONB NOT NULL,
    sector_heatmap JSONB NOT NULL
);`
    },
    scraper: {
      title: 'PSX Data Portal (DPS) & Financial News RSS Ingestion Pipeline',
      filename: 'src/server/data/psxScraper.ts & newsScraper.ts',
      language: 'typescript',
      code: `// PSX Data Portal Scraper & Market Data Engine
export class PsxDataScraper {
  private static readonly DPS_BASE_URL = 'https://dps.psx.com.pk';

  public async fetchTop100EODData(sessionDate?: string): Promise<{ quotes: StockQuote[], indexSnapshot: Kse100IndexSnapshot }> {
    // Queries DPS EOD endpoints for KSE-100 components:
    // https://dps.psx.com.pk/timeseries/eod/{symbol}
    // Extracts Open, High, Low, Close, Volume, and computes Net Change (PKR and %)
    // ...
  }
}

// News Ingestion from Business Recorder, Dawn Finance, Profit PK, and Mettis Global
export class NewsScraperService {
  private static readonly RSS_FEEDS = [
    { name: 'Business Recorder', url: 'https://www.brecorder.com/feeds/markets.xml' },
    { name: 'Dawn Finance', url: 'https://www.dawn.com/feed/business' },
    { name: 'Profit by Pakistan Today', url: 'https://profit.pakistantoday.com.pk/feed/' },
    { name: 'Mettis Global', url: 'https://mettisglobal.news/feed/' }
  ];

  public async fetchWeeklyNews(): Promise<NewsSnippet[]> {
    // Ingests, regex-parses, and filters articles related to SBP rate, IMF, and PSX equities
  }
}`
    },
    prompts: {
      title: 'Production LLM Prompts & Structured JSON Schemas',
      filename: 'src/server/llm/prompts.ts',
      language: 'typescript',
      code: `// 1. Daily Digest Prompt: Institutional KSE-100 Takeaway & 1-Sentence Drivers
export const DAILY_DIGEST_SYSTEM_PROMPT = \`You are a Senior Equity Research Strategist specializing in the Pakistan Stock Exchange (PSX).
Generate the daily institutional market narrative and concise, 1-sentence analytical drivers for benchmark KSE-100 companies based strictly on the provided EOD numerical data.
Tone: Institutional, Wall Street / Karachi Financial Terminal. Zero conversational filler.
Cite specific metrics (PKR change, %, volume, SBP policy rate, circular debt tranches).\`;

// 2. Weekly Macro Synthesis (3 Bullet Points)
export const WEEKLY_MACRO_SYNTHESIS_SYSTEM_PROMPT = \`Summarize the week's critical macroeconomic, fiscal, monetary, and regulatory developments affecting the Pakistan Stock Exchange into exactly 3 bullet points:
- Bullet 1: Monetary Policy, Inflation (CPI), and Sovereign Yields.
- Bullet 2: External Account, IMF Tranche Benchmark Reviews, and PKR FX Reserves.
- Bullet 3: Industrial / Sector Policy (Refineries, Gas tariffs, ECC circular debt settlements).
Each bullet must be 20 to 35 words, dense with financial facts and numbers.\`;

// 3. Weekly Top 24 Buy & Top 20 Avoid Flagging Schemas
// Generates 8 Growth, 8 Dividend/Defensive, 8 Momentum picks and 20 Avoid traps.`
    },
    templates: {
      title: 'Responsive Email HTML Generators (Daily & Weekly)',
      filename: 'src/server/templates/dailyDigestTemplate.ts & weeklyRadarTemplate.ts',
      language: 'typescript',
      code: `// Responsive HTML Email Engine with inline styles compatible with Outlook & Gmail
export function renderDailyDigestHtml(report: DailyDigestReport, unsubscribeUrl: string): string {
  // Renders:
  // - KSE-100 Benchmark Snapshot (Index points, net change, traded value in PKR bn)
  // - Executive Takeaway & Macro Sentiment block
  // - Top 5 Gainers & Top 5 Losers cards
  // - Top 100 Companies Full Table (Symbol | Company | Open | Close | Chg% | Volume | Key Driver)
  // - SECP regulatory disclaimer & one-click unsubscribe
}

export function renderWeeklyRadarHtml(report: WeeklyIntelligenceReport, unsubscribeUrl: string): string {
  // Renders:
  // - 3-Bullet Executive Macro Summary
  // - Top 24 Buy / Accumulate Portfolio (Growth, Dividend/Defensive, Momentum)
  // - Top 20 High-Risk / Avoid Stocks (Circular Debt, Governance, Leverage, Pump-and-Dump)
  // - 5-Day Full Sector Heatmap
}`
    },
    cron: {
      title: 'Node-Cron Job Controller with Asia/Karachi (PKT) Timezone',
      filename: 'src/server/cron/scheduler.ts',
      language: 'typescript',
      code: `// Node-Cron Orchestration with Asia/Karachi Timezone
export class CronPipelineScheduler {
  private initializeCronJobs(): void {
    // 1. Daily Digest: Monday-Friday at 08:00 AM PKT
    cron.schedule('0 8 * * 1-5', async () => {
      console.log('[Cron Job] Triggering Daily PSX Top 100 Digest (08:00 AM PKT)...');
      await this.runDailyDigestPipeline();
    }, { timezone: 'Asia/Karachi' });

    // 2. Weekly Radar: Saturday at 10:00 AM PKT
    cron.schedule('0 10 * * 6', async () => {
      console.log('[Cron Job] Triggering Weekly PSX Portfolio Radar (10:00 AM PKT)...');
      await this.runWeeklyRadarPipeline();
    }, { timezone: 'Asia/Karachi' });
  }

  // 5-Step Pipeline: Fetch EOD -> Parse Movers -> LLM Synthesis -> Render HTML -> Dispatch
  public async runDailyDigestPipeline(): Promise<PipelineExecutionLog> { ... }
  public async runWeeklyRadarPipeline(): Promise<PipelineExecutionLog> { ... }
}`
    }
  };

  const current = codeSnippets[activeTab];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Tab Navigation */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Viewer */}
      <div className="p-4 bg-slate-950">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100">{current.title}</h4>
            <div className="text-xs font-mono text-emerald-400">{current.filename}</div>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-[380px]">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  );
};
