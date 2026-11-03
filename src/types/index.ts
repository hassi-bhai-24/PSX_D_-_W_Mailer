export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string | null;
  source?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
  open: number;
  high: number;
  low: number;
  close: number;
  netChange: number;
  changePercent: number;
  volume: number;
  previousClose: number;
  keyDriver?: string;
}

export interface Kse100IndexSnapshot {
  close: number;
  netChange: number;
  changePercent: number;
  totalVolume: number;
  totalTradedValuePKR: number; // in PKR billions
  advances: number;
  declines: number;
  unchanged: number;
  high: number;
  low: number;
}

export interface DailyDigestReport {
  id: string;
  sessionDate: string; // YYYY-MM-DD
  generatedAt: string;
  kse100: Kse100IndexSnapshot;
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  topVolume: StockQuote[];
  allStocks: StockQuote[];
  sectorSummaries: {
    sector: string;
    avgChangePercent: number;
    leader: string;
    stockCount: number;
  }[];
  llmNarrative: string;
  htmlContent?: string;
}

export interface BuyStockRecommendation {
  symbol: string;
  name: string;
  sector: string;
  category: 'Growth' | 'Dividend/Defensive' | 'Momentum';
  price: number;
  weeklyChangePct: number;
  volumeSurgePct: number;
  rationale: string;
  catalyst: string;
}

export interface AvoidStockFlag {
  symbol: string;
  name: string;
  sector: string;
  riskCategory: 'Circular Debt / Liquidity' | 'Governance / SECP Audit' | 'Speculative Pump-and-Dump' | 'High Leverage / Margin Calls';
  price: number;
  weeklyChangePct: number;
  warningSigns: string;
  recommendedAction: 'Exit' | 'Avoid' | 'Strict Stop-Loss';
}

export interface SectorHeatmapItem {
  sector: string;
  weeklyReturnPct: number;
  dominantTrend: 'Bullish' | 'Neutral' | 'Bearish';
  weeklyVolumeShares: number;
}

export interface NewsSnippet {
  id: string;
  title: string;
  source: 'Business Recorder' | 'Dawn Finance' | 'Profit by Pakistan Today' | 'Mettis Global';
  url: string;
  publishedAt: string;
  summary: string;
  relevantSymbols: string[];
}

export interface WeeklyIntelligenceReport {
  id: string;
  weekEndingDate: string; // YYYY-MM-DD
  generatedAt: string;
  macroSummary: string[];
  top24Buy: BuyStockRecommendation[];
  top20Avoid: AvoidStockFlag[];
  sectorHeatmap: SectorHeatmapItem[];
  scrapedNews: NewsSnippet[];
  htmlContent?: string;
}

/**
 * News-update report. `newsSource` records honestly where the stories came
 * from: live RSS feeds, or the calibrated archive used when live feeds were
 * unreachable. The archive stories are not current news and must be labelled
 * as such wherever they are shown.
 */
export interface NewsUpdateReport {
  id: string;
  generatedAt: string;
  newsSource: 'live-rss' | 'calibrated-archive';
  articles: NewsSnippet[];
  macroSummary: string[];
  htmlContent?: string;
}

export interface PipelineExecutionLog {
  id: string;
  timestamp: string;
  type: 'daily' | 'weekly' | 'news';
  status: 'pending' | 'success' | 'failed';
  durationMs: number;
  logs: string[];
  recipientCount?: number;
}
