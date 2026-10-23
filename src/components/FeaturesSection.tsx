import React from 'react';
import { Calendar, BarChart3, Mail, CheckCircle } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Daily Digest, 8:00 AM PKT',
      description: 'KSE-100 summary, top gainers and losers, and a one-line reason for each move.',
      timing: 'Every trading morning',
    },
    {
      icon: BarChart3,
      title: 'Weekly Radar, Saturday 10:00 AM PKT',
      description: 'Macro brief, best-looking stocks, and stocks to avoid.',
      timing: 'Every weekend',
    },
    {
      icon: Mail,
      title: 'Fully automatic',
      description: 'Delivered to your inbox. No app, no login.',
      timing: 'Zero-effort workflow',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter email',
      description: 'Provide your email in the box above. No password or card required.',
    },
    {
      number: '02',
      title: 'Get briefing every morning',
      description: 'Our automated scraper and LLM engine compiles the data before market opens.',
    },
    {
      number: '03',
      title: 'Decide with better information',
      description: 'Read the clear takeaways and sector momentum in under two minutes.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-[#1F2A40] bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F5FA] tracking-tight mb-3">
            Built for clarity, not noise.
          </h2>
          <p className="text-base text-[#A3AEC2]">
            Everything you need to understand Pakistan equities, without messy chat apps or paid subscriptions.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-[#121A2B] border border-[#1F2A40] rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#10B981]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] group"
              >
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-5 group-hover:bg-[#10B981]/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono font-medium text-[#10B981] mb-1.5 uppercase tracking-wider">
                  {feat.timing}
                </div>
                <h3 className="text-lg font-bold text-[#F2F5FA] mb-2 leading-tight">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#A3AEC2] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works - 3 Numbered Steps */}
        <div className="bg-[#0E1422] border border-[#1F2A40] rounded-2xl p-8 sm:p-10">
          <div className="text-xs font-mono font-semibold text-[#10B981] uppercase tracking-wider mb-2">
            SIMPLE WORKFLOW
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F2F5FA] mb-8">
            How it works in 3 steps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(step => (
              <div key={step.number} className="relative">
                <div className="text-2xl font-mono font-black text-[#1F2A40] mb-2">
                  {step.number}
                </div>
                <h4 className="text-base font-bold text-[#F2F5FA] mb-1.5">
                  {step.title}
                </h4>
                <p className="text-sm text-[#A3AEC2] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
