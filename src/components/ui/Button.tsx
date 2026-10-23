import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-[#10B981] hover:bg-[#059669] text-[#070B14] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_16px_rgba(16,185,129,0.35)]',
    secondary: 'bg-[#0E1422] hover:bg-[#162035] text-[#F2F5FA] border border-[#1F2A40] hover:border-[#2D3D5E] shadow-sm',
    ghost: 'bg-transparent hover:bg-[#0E1422] text-[#A3AEC2] hover:text-[#F2F5FA]',
    danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-6 py-3 h-12 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
