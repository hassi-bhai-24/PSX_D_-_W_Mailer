import React, { useState } from 'react';
import { Play, Loader2, CheckCircle2, AlertTriangle, Terminal, RefreshCw } from 'lucide-react';
import { PipelineExecutionLog } from '../types/index.ts';

interface Props {
  onPipelineCompleted?: () => void;
}

export const PipelineRunner: React.FC<Props> = ({ onPipelineCompleted }) => {
  const [isRunningDaily, setIsRunningDaily] = useState(false);
  const [isRunningWeekly, setIsRunningWeekly] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Background Cron daemon listening on Asia/Karachi timezone.',
    '[CRON] Daily Digest scheduled: 08:00 AM PKT (Monday - Friday).',
    '[CRON] Weekly Radar scheduled: 10:00 AM PKT (Every Saturday).'
  ]);
  const [lastExecution, setLastExecution] = useState<PipelineExecutionLog | null>(null);

  const triggerDaily = async () => {
    setIsRunningDaily(true);
    setLogs(prev => [...prev, `[USER TRIGGER] Manual execution requested for PSX Top 100 Daily Digest...`]);

    try {
      const res = await fetch('/api/pipeline/run-daily', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastExecution(data.log);
        setLogs(prev => [...prev, ...(data.log.logs || []), `[SUCCESS] Daily Digest pipeline completed in ${data.log.durationMs}ms.`]);
        if (onPipelineCompleted) onPipelineCompleted();
      } else {
        setLogs(prev => [...prev, `[ERROR] Pipeline run failed: ${data.error}`]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLogs(prev => [...prev, `[NETWORK ERROR] Failed executing trigger: ${msg}`]);
    } finally {
      setIsRunningDaily(false);
    }
  };

  const triggerWeekly = async () => {
    setIsRunningWeekly(true);
    setLogs(prev => [...prev, `[USER TRIGGER] Manual execution requested for Weekly PSX Portfolio Radar...`]);

    try {
      const res = await fetch('/api/pipeline/run-weekly', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastExecution(data.log);
        setLogs(prev => [...prev, ...(data.log.logs || []), `[SUCCESS] Weekly Radar pipeline completed in ${data.log.durationMs}ms.`]);
        if (onPipelineCompleted) onPipelineCompleted();
      } else {
        setLogs(prev => [...prev, `[ERROR] Pipeline run failed: ${data.error}`]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLogs(prev => [...prev, `[NETWORK ERROR] Failed executing trigger: ${msg}`]);
    } finally {
      setIsRunningWeekly(false);
    }
  };

  const clearLogs = () => {
    setLogs(['[SYSTEM] Logs cleared. Cron daemon running in background.']);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Action Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100">Live Automation & Dispatch Controller</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and trigger the background workers manually without waiting for PKT cron intervals
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={triggerDaily}
            disabled={isRunningDaily || isRunningWeekly}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow cursor-pointer"
          >
            {isRunningDaily ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Daily Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Daily Digest (08:00 PKT)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={triggerWeekly}
            disabled={isRunningDaily || isRunningWeekly}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow cursor-pointer"
          >
            {isRunningWeekly ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Weekly Radar...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Weekly Radar (10:00 PKT)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearLogs}
            title="Clear Console"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs rounded transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 bg-slate-950">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span>Worker stdout / stderr:</span>
          {lastExecution && (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Last execution completed in {lastExecution.durationMs}ms
            </span>
          )}
        </div>

        <div className="p-3 bg-black/90 rounded-lg text-xs font-mono text-emerald-300 overflow-y-auto max-h-[260px] border border-slate-800 space-y-1">
          {logs.map((log, idx) => {
            const isError = log.includes('ERROR');
            const isStep = log.includes('STEP');
            const isSuccess = log.includes('SUCCESS');
            return (
              <div
                key={idx}
                className={`${
                  isError ? 'text-rose-400 font-bold' : isStep ? 'text-amber-300 font-semibold' : isSuccess ? 'text-emerald-400 font-bold' : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
