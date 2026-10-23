import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Smartphone,
  Copy,
  ExternalLink,
  Calendar,
  BarChart3,
  Check,
  Info
} from 'lucide-react';
import { Button } from './ui/Button.tsx';

interface SampleEmailSectionProps {
  dailyHtml?: string;
  weeklyHtml?: string;
  onCopyToast?: () => void;
}

export const SampleEmailSection: React.FC<SampleEmailSectionProps> = ({
  dailyHtml = '',
  weeklyHtml = '',
  onCopyToast,
}) => {
  const [edition, setEdition] = useState<'daily' | 'weekly'>('daily');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number>(850);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeHtml = edition === 'daily' ? dailyHtml : weeklyHtml;

  const handleCopy = async () => {
    if (!activeHtml) return;
    try {
      await navigator.clipboard.writeText(activeHtml);
      setCopied(true);
      if (onCopyToast) onCopyToast();
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleOpenStandalone = () => {
    const url = edition === 'daily' ? '/api/preview/daily-html' : '/api/preview/weekly-html';
    window.open(url, '_blank');
  };

  // Adjust iframe height automatically when content loads so there's no nested scrollbar
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const body = iframeRef.current.contentWindow.document.body;
        const html = iframeRef.current.contentWindow.document.documentElement;
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        if (height > 300) {
          setIframeHeight(height + 40);
        }
      } catch {
        // Fallback default
        setIframeHeight(device === 'mobile' ? 1150 : 920);
      }
    }
  };

  useEffect(() => {
    handleIframeLoad();
  }, [edition, device, activeHtml]);

  return (
    <section id="sample-emails" className="py-16 sm:py-24 border-b border-[#1F2A40] bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-mono font-semibold text-[#10B981] uppercase tracking-wider mb-2">
              SAMPLE EMAIL PREVIEWS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F5FA] tracking-tight">
              See what arrives in your inbox
            </h2>
            <p className="text-sm text-[#A3AEC2] mt-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span>Data source: PSX Data Portal. Updated daily after market close.</span>
            </p>
          </div>

          {/* Controls: Segmented Edition & Device Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Edition Segmented Control */}
            <div className="bg-[#0E1422] p-1 rounded-xl border border-[#1F2A40] flex items-center">
              <button
                type="button"
                onClick={() => setEdition('daily')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  edition === 'daily'
                    ? 'bg-[#121A2B] text-[#10B981] shadow-sm border border-[#10B981]/30'
                    : 'text-[#A3AEC2] hover:text-[#F2F5FA]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Digest</span>
              </button>

              <button
                type="button"
                onClick={() => setEdition('weekly')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  edition === 'weekly'
                    ? 'bg-[#121A2B] text-[#38BDF8] shadow-sm border border-[#38BDF8]/30'
                    : 'text-[#A3AEC2] hover:text-[#F2F5FA]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Weekly Radar</span>
              </button>
            </div>

            {/* Device Toggle */}
            <div className="bg-[#0E1422] p-1 rounded-xl border border-[#1F2A40] flex items-center text-[#A3AEC2]">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                title="Desktop View (640px)"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  device === 'desktop' ? 'bg-[#121A2B] text-[#F2F5FA] border border-[#1F2A40]' : 'hover:text-[#F2F5FA]'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                title="Mobile View (390px)"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  device === 'mobile' ? 'bg-[#121A2B] text-[#F2F5FA] border border-[#1F2A40]' : 'hover:text-[#F2F5FA]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Actions: Copy & Open */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy clean responsive HTML"
                className="p-2 rounded-xl bg-[#0E1422] border border-[#1F2A40] hover:border-[#2D3D5E] text-[#A3AEC2] hover:text-[#F2F5FA] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenStandalone}
                title="Open email in standalone browser window"
                className="p-2 rounded-xl bg-[#0E1422] border border-[#1F2A40] hover:border-[#2D3D5E] text-[#A3AEC2] hover:text-[#F2F5FA] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open standalone</span>
              </button>
            </div>
          </div>
        </div>

        {/* Realistic Frame (Laptop or Phone Mockup) */}
        <div className="flex justify-center">
          <div
            className={`w-full transition-all duration-300 ${
              device === 'mobile'
                ? 'max-w-[400px] border-[10px] border-[#1F2A40] rounded-[36px] p-2 bg-[#0E1422] shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
                : 'max-w-3xl border border-[#1F2A40] rounded-2xl bg-[#0E1422] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden'
            }`}
          >
            {/* Mockup Frame Header (Browser / Phone top bar) */}
            <div className="px-4 py-2.5 bg-[#0E1422] border-b border-[#1F2A40] flex items-center justify-between text-xs text-[#6B778D]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                <span className="ml-2 font-mono text-[11px] text-[#A3AEC2]">
                  {edition === 'daily' ? 'PSX_Daily_Digest.eml' : 'PSX_Weekly_Radar.eml'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#6B778D]">
                {device === 'mobile' ? '390px Viewport' : '640px Max-Width'}
              </span>
            </div>

            {/* Email Frame Canvas */}
            <div className="bg-[#070B14] p-3 sm:p-5 flex justify-center">
              {activeHtml ? (
                <iframe
                  ref={iframeRef}
                  title="PSX Email Preview"
                  srcDoc={activeHtml}
                  onLoad={handleIframeLoad}
                  style={{
                    height: `${iframeHeight}px`,
                    width: '100%',
                    maxWidth: device === 'mobile' ? '370px' : '620px',
                    border: 'none',
                    display: 'block',
                    backgroundColor: '#070B14',
                    overflow: 'hidden'
                  }}
                  scrolling="no"
                  sandbox="allow-same-origin allow-popups"
                />
              ) : (
                <div className="h-[450px] flex items-center justify-center text-sm text-[#6B778D]">
                  Loading email preview...
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
