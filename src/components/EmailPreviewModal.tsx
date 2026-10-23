import React, { useState } from 'react';
import { Eye, Copy, Check, Smartphone, Monitor, ExternalLink, Calendar, Newspaper } from 'lucide-react';

interface Props {
  dailyHtml?: string;
  weeklyHtml?: string;
  sessionDate?: string;
  weekEndingDate?: string;
}

export const EmailPreviewModal: React.FC<Props> = ({
  dailyHtml = '',
  weeklyHtml = '',
  sessionDate = 'Latest Session',
  weekEndingDate = 'This Week'
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  const currentHtml = activeTab === 'daily' ? dailyHtml : weeklyHtml;

  const handleCopy = async () => {
    if (!currentHtml) return;
    try {
      await navigator.clipboard.writeText(currentHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleOpenRaw = () => {
    const endpoint = activeTab === 'daily' ? '/api/preview/daily-html' : '/api/preview/weekly-html';
    window.open(endpoint, '_blank');
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Control Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Edition Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Digest (08:00 AM PKT)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Weekly Radar (10:00 AM PKT Sat)</span>
          </button>
        </div>

        {/* Viewport & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Viewport Toggles */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded border border-slate-800 text-slate-400">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              title="Desktop Email View (100% width)"
              className={`p-1.5 rounded transition-all cursor-pointer ${viewport === 'desktop' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              title="Mobile Email View (390px)"
              className={`p-1.5 rounded transition-all cursor-pointer ${viewport === 'mobile' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Copy HTML */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'HTML Copied' : 'Copy HTML'}</span>
          </button>

          {/* Open full page */}
          <button
            type="button"
            onClick={handleOpenRaw}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Standalone</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="p-4 bg-slate-950/70 flex justify-center min-h-[500px] max-h-[750px] overflow-y-auto">
        <div
          className={`transition-all duration-300 w-full ${
            viewport === 'mobile' ? 'max-w-[390px] border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-white' : 'max-w-3xl'
          }`}
        >
          {currentHtml ? (
            <iframe
              title="Responsive Email Preview"
              srcDoc={currentHtml}
              className="w-full h-[650px] border-0 rounded bg-white shadow-inner"
              sandbox="allow-same-origin allow-popups"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-slate-500 text-sm">
              Loading generated email template...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
