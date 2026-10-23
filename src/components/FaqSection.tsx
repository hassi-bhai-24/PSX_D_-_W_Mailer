import React from 'react';
import { Accordion, AccordionItem } from './ui/Accordion.tsx';

export const FaqSection: React.FC = () => {
  const faqItems: AccordionItem[] = [
    {
      id: 'faq-1',
      question: 'Is PSX AlphaBrief really free?',
      answer: 'Yes, 100% free. There are no paywalls, hidden tiers, or credit card requirements. We built this as an automated public utility for Pakistan market investors.',
    },
    {
      id: 'faq-2',
      question: 'What time does the newsletter arrive in my inbox?',
      answer: 'The "PSX Top 100 Daily Digest" arrives every trading morning at 08:00 AM PKT, summarizing the previous session before market open. The "Weekly Intelligence & Portfolio Radar" arrives every Saturday at 10:00 AM PKT.',
    },
    {
      id: 'faq-3',
      question: 'Is this considered financial or investment advice?',
      answer: 'No. PSX AlphaBrief is an automated quantitative compiler and data summarization service. It does not provide personalized recommendations to buy or sell securities. Always perform independent due diligence or consult an SECP-licensed investment adviser.',
    },
    {
      id: 'faq-4',
      question: 'Where does the data come from?',
      answer: 'Market data is fetched directly from the official PSX Data Portal (dps.psx.com.pk) and verified against EOD trading sheets. Financial news is aggregated from Business Recorder, Dawn Finance, Profit by Pakistan Today, and Mettis Global.',
    },
    {
      id: 'faq-5',
      question: 'How do I unsubscribe?',
      answer: 'Every email includes a one-click unsubscribe link at the bottom. You can also enter your email in the unsubscribe form at any time to instantly remove your address.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 border-b border-[#1F2A40] bg-[#070B14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-mono font-semibold text-[#10B981] uppercase tracking-wider mb-2">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F5FA] tracking-tight">
            Common questions answered
          </h2>
          <p className="text-sm text-[#A3AEC2] mt-2">
            Everything you need to know about our data, schedule, and automation.
          </p>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-1" />
      </div>
    </section>
  );
};
