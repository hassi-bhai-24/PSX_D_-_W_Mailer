import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface TopTickerProps {
  kse100Close?: number;
  changePercent?: number;
  netChange?: number;
}

export const TopTicker: React.FC<TopTickerProps> = ({
  kse100Close = 91240.50,
  changePercent = 1.15,
  netChange = 1035.20,
}) => {
  const [pktTime, setPktTime] = useState<string>('');
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [flashType, setFlashType] = useState<'gain' | 'loss' | null>(null);

  // Trigger flash animation when value updates
  useEffect(() => {
    setFlashType(changePercent >= 0 ? 'gain' : 'loss');
    const timer = setTimeout(() => setFlashType(null), 1200);
    return () => clearTimeout(timer);
  }, [kse100Close, changePercent]);

  // Compute PKT time and PSX market open/closed status
  useEffect(() => {
    const updateTimeAndStatus = () => {
      try {
        const now = new Date();
        const pktDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
        const hours = pktDate.getHours();
        const minutes = pktDate.getMinutes();
        const day = pktDate.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

        // Format HH:MM PKT
        const timeStr = pktDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setPktTime(timeStr);

        // PSX regular trading hours
        // Mon-Thu: 09:15 to 15:30
        // Fri: 09:15 to 12:00 & 14:30 to 16:30
        let open = false;
        const totalMinutes = hours * 60 + minutes;

        if (day >= 1 && day <= 4) {
          open = totalMinutes >= 9 * 60 + 15 && totalMinutes <= 15 * 60 + 30;
        } else if (day === 5) {
          open = (totalMinutes >= 9 * 60 + 15 && totalMinutes <= 12 * 60) ||
                 (totalMinutes >= 14 * 60 + 30 && totalMinutes <= 16 * 60 + 30);
        }
        setIsMarketOpen(open);
      } catch {
        setPktTime('15:30 PKT');
        setIsMarketOpen(false);
      }
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const isUp = changePercent >= 0;

  return (
    <aside aria-label="Live Market Strip" className="w-full bg-[#070B14] border-b border-[#1F2A40] text-xs py-1.5 px-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        {/* Ticker items */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* KSE-100 Benchmark */}
          <div
            className={`flex items-center gap-2 px-2 py-0.5 rounded transition-colors ${
              flashType === 'gain' ? 'flash-gain' : flashType === 'loss' ? 'flash-loss' : ''
            }`}
          >
            <span className="text-[#6B778D] font-medium uppercase tracking-wider text-[11px]">KSE-100</span>
            <span className="font-mono font-bold text-[#F2F5FA]">{kse100Close.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
            <span
              className={`font-mono font-semibold flex items-center ${
                isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'
              }`}
            >
              {isUp ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />
              )}
              {isUp ? '+' : ''}{netChange.toFixed(1)} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="h-3 w-[1px] bg-[#1F2A40]" />

          {/* SBP Rate */}
          <div className="flex items-center gap-1.5 text-[#A3AEC2]">
            <span className="text-[#6B778D] text-[11px]">SBP Rate</span>
            <span className="font-mono font-medium text-[#F2F5FA]">15.00%</span>
          </div>

          <div className="h-3 w-[1px] bg-[#1F2A40]" />

          {/* PKR / USD */}
          <div className="flex items-center gap-1.5 text-[#A3AEC2]">
            <span className="text-[#6B778D] text-[11px]">PKR / USD</span>
            <span className="font-mono font-medium text-[#F2F5FA]">278.40</span>
          </div>
        </div>

        {/* Status items */}
        <div className="flex items-center gap-4 text-[11px] text-[#A3AEC2]">
          {/* Market Status */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isMarketOpen ? 'bg-[#22C55E] animate-pulse' : 'bg-[#6B778D]'
              }`}
            />
            <span className="font-medium text-[#F2F5FA]">
              {isMarketOpen ? 'Market Open' : 'Market Closed'}
            </span>
            <span className="text-[#6B778D] hidden sm:inline">
              • Last updated {pktTime || '03:30 PM'} PKT
            </span>
          </div>

          <div className="h-3 w-[1px] bg-[#1F2A40] hidden sm:block" />

          {/* System status tooltip */}
          <div
            className="flex items-center gap-1.5 text-[#A3AEC2] hover:text-[#F2F5FA] transition-colors cursor-help"
            title="All automated EOD pipelines and cron workers operating normally (Asia/Karachi)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="hidden sm:inline">System: All good</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
