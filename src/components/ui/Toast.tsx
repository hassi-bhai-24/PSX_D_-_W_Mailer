import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#121A2B] border-[#10B981]/50 text-[#F2F5FA]',
    error: 'bg-[#121A2B] border-[#EF4444]/50 text-[#F2F5FA]',
    info: 'bg-[#121A2B] border-[#38BDF8]/50 text-[#F2F5FA]',
  };

  const iconStyles = {
    success: <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
    info: <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md max-w-sm ${bgStyles[toast.type]}`}
        role="status"
        aria-live="polite"
      >
        {iconStyles[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="ml-2 text-[#6B778D] hover:text-[#F2F5FA] p-1 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
