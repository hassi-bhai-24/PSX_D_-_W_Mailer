import React, { useState } from 'react';
import { Menu, X, Terminal, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button.tsx';

interface NavbarProps {
  onSubscribeClick: () => void;
  showDevView: boolean;
  onToggleDevView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSubscribeClick,
  showDevView,
  onToggleDevView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-[#0E1422]/90 backdrop-blur-md border-b border-[#1F2A40] sticky top-8 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-base font-bold text-[#F2F5FA] tracking-tight group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981]/25 transition-colors">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span>
            PSX <span className="text-[#10B981]">AlphaBrief</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A3AEC2]">
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-[#F2F5FA] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('sample-emails')}
            className="hover:text-[#F2F5FA] transition-colors cursor-pointer"
          >
            Sample emails
          </button>
          <button
            type="button"
            onClick={() => scrollTo('pricing')}
            className="hover:text-[#F2F5FA] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Pricing</span>
            <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] px-1.5 py-0.2 rounded font-mono font-bold">
              FREE
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo('faq')}
            className="hover:text-[#F2F5FA] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Right CTA & Developer toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleDevView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
              showDevView
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40'
                : 'bg-[#121A2B] text-[#A3AEC2] border-[#1F2A40] hover:text-[#F2F5FA]'
            }`}
            title="Toggle Architecture, Schemas, & Cron Trigger Simulator"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer view</span>
          </button>

          <Button
            size="sm"
            variant="primary"
            onClick={onSubscribeClick}
          >
            Subscribe
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-[#A3AEC2] hover:text-[#F2F5FA] hover:bg-[#121A2B] rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1422] border-b border-[#1F2A40] px-4 py-4 space-y-3 animate-in fade-in duration-150">
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="block w-full text-left py-2 text-sm text-[#A3AEC2] hover:text-[#F2F5FA]"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('sample-emails')}
            className="block w-full text-left py-2 text-sm text-[#A3AEC2] hover:text-[#F2F5FA]"
          >
            Sample emails
          </button>
          <button
            type="button"
            onClick={() => scrollTo('pricing')}
            className="block w-full text-left py-2 text-sm text-[#A3AEC2] hover:text-[#F2F5FA]"
          >
            Pricing (100% Free)
          </button>
          <button
            type="button"
            onClick={() => scrollTo('faq')}
            className="block w-full text-left py-2 text-sm text-[#A3AEC2] hover:text-[#F2F5FA]"
          >
            FAQ
          </button>

          <div className="pt-3 border-t border-[#1F2A40] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onToggleDevView();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-[#A3AEC2] bg-[#121A2B] rounded-lg border border-[#1F2A40]"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showDevView ? 'Hide Developer view' : 'Show Developer view'}</span>
            </button>
            <Button
              size="md"
              variant="primary"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onSubscribeClick();
              }}
            >
              Subscribe Free
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
