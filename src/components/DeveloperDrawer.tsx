import React, { useState } from 'react';
import { Terminal, Database, Code2, Sparkles, Mail, Clock, Play, Loader2, CheckCircle2, RefreshCw, X, Copy, Check } from 'lucide-react';
import { ArchitectureDeliverables } from './ArchitectureDeliverables.tsx';
import { PipelineExecutionLog } from '../types/index.ts';

interface DeveloperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPipelineCompleted?: () => void;
}

export const DeveloperDrawer: React.FC<DeveloperDrawerProps> = ({
  isOpen,
  onClose,
  onPipelineCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'simulator'>('architecture');
  const [isRunningDaily, setIsRunningDaily] = useState(false);
  const [isRunningWeekly, setIsRunningWeekly] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[DAEMON] Background cron daemon initialized on timezone: Asia/Karachi (PKT).',
    '[SCHEDULE] Daily KSE-100 Digest: 08:00 AM PKT (Monday - Friday).',
    '[SCHEDULE] Weekly Portfolio Radar: 10:00 AM PKT (Every Saturday).',
  ]);
  const [lastExecution, setLastExecution] = useState<PipelineExecutionLog | null>(null);

  if (!isOpen) return null;

  const triggerDaily = async () => {
    setIsRunningDaily(true);
    setLogs(prev => [...prev, `[TRIGGER] Manual run requested for PSX Top 100 Daily Digest...`]);

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
      setLogs(prev => [...prev, `[NETWORK ERROR] ${msg}`]);
    } finally {
      setIsRunningDaily(false);
    }
  };

  const triggerWeekly = async () => {
    setIsRunningWeekly(true);
    setLogs(prev => [...prev, `[TRIGGER] Manual run requested for Weekly Portfolio Radar...`]);

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
      setLogs(prev => [...prev, `[NETWORK ERROR] ${msg}`]);
    } finally {
      setIsRunningWeekly(false);
    }
  };

  return (
    <section id="developer-view" className="py-12 border-b border-[#1F2A40] bg-[#0E1422] animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1F2A40]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F2F5FA] flex items-center gap-2">
                <span>Developer View & System Architecture</span>
                <span className="text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/30">
                  CRON + LLM ENGINE
                </span>
              </h3>
              <p className="text-xs text-[#A3AEC2]">
                Inspect technical deliverables (SQL Schema, Scrapers, Prompts, Cron) or trigger manual background runs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="bg-[#121A2B] p-1 rounded-lg border border-[#1F2A40] flex items-center">
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : 'text-[#A3AEC2] hover:text-[#F2F5FA]'
                }`}
              >
                Code & Schemas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : 'text-[#A3AEC2] hover:text-[#F2F5FA]'
                }`}
              >
                Trigger Simulator
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close developer view"
              className="p-1.5 text-[#6B778D] hover:text-[#F2F5FA] hover:bg-[#121A2B] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Architecture deliverables */}
        {activeTab === 'architecture' && (
          <ArchitectureDeliverables />
        )}

        {/* Tab 2: Manual trigger simulator */}
        {activeTab === 'simulator' && (
          <div className="bg-[#121A2B] border border-[#1F2A40] rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#F2F5FA]">Manual Dispatch Trigger Controller</h4>
                <p className="text-xs text-[#A3AEC2]">
                  Run the complete 5-stage automated worker on demand and inspect stdout execution logs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerDaily}
                  disabled={isRunningDaily || isRunningWeekly}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#10B981] hover:bg-[#059669] text-[#070B14] text-xs font-bold rounded-lg transition-all shadow cursor-pointer disabled:opacity-50"
                >
                  {isRunningDaily ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Daily (08:00 PKT)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Trigger Daily Digest</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={triggerWeekly}
                  disabled={isRunningDaily || isRunningWeekly}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg transition-all shadow cursor-pointer disabled:opacity-50"
                >
                  {isRunningWeekly ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Weekly (10:00 PKT)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Trigger Weekly Radar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setLogs(['[DAEMON] Console cleared. Background cron listening on Asia/Karachi.'])}
                  className="p-2 bg-[#0E1422] text-[#A3AEC2] hover:text-[#F2F5FA] rounded-lg border border-[#1F2A40] transition-colors cursor-pointer"
                  title="Clear console"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Console output */}
            <div className="p-3 bg-[#070B14] rounded-lg font-mono text-xs text-[#22C55E] border border-[#1F2A40] max-h-64 overflow-y-auto space-y-1">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('ERROR') ? 'text-[#EF4444] font-bold' : log.includes('STEP') ? 'text-[#F59E0B]' : log.includes('SUCCESS') ? 'text-[#10B981] font-bold' : 'text-[#A3AEC2]'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
