-- ============================================================================
-- PSX AlphaBrief: Production PostgreSQL / Supabase Database Schema
-- Optimized for High-Throughput EOD Ingestion, LLM Reports, and Batch Emailing
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. SUBSCRIBERS TABLE (Captures landing page signups, status, and verification)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    verification_token VARCHAR(64),
    source VARCHAR(50) DEFAULT 'web_landing',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- ----------------------------------------------------------------------------
-- 2. KSE-100 COMPANIES DIRECTORY (Master list of 100 constituent tickers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kse100_companies (
    symbol VARCHAR(12) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sector VARCHAR(80) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    market_cap_pkr NUMERIC(16, 2),
    free_float_shares BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kse100_sector ON kse100_companies(sector);

-- ----------------------------------------------------------------------------
-- 3. DAILY MARKET SESSIONS & DIGEST LOGS (KSE-100 summary and LLM narratives)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_market_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_date DATE NOT NULL UNIQUE,
    kse100_close NUMERIC(12, 2) NOT NULL,
    net_change NUMERIC(10, 2) NOT NULL,
    change_pct NUMERIC(6, 2) NOT NULL,
    total_volume BIGINT NOT NULL,
    total_value_pkr_bn NUMERIC(10, 2) NOT NULL,
    advances INT NOT NULL,
    declines INT NOT NULL,
    unchanged INT NOT NULL,
    day_high NUMERIC(12, 2) NOT NULL,
    day_low NUMERIC(12, 2) NOT NULL,
    llm_narrative TEXT NOT NULL,
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_session_date ON daily_market_sessions(session_date DESC);

-- ----------------------------------------------------------------------------
-- 4. STOCK DAILY QUOTES (EOD prices for the top 100 companies per session)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_daily_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_date DATE NOT NULL REFERENCES daily_market_sessions(session_date) ON DELETE CASCADE,
    symbol VARCHAR(12) NOT NULL REFERENCES kse100_companies(symbol),
    open_price NUMERIC(10, 2) NOT NULL,
    high_price NUMERIC(10, 2) NOT NULL,
    low_price NUMERIC(10, 2) NOT NULL,
    close_price NUMERIC(10, 2) NOT NULL,
    previous_close NUMERIC(10, 2) NOT NULL,
    net_change NUMERIC(10, 2) NOT NULL,
    change_pct NUMERIC(6, 2) NOT NULL,
    volume BIGINT NOT NULL,
    key_driver VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_symbol_per_session UNIQUE(session_date, symbol)
);

CREATE INDEX IF NOT EXISTS idx_stock_quotes_session ON stock_daily_quotes(session_date, change_pct DESC);
CREATE INDEX IF NOT EXISTS idx_stock_quotes_symbol ON stock_daily_quotes(symbol);

-- ----------------------------------------------------------------------------
-- 5. SCRAPED FINANCIAL NEWS (Business Recorder, Dawn, Profit, Mettis Global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scraped_news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    url TEXT NOT NULL UNIQUE,
    published_at TIMESTAMPTZ NOT NULL,
    summary TEXT,
    sentiment VARCHAR(20) CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
    relevant_symbols TEXT[] DEFAULT '{}',
    ingested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published ON scraped_news_articles(published_at DESC);

-- ----------------------------------------------------------------------------
-- 6. WEEKLY INTELLIGENCE REPORTS (Saturday 10:00 AM PKT reports: Top 24 / Avoid 20)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weekly_intelligence_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_ending_date DATE NOT NULL UNIQUE,
    macro_summary JSONB NOT NULL,     -- 3 executive bullet points
    top_24_buy JSONB NOT NULL,        -- Growth, Dividend/Defensive, Momentum
    top_20_avoid JSONB NOT NULL,      -- Circular debt, SECP audit, leverage, pump-and-dump
    sector_heatmap JSONB NOT NULL,    -- Weekly performance by sector
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_report_date ON weekly_intelligence_reports(week_ending_date DESC);

-- ----------------------------------------------------------------------------
-- 7. EMAIL DISPATCH AUDIT LOGS (Batch tracking, delivery stats, SES/Resend IDs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_dispatch_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_type VARCHAR(20) NOT NULL CHECK (campaign_type IN ('daily_digest', 'weekly_radar')),
    reference_date DATE NOT NULL,
    recipient_count INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('queued', 'sending', 'completed', 'failed')),
    error_message TEXT,
    duration_ms INT,
    provider_message_ids JSONB DEFAULT '[]',
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dispatch_campaign ON email_dispatch_logs(campaign_type, dispatched_at DESC);

/*
================================================================================
PRISMA SCHEMA EQUIVALENT (schema.prisma)
================================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Subscriber {
  id                String    @id @default(uuid())
  email             String    @unique
  status            String    @default("active")
  subscribedAt      DateTime  @default(now())
  unsubscribedAt    DateTime?
  verificationToken String?
  source            String?   @default("web_landing")
  ipAddress         String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([status])
}

model Kse100Company {
  symbol           String             @id
  name             String
  sector           String
  basePrice        Decimal            @db.Decimal(10, 2)
  marketCapPkr     Decimal?           @db.Decimal(16, 2)
  freeFloatShares  BigInt?
  isActive         Boolean            @default(true)
  quotes           StockDailyQuote[]

  @@index([sector])
}

model DailyMarketSession {
  id             String            @id @default(uuid())
  sessionDate    DateTime          @unique @db.Date
  kse100Close    Decimal           @db.Decimal(12, 2)
  netChange      Decimal           @db.Decimal(10, 2)
  changePct      Decimal           @db.Decimal(6, 2)
  totalVolume    BigInt
  totalValuePkrBn Decimal          @db.Decimal(10, 2)
  advances       Int
  declines       Int
  unchanged      Int
  dayHigh        Decimal           @db.Decimal(12, 2)
  dayLow         Decimal           @db.Decimal(12, 2)
  llmNarrative   String            @db.Text
  htmlContent    String?           @db.Text
  quotes         StockDailyQuote[]
  createdAt      DateTime          @default(now())

  @@index([sessionDate(sort: Desc)])
}

model StockDailyQuote {
  id            String             @id @default(uuid())
  sessionDate   DateTime           @db.Date
  session       DailyMarketSession @relation(fields: [sessionDate], references: [sessionDate], onDelete: Cascade)
  symbol        String
  company       Kse100Company      @relation(fields: [symbol], references: [symbol])
  openPrice     Decimal            @db.Decimal(10, 2)
  highPrice     Decimal            @db.Decimal(10, 2)
  lowPrice      Decimal            @db.Decimal(10, 2)
  closePrice    Decimal            @db.Decimal(10, 2)
  previousClose Decimal            @db.Decimal(10, 2)
  netChange     Decimal            @db.Decimal(10, 2)
  changePct     Decimal            @db.Decimal(6, 2)
  volume        BigInt
  keyDriver     String?            @db.VarChar(255)
  createdAt     DateTime           @default(now())

  @@unique([sessionDate, symbol])
  @@index([sessionDate, changePct(sort: Desc)])
}

model ScrapedNewsArticle {
  id              String   @id @default(uuid())
  source          String
  title           String
  url             String   @unique
  publishedAt     DateTime
  summary         String?  @db.Text
  sentiment       String?
  relevantSymbols String[]
  ingestedAt      DateTime @default(now())

  @@index([publishedAt(sort: Desc)])
}

model WeeklyIntelligenceReport {
  id             String   @id @default(uuid())
  weekEndingDate DateTime @unique @db.Date
  macroSummary   Json
  top24Buy       Json
  top20Avoid     Json
  sectorHeatmap  Json
  htmlContent    String?  @db.Text
  createdAt      DateTime @default(now())

  @@index([weekEndingDate(sort: Desc)])
}

model EmailDispatchLog {
  id                 String   @id @default(uuid())
  campaignType       String
  referenceDate      DateTime @db.Date
  recipientCount     Int      @default(0)
  status             String   @default("completed")
  errorMessage       String?  @db.Text
  durationMs         Int?
  providerMessageIds Json?
  dispatchedAt       DateTime @default(now())

  @@index([campaignType, dispatchedAt(sort: Desc)])
}
*/
