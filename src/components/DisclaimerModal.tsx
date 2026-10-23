import React, { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { Button } from './ui/Button.tsx';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="bg-[#0E1422] border border-[#1F2A40] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close disclaimer modal"
          className="absolute top-5 right-5 text-[#6B778D] hover:text-[#F2F5FA] p-1.5 rounded-lg hover:bg-[#121A2B] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 id="disclaimer-title" className="text-lg font-bold text-[#F2F5FA]">
              Regulatory & SECP Compliance Disclosure
            </h2>
            <div className="text-xs text-[#6B778D]">Securities and Exchange Commission of Pakistan</div>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-[#A3AEC2] leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            <strong>Educational & Analytical Nature:</strong> PSX AlphaBrief is an automated quantitative research and data compilation tool. All market snapshots, index levels, stock breakdowns, and LLM-generated contextual narratives are compiled for informational and educational purposes only.
          </p>
          <p>
            <strong>No Investment Advice:</strong> Nothing published on this website, in the daily digests, or within the weekly portfolio radars constitutes personalized investment advice, a stock recommendation, an endorsement, or a solicitation to buy or sell any financial security or derivative traded on the Pakistan Stock Exchange (PSX).
          </p>
          <p>
            <strong>Capital Risk:</strong> Equity investments carry market risks, including the potential loss of principal capital. Past performance is no guarantee of future returns. Stock prices fluctuate based on macroeconomic conditions, corporate actions, interest rate changes, and geopolitical developments.
          </p>
          <p>
            <strong>Licensing & Advisory:</strong> Neither this platform nor its creators are registered as investment advisers, research analysts, or portfolio managers under the Securities Act, 2015, or SECP regulations. Readers must independently evaluate all financial data and consult a qualified, SECP-licensed broker or financial adviser before executing any investment decision.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#1F2A40] flex justify-end">
          <Button size="sm" variant="secondary" onClick={onClose}>
            I Understand & Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
};
