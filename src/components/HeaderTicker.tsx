import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, ShieldCheck, Activity } from 'lucide-react';

interface Props {
  kse100Close?: number;
  changePercent?: number;
  netChange?: number;
}

export const HeaderTicker: React.FC<Props> = ({
  kse100Close = 91240.50,
  changePercent = 1.15,
  netChange = 1035.20
}) => {
  const [pktTime, setPktTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const pktString = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        setPktTime(pktString);
      } catch {
        setPktTime('PKT (UTC+5)');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isUp = changePercent >= 0;

  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Market Ticker */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PSX LIVE BENCHMARK</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
            <span className="font-semibold text-slate-200">KSE-100:</span>
            <span className="font-mono font-bold text-slate-100">{kse100Close.toLocaleString()}</span>
            <span className={`font-mono font-bold flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp className={`w-3 h-3 mr-0.5 ${isUp ? '' : 'rotate-180'}`} />
              {isUp ? '+' : ''}{netChange.toFixed(1)} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>SBP Rate: <strong className="text-slate-200">15.00%</strong></span>
            <span>•</span>
            <span>PKR/USD: <strong className="text-slate-200">278.40</strong></span>
          </div>
        </div>

        {/* Karachi Time and Automation Heartbeat */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-slate-300">{pktTime || 'Karachi Time'} PKT</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
            <Activity className="w-3 h-3" />
            <span className="font-semibold text-[11px]">Cron Daemon Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
