import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  className = '',
}) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map(item => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-[#121A2B] border border-[#1F2A40] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#2D3D5E]"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-base font-semibold text-[#F2F5FA] hover:text-white transition-colors cursor-pointer select-none"
            >
              <span className="pr-4">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#6B778D] transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#10B981]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className="px-5 pb-5 pt-1 text-sm text-[#A3AEC2] leading-relaxed border-t border-[#1F2A40]/60 animate-in fade-in duration-150"
              >
                {typeof item.answer === 'string' ? (
                  <p>{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
