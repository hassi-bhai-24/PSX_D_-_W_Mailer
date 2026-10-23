import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BadgeProps {
  variant?: 'gain' | 'loss' | 'warning' | 'info' | 'neutral' | 'emerald';
  children: React.ReactNode;
  icon?: 'arrow' | 'dot' | 'none';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon = 'none',
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    gain: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25',
    loss: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/25',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25',
    info: 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/25',
    emerald: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
    neutral: 'bg-[#0E1422] text-[#A3AEC2] border border-[#1F2A40]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-mono font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-tight whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon === 'arrow' && variant === 'gain' && <ArrowUpRight className="w-3 h-3 shrink-0" />}
      {icon === 'arrow' && variant === 'loss' && <ArrowDownRight className="w-3 h-3 shrink-0" />}
      {icon === 'dot' && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            variant === 'gain'
              ? 'bg-[#22C55E]'
              : variant === 'loss'
              ? 'bg-[#EF4444]'
              : variant === 'warning'
              ? 'bg-[#F59E0B]'
              : variant === 'info'
              ? 'bg-[#38BDF8]'
              : variant === 'emerald'
              ? 'bg-[#10B981]'
              : 'bg-[#A3AEC2]'
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
