import fs from 'node:fs';
import path from 'node:path';
import {
  Subscriber,
  DailyDigestReport,
  WeeklyIntelligenceReport,
  PipelineExecutionLog
} from '../../types/index.ts';

const DB_FILE = path.resolve(process.cwd(), '.data_store.json');

interface DatabaseStoreSchema {
  subscribers: Subscriber[];
  dailyReports: DailyDigestReport[];
  weeklyReports: WeeklyIntelligenceReport[];
  executionLogs: PipelineExecutionLog[];
}

export class DatabaseStore {
  private data: DatabaseStoreSchema;

  constructor() {
    this.data = this.load();
    if (this.data.subscribers.length === 0) {
      this.seedInitialSubscribers();
    }
  }

  private load(): DatabaseStoreSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[DB Store] Error reading local db file, initializing fresh store:', e);
    }

    return {
      subscribers: [],
      dailyReports: [],
      weeklyReports: [],
      executionLogs: []
    };
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB Store] Failed writing to db file:', e);
    }
  }

  private seedInitialSubscribers(): void {
    this.data.subscribers = [
      {
        id: 'sub-1',
        email: 'portfolio.lead@karachicapital.com.pk',
        status: 'active',
        subscribedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        source: 'institutional_portal'
      },
      {
        id: 'sub-2',
        email: 'tariq.mehmood@akdtrade.pk',
        status: 'active',
        subscribedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
        source: 'web_landing'
      },
      {
        id: 'sub-3',
        email: 'faisal.research@arifhabib.com',
        status: 'active',
        subscribedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        source: 'web_landing'
      },
      {
        id: 'sub-4',
        email: 'hassibhai4321@gmail.com',
        status: 'active',
        subscribedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        source: 'web_landing'
      }
    ];
    this.save();
  }

  // --- Subscribers ---
  public getSubscribers(): Subscriber[] {
    return this.data.subscribers;
  }

  public getActiveSubscribers(): Subscriber[] {
    return this.data.subscribers.filter(s => s.status === 'active');
  }

  public addSubscriber(email: string, source: string = 'web_landing'): { subscriber: Subscriber; isNew: boolean } {
    const existing = this.data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.status !== 'active') {
        existing.status = 'active';
        existing.unsubscribedAt = null;
        this.save();
      }
      return { subscriber: existing, isNew: false };
    }

    const newSub: Subscriber = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: email.trim().toLowerCase(),
      status: 'active',
      subscribedAt: new Date().toISOString(),
      source
    };

    this.data.subscribers.unshift(newSub);
    this.save();
    return { subscriber: newSub, isNew: true };
  }

  public unsubscribe(email: string): boolean {
    const sub = this.data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (sub) {
      sub.status = 'unsubscribed';
      sub.unsubscribedAt = new Date().toISOString();
      this.save();
      return true;
    }
    return false;
  }

  // --- Daily Reports ---
  public saveDailyReport(report: DailyDigestReport): void {
    const idx = this.data.dailyReports.findIndex(r => r.sessionDate === report.sessionDate);
    if (idx >= 0) {
      this.data.dailyReports[idx] = report;
    } else {
      this.data.dailyReports.unshift(report);
    }
    this.save();
  }

  public getLatestDailyReport(): DailyDigestReport | null {
    return this.data.dailyReports[0] || null;
  }

  // --- Weekly Reports ---
  public saveWeeklyReport(report: WeeklyIntelligenceReport): void {
    const idx = this.data.weeklyReports.findIndex(r => r.weekEndingDate === report.weekEndingDate);
    if (idx >= 0) {
      this.data.weeklyReports[idx] = report;
    } else {
      this.data.weeklyReports.unshift(report);
    }
    this.save();
  }

  public getLatestWeeklyReport(): WeeklyIntelligenceReport | null {
    return this.data.weeklyReports[0] || null;
  }

  // --- Logs ---
  public addExecutionLog(log: PipelineExecutionLog): void {
    this.data.executionLogs.unshift(log);
    if (this.data.executionLogs.length > 50) {
      this.data.executionLogs = this.data.executionLogs.slice(0, 50);
    }
    this.save();
  }

  public getExecutionLogs(): PipelineExecutionLog[] {
    return this.data.executionLogs;
  }
}

export const dbStore = new DatabaseStore();
