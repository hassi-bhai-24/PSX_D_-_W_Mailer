/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { TopTicker } from './components/TopTicker.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { FeaturesSection } from './components/FeaturesSection.tsx';
import { SampleEmailSection } from './components/SampleEmailSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { DeveloperDrawer } from './components/DeveloperDrawer.tsx';
import { DisclaimerModal } from './components/DisclaimerModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Toast, ToastMessage } from './components/ui/Toast.tsx';
import { DailyDigestReport, WeeklyIntelligenceReport } from './types/index.ts';

export default function App() {
  const [dailyReport, setDailyReport] = useState<DailyDigestReport | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyIntelligenceReport | null>(null);
  const [showDevView, setShowDevView] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchReports = async () => {
    try {
      const [dailyRes, weeklyRes] = await Promise.all([
        fetch('/api/reports/daily/latest').then(r => r.json()).catch(() => null),
        fetch('/api/reports/weekly/latest').then(r => r.json()).catch(() => null)
      ]);

      if (dailyRes && !dailyRes.error) setDailyReport(dailyRes);
      if (weeklyRes && !weeklyRes.error) setWeeklyReport(weeklyRes);
    } catch (e) {
      console.warn('Initial data fetch notice:', e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubscribed = (email: string) => {
    setToast({
      id: `toast-${Date.now()}`,
      type: 'success',
      message: `Subscribed! First briefing arrives at 08:00 AM PKT.`
    });
  };

  const handleCopyToast = () => {
    setToast({
      id: `toast-${Date.now()}`,
      type: 'info',
      message: 'Email HTML copied to clipboard.'
    });
  };

  const scrollToHeroForm = () => {
    const el = document.getElementById('subscribe-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('hero-email');
      if (input) input.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F2F5FA] flex flex-col font-sans selection:bg-[#10B981] selection:text-[#070B14]">
      {/* 1. Slim Sticky Ticker Strip */}
      <TopTicker
        kse100Close={dailyReport?.kse100?.close || 91240.50}
        changePercent={dailyReport?.kse100?.changePercent || 1.15}
        netChange={dailyReport?.kse100?.netChange || 1035.20}
      />

      {/* 2. Navigation Bar */}
      <Navbar
        onSubscribeClick={scrollToHeroForm}
        showDevView={showDevView}
        onToggleDevView={() => {
          setShowDevView(!showDevView);
          if (!showDevView) {
            setTimeout(() => {
              const devEl = document.getElementById('developer-view');
              if (devEl) devEl.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* 3. Hero Section with Two-Column Layout and Floating Preview */}
        <HeroSection
          kse100Close={dailyReport?.kse100?.close || 91240.50}
          changePercent={dailyReport?.kse100?.changePercent || 1.15}
          netChange={dailyReport?.kse100?.netChange || 1035.20}
          onSubscribed={handleSubscribed}
        />

        {/* 4. Feature Cards and 3-Step How It Works */}
        <FeaturesSection />

        {/* 5. Sample Email Preview Section with Responsive Frame */}
        <SampleEmailSection
          dailyHtml={dailyReport?.htmlContent}
          weeklyHtml={weeklyReport?.htmlContent}
          onCopyToast={handleCopyToast}
        />

        {/* Pricing Anchor Section */}
        <section id="pricing" className="py-16 sm:py-20 border-b border-[#1F2A40] bg-[#0E1422]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-semibold mb-4">
              100% FREE PUBLIC RESEARCH
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F5FA] tracking-tight mb-3">
              No subscription fees. No paywalls.
            </h2>
            <p className="text-base text-[#A3AEC2] max-w-xl mx-auto mb-8">
              Quality frontier market financial analysis should be accessible to all individual and institutional investors in Pakistan.
            </p>
            <div className="p-6 bg-[#121A2B] border border-[#1F2A40] rounded-2xl max-w-md mx-auto text-left shadow-lg">
              <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-[#1F2A40]">
                <div>
                  <h3 className="text-lg font-bold text-[#F2F5FA]">AlphaBrief Free</h3>
                  <p className="text-xs text-[#A3AEC2]">All features included</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-[#10B981]">PKR 0</span>
                  <span className="text-xs text-[#6B778D]"> / forever</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-[#A3AEC2] mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Daily KSE-100 Top 100 Digest at 08:00 AM PKT</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Why each stock moved 1-line catalyst drivers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Saturday Weekly Radar (Top 24 Buy & Top 20 Avoid)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>1-click unsubscribe anytime with zero spam</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={scrollToHeroForm}
                className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#070B14] font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
              >
                Join Free Subscribers
              </button>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <FaqSection />

        {/* 7. Developer View (Architecture, Schemas, Manual Simulator) */}
        {showDevView && (
          <DeveloperDrawer
            isOpen={showDevView}
            onClose={() => setShowDevView(false)}
            onPipelineCompleted={fetchReports}
          />
        )}
      </main>

      {/* 8. Footer with 3 clean columns and condensed disclaimer */}
      <Footer
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenDevView={() => {
          setShowDevView(true);
          setTimeout(() => {
            const devEl = document.getElementById('developer-view');
            if (devEl) devEl.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* SECP Regulatory Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      {/* Floating Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
