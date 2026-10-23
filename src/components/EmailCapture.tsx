import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Users, Bell } from 'lucide-react';
import { validateEmail } from '../utils/rules.ts';

interface Props {
  onSubscribed?: (email: string) => void;
  subscriberCount?: number;
}

export const EmailCapture: React.FC<Props> = ({ onSubscribed, subscriberCount = 1424 }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFeedback({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    if (!validateEmail(trimmed)) {
      setFeedback({ type: 'error', message: 'Please enter a valid corporate or personal email address.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'web_landing' })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasSubscribed(true);
        setFeedback({
          type: 'success',
          message: data.message || 'Subscription confirmed! You will receive the next PSX Daily Digest at 08:00 AM PKT.'
        });
        if (onSubscribed) onSubscribed(trimmed);
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to register subscription. Please try again.'
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network error communicating with the subscription engine.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {hasSubscribed ? (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-6 text-center shadow-lg backdrop-blur-sm animate-fade-in">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Subscription Activated</h3>
          <p className="text-sm text-emerald-200/90 mb-4 max-w-md mx-auto">
            {feedback?.message}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next dispatch: Tomorrow at 08:00 AM PKT</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <label htmlFor="subscriber-email" className="sr-only">Work or personal email address</label>
              <input
                id="subscriber-email"
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your corporate or personal email..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-400 rounded-lg text-sm transition-all outline-none shadow-inner"
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe Free</span>
              )}
            </button>
          </div>

          {feedback && feedback.type === 'error' && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Join <strong className="text-slate-200">{subscriberCount.toLocaleString()}</strong> institutional & retail investors</span>
            </span>
            <span className="text-slate-500">100% Free • No Spam • 1-Click Unsubscribe</span>
          </div>
        </form>
      )}
    </div>
  );
};
