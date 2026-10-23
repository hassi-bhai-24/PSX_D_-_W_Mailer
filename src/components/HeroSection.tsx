import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { validateEmail } from '../utils/rules.ts';
import { Sparkline } from './ui/Sparkline.tsx';

interface HeroSectionProps {
  onSubscribed?: (email: string) => void;
  kse100Close?: number;
  changePercent?: number;
  netChange?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSubscribed,
  kse100Close = 91240.50,
  changePercent = 1.15,
  netChange = 1035.20,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(trimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'hero_capture' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        if (onSubscribed) onSubscribed(trimmed);
      } else {
        setErrorMessage(data.error || 'Unable to register subscription. Please try again.');
      }
    } catch {
      setErrorMessage('Network error communicating with server.');
    } finally {
      setIsLoading(false);
    }
  };

  const isUp = changePercent >= 0;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#1F2A40] bg-[#070B14]">
      {/* Subtle backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#10B981]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Email Form */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2B] border border-[#1F2A40] text-xs font-medium text-[#A3AEC2] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Free daily and weekly PSX briefing</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F2F5FA] leading-[1.15] mb-5">
              Know what moved the Pakistan market before your{' '}
              <span className="text-[#10B981]">morning chai.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#A3AEC2] leading-relaxed mb-8 max-w-xl">
              Every trading day at 8:00 AM PKT, get the KSE-100 summary, top gainers and losers, and the real reason each stock moved. Delivered straight to your inbox.
            </p>

            {/* Email Form */}
            <div id="subscribe-form" className="mb-4">
              {isSuccess ? (
                <div className="bg-[#121A2B] border border-[#10B981]/40 rounded-xl p-5 flex items-start gap-3.5 shadow-lg animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-bold text-[#F2F5FA] leading-tight">You're in.</h2>
                    <p className="text-sm text-[#A3AEC2] mt-1">
                      First briefing arrives tomorrow at <strong>8:00 AM PKT</strong>. Check your inbox.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
                  {/* Single pill-shaped container on desktop */}
                  <div className="flex flex-col sm:flex-row p-1.5 bg-[#0E1422] border border-[#1F2A40] focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-[#10B981]/20 rounded-xl sm:rounded-full transition-all shadow-sm">
                    <div className="flex items-center pl-3.5 pr-2 py-2 flex-grow">
                      <Mail className="w-5 h-5 text-[#6B778D] shrink-0 mr-2.5" />
                      <label htmlFor="hero-email" className="sr-only">Enter your email</label>
                      <input
                        id="hero-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        disabled={isLoading}
                        className="w-full bg-transparent text-[#F2F5FA] placeholder-[#6B778D] text-sm sm:text-base outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-[#070B14] font-semibold text-sm rounded-lg sm:rounded-full transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-98"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <span>Get the free briefing</span>
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 p-2.5 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Trust points */}
            <div className="text-xs text-[#6B778D] flex items-center gap-2">
              <span>Free</span>
              <span>•</span>
              <span>No spam</span>
              <span>•</span>
              <span>Unsubscribe in one click</span>
            </div>
          </div>

          {/* Right Column: Floating Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Card Container */}
              <div className="bg-[#121A2B] border border-[#1F2A40] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_24px_rgba(16,185,129,0.08)]">
                
                {/* Email Subject / Header mockup */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#1F2A40]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F2F5FA]">PSX Top 100 Daily Digest</div>
                      <div className="text-[11px] text-[#6B778D]">Delivered 8:00 AM PKT</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded-full border border-[#10B981]/30">
                    EOD DISPATCH
                  </span>
                </div>

                {/* Benchmark Snapshot */}
                <div className="bg-[#0E1422] rounded-xl p-3.5 border border-[#1F2A40] mb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-[#6B778D] uppercase tracking-wider">KSE-100 Index</div>
                      <div className="font-mono text-2xl font-bold text-[#F2F5FA] mt-0.5">
                        {kse100Close.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-md mt-1 border border-[#22C55E]/25">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>+{netChange.toFixed(1)} (+{changePercent.toFixed(2)}%)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[#6B778D] mb-1">5-Day Trend</div>
                      <Sparkline data={[89800, 90200, 89900, 90540, 91240]} color="#22C55E" width={100} height={32} />
                    </div>
                  </div>
                </div>

                {/* Mini Takeaway Callout */}
                <div className="border-l-2 border-[#10B981] bg-[#0E1422] rounded-r-lg p-2.5 mb-3 text-xs text-[#A3AEC2] leading-relaxed">
                  <strong className="text-[#F2F5FA]">Why the market moved:</strong> SBP rate-cut signals sparked heavy buying across banks and fertilizer producers, offsetting mild oil weakness.
                </div>

                {/* Sample Movers preview rows */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#6B778D] uppercase tracking-wider px-1">Top Movers</div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0E1422]/60 border border-[#1F2A40]/60 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#F2F5FA] mr-2">MEBL</span>
                      <span className="text-[#6B778D] text-[11px]">Meezan Bank</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono text-[#F2F5FA]">PKR 252.10</span>
                      <span className="font-mono font-semibold text-[#22C55E] bg-[#22C55E]/15 px-1.5 py-0.5 rounded text-[11px]">
                        +4.2%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0E1422]/60 border border-[#1F2A40]/60 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#F2F5FA] mr-2">OGDC</span>
                      <span className="text-[#6B778D] text-[11px]">Oil & Gas Dev.</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono text-[#F2F5FA]">PKR 158.40</span>
                      <span className="font-mono font-semibold text-[#22C55E] bg-[#22C55E]/15 px-1.5 py-0.5 rounded text-[11px]">
                        +2.8%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0E1422]/60 border border-[#1F2A40]/60 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#F2F5FA] mr-2">SYS</span>
                      <span className="text-[#6B778D] text-[11px]">Systems Limited</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono text-[#F2F5FA]">PKR 442.00</span>
                      <span className="font-mono font-semibold text-[#EF4444] bg-[#EF4444]/15 px-1.5 py-0.5 rounded text-[11px]">
                        -1.2%
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
