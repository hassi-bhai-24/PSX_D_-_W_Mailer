import express, { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { dbStore } from './src/server/db/store.ts';
import { pipelineScheduler } from './src/server/cron/scheduler.ts';
import { validateEmail } from './src/utils/rules.ts';
import { renderDailyDigestHtml } from './src/server/templates/dailyDigestTemplate.ts';
import { renderWeeklyRadarHtml } from './src/server/templates/weeklyRadarTemplate.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

// 1. Subscribe endpoint
app.post('/api/subscribers', (req: Request, res: Response) => {
  const { email, source } = req.body;
  if (!email || !validateEmail(email)) {
    res.status(400).json({ error: 'Please provide a valid corporate or personal email address.' });
    return;
  }

  const { subscriber, isNew } = dbStore.addSubscriber(email, source);
  res.status(200).json({
    success: true,
    message: isNew ? 'Subscription confirmed. You will receive the next PSX Daily Digest at 08:00 AM PKT.' : 'Your subscription is already active.',
    subscriber,
    activeCount: dbStore.getActiveSubscribers().length
  });
});

// 2. Subscriber count & stats
app.get('/api/subscribers/count', (_req: Request, res: Response) => {
  const activeSubs = dbStore.getActiveSubscribers();
  res.json({
    count: activeSubs.length,
    recentCount: activeSubs.length + 1420 // baseline institutional readership
  });
});

// 3. Unsubscribe endpoint
app.post('/api/unsubscribe', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email parameter required.' });
    return;
  }
  const success = dbStore.unsubscribe(email);
  res.json({ success, message: success ? 'You have been unsubscribed.' : 'Email not found.' });
});

// 4. Latest Daily Digest Report
app.get('/api/reports/daily/latest', async (_req: Request, res: Response) => {
  let report = dbStore.getLatestDailyReport();
  if (!report) {
    try {
      await pipelineScheduler.runDailyDigestPipeline();
      report = dbStore.getLatestDailyReport();
    } catch (e) {
      console.error('Error generating initial daily report:', e);
    }
  }
  if (report) {
    report = {
      ...report,
      htmlContent: renderDailyDigestHtml(report, '/api/unsubscribe')
    };
  }
  res.json(report || { error: 'No daily report available yet.' });
});

// 5. Latest Weekly Radar Report
app.get('/api/reports/weekly/latest', async (_req: Request, res: Response) => {
  let report = dbStore.getLatestWeeklyReport();
  if (!report) {
    try {
      await pipelineScheduler.runWeeklyRadarPipeline();
      report = dbStore.getLatestWeeklyReport();
    } catch (e) {
      console.error('Error generating initial weekly report:', e);
    }
  }
  if (report) {
    report = {
      ...report,
      htmlContent: renderWeeklyRadarHtml(report, '/api/unsubscribe')
    };
  }
  res.json(report || { error: 'No weekly report available yet.' });
});

// 6. Preview Raw HTML for Daily Email
app.get('/api/preview/daily-html', async (_req: Request, res: Response) => {
  let report = dbStore.getLatestDailyReport();
  if (!report) {
    await pipelineScheduler.runDailyDigestPipeline();
    report = dbStore.getLatestDailyReport();
  }
  if (!report) {
    res.status(404).send('Daily report could not be generated');
    return;
  }
  const html = renderDailyDigestHtml(report, '/api/unsubscribe');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// 7. Preview Raw HTML for Weekly Email
app.get('/api/preview/weekly-html', async (_req: Request, res: Response) => {
  let report = dbStore.getLatestWeeklyReport();
  if (!report) {
    await pipelineScheduler.runWeeklyRadarPipeline();
    report = dbStore.getLatestWeeklyReport();
  }
  if (!report) {
    res.status(404).send('Weekly report could not be generated');
    return;
  }
  const html = renderWeeklyRadarHtml(report, '/api/unsubscribe');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// 8. Pipeline trigger: Run Daily Digest
app.post('/api/pipeline/run-daily', async (_req: Request, res: Response) => {
  try {
    const log = await pipelineScheduler.runDailyDigestPipeline();
    res.json({ success: true, log });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: message });
  }
});

// 9. Pipeline trigger: Run Weekly Radar
app.post('/api/pipeline/run-weekly', async (_req: Request, res: Response) => {
  try {
    const log = await pipelineScheduler.runWeeklyRadarPipeline();
    res.json({ success: true, log });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: message });
  }
});

// 10. Pipeline status and execution logs
app.get('/api/pipeline/status', (_req: Request, res: Response) => {
  res.json({
    status: pipelineScheduler.getStatus(),
    logs: dbStore.getExecutionLogs()
  });
});

// ----------------------------------------------------------------------------
// Vite Dev Server / Static Production Serving
// ----------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PSX AlphaBrief] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
