export const TOKENS = {
  colors: {
    bgBase: '#070B14',
    bgSurface: '#0E1422',
    bgCard: '#121A2B',
    bgCardHover: '#162035',
    border: '#1F2A40',
    borderHover: '#2D3D5E',

    textPrimary: '#F2F5FA',
    textSecondary: '#A3AEC2',
    textMuted: '#6B778D',

    emerald: '#10B981',
    emeraldHover: '#059669',
    emeraldSoft: 'rgba(16, 185, 129, 0.12)',

    gain: '#22C55E',
    gainSoft: 'rgba(34, 197, 94, 0.12)',
    loss: '#EF4444',
    lossSoft: 'rgba(239, 68, 68, 0.12)',
    warning: '#F59E0B',
    warningSoft: 'rgba(245, 158, 11, 0.12)',
    info: '#38BDF8',
    infoSoft: 'rgba(56, 189, 248, 0.12)',
  },
  radius: {
    card: '12px',
    input: '8px',
    pill: '9999px',
  },
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, IBM Plex Mono, monospace',
  }
} as const;
