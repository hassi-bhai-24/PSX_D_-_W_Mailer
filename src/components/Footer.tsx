import React from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenDisclaimer: () => void;
  onOpenDevView: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimer, onOpenDevView }) => {
  return (
    <footer className="w-full bg-[#070B14] border-t border-[#1F2A40] pt-14 pb-12 text-sm text-[#A3AEC2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 text-base font-bold text-[#F2F5FA] mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>PSX <span className="text-[#10B981]">AlphaBrief</span></span>
            </a>
            <p className="text-xs text-[#6B778D] leading-relaxed mb-4">
              Automated financial intelligence and daily KSE-100 briefings for Pakistan Stock Exchange investors.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free Public Utility</span>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F2F5FA] mb-3.5">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-[#F2F5FA] transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#sample-emails" className="hover:text-[#F2F5FA] transition-colors">
                  Daily Digest (8:00 AM PKT)
                </a>
              </li>
              <li>
                <a href="#sample-emails" className="hover:text-[#F2F5FA] transition-colors">
                  Weekly Radar (Saturday 10:00 AM)
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDevView}
                  className="hover:text-[#10B981] transition-colors text-left cursor-pointer"
                >
                  Architecture & Schemas
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F2F5FA] mb-3.5">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenDisclaimer}
                  className="hover:text-[#F2F5FA] transition-colors text-left cursor-pointer"
                >
                  SECP Regulatory Disclaimer
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); onOpenDisclaimer(); }} className="hover:text-[#F2F5FA] transition-colors">
                  Privacy Policy (Zero spam pledge)
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); onOpenDisclaimer(); }} className="hover:text-[#F2F5FA] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F2F5FA] mb-3.5">
              Data & Schedule
            </h4>
            <ul className="space-y-2 text-xs text-[#6B778D]">
              <li>PSX Data Portal (dps.psx.com.pk)</li>
              <li>KSE-100 benchmark constituents</li>
              <li>Timezone: Asia/Karachi (UTC+05:00)</li>
              <li>Stock Exchange Rd, Karachi, Pakistan</li>
            </ul>
          </div>
        </div>

        {/* 2-line condensed disclaimer */}
        <div className="pt-6 border-t border-[#1F2A40] text-xs text-[#6B778D] leading-relaxed">
          <p className="mb-2">
            PSX AlphaBrief is an automated quantitative research and data compilation tool. It does not provide personalized investment advice or securities recommendations under SECP regulations.{' '}
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="text-[#10B981] hover:underline font-medium inline-block cursor-pointer"
            >
              Read full regulatory disclaimer
            </button>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-[#1F2A40]/40 text-[11px]">
            <div>© {new Date().getFullYear()} PSX AlphaBrief. Built for Pakistan market investors.</div>
            <div className="text-[#6B778D]">All trademarks and logos belong to their respective holders.</div>
          </div>
        </div>

      </div>
    </footer>
  );
};
