export default function InfoCardIllustration() {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-label="">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe0ff" />
          <stop offset="100%" stopColor="#8fc7fb" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5aa4f0" />
          <stop offset="100%" stopColor="#235ee0" />
        </linearGradient>
      </defs>

      <rect width="400" height="220" fill="url(#skyGrad)" />

      <g fill="#ffffff" opacity="0.55">
        <ellipse cx="60" cy="45" rx="28" ry="14" />
        <ellipse cx="85" cy="38" rx="20" ry="11" />
        <ellipse cx="330" cy="35" rx="24" ry="12" />
        <ellipse cx="355" cy="42" rx="16" ry="9" />
      </g>

      <g fill="#6fb3f5" opacity="0.55">
        <rect x="0" y="150" width="34" height="70" rx="2" />
        <rect x="36" y="130" width="30" height="90" rx="2" />
        <rect x="335" y="140" width="30" height="80" rx="2" />
        <rect x="368" y="120" width="32" height="100" rx="2" />
      </g>

      <g fill="#4f9142" opacity="0.65">
        <ellipse cx="30" cy="216" rx="40" ry="16" />
        <ellipse cx="370" cy="216" rx="45" ry="16" />
      </g>

      <g transform="translate(200 118)">
        <path
          d="M0 -62 L52 -46 C52 -6 32 26 0 46 C-32 26 -52 -6 -52 -46 Z"
          fill="url(#shieldGrad)"
        />
        <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M-24 -22 L-6 -30 L12 -22 L28 -30 L28 20 L12 28 L-6 20 L-24 28 Z" />
          <path d="M-6 -30 L-6 20" />
          <path d="M12 -22 L12 28" />
        </g>
      </g>

      <g transform="translate(96 140)">
        <circle cx="0" cy="-38" r="15" fill="#2b2540" />
        <path d="M-16 -8 Q0 -22 16 -8 L20 46 L-20 46 Z" fill="#4b8bf0" />
        <path d="M-16 -8 L-30 14" stroke="#4b8bf0" strokeWidth="8" strokeLinecap="round" />
        <rect x="-14" y="42" width="12" height="30" rx="4" fill="#233047" />
        <rect x="4" y="42" width="12" height="30" rx="4" fill="#233047" />
      </g>

      <g transform="translate(304 140)">
        <circle cx="0" cy="-38" r="15" fill="#2b2540" />
        <path d="M-16 -8 Q0 -22 16 -8 L20 46 L-20 46 Z" fill="#f97316" />
        <path d="M16 -8 L30 -30" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
        <rect x="-14" y="42" width="12" height="30" rx="4" fill="#233047" />
        <rect x="4" y="42" width="12" height="30" rx="4" fill="#233047" />
      </g>
    </svg>
  )
}
