import React from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  change,
  isPositive,
  subtext,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#121A2B] border border-[#1F2A40] rounded-xl p-4 transition-all duration-200 hover:border-[#2D3D5E] ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-[#A3AEC2] mb-1.5 font-medium">
        <span>{label}</span>
        {icon && <span className="text-[#6B778D]">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xl sm:text-2xl font-bold text-[#F2F5FA] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`font-mono text-xs font-semibold ${
              isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>

      {subtext && (
        <div className="text-[13px] text-[#6B778D] mt-1 truncate">
          {subtext}
        </div>
      )}
    </div>
  );
};
