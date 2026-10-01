import React from 'react';

interface CeLealStudioLogoProps {
  className?: string;
  variant?: 'header' | 'full' | 'icon';
}

export const CeLealStudioLogo: React.FC<CeLealStudioLogoProps> = ({
  className = '',
  variant = 'header'
}) => {
  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 280 240" 
        className={className} 
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="ceIconCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="25%" stopColor="#bae6fd" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="ceIconArrow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <filter id="ceIconDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>
        <g transform="translate(135, 120) scale(0.9)" filter="url(#ceIconDropShadow)">
          <path d="M 0 -62 L 95 -62 L 95 -34 L 32 -34 L 32 -6 L 82 -6 L 82 20 L 32 20 L 32 78 L 98 78 L 98 106 L 0 106 Z" fill="url(#ceIconCyan)" stroke="#0369a1" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 2 -60 L 93 -60 L 93 -36 L 34 -36 L 34 -4 L 80 -4 L 80 18 L 34 18 L 34 80 L 96 80 L 96 104 L 2 104 Z" fill="none" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.75" />
          <path d="M -15 -68 C -70 -68 -118 -25 -118 20 C -118 65 -70 108 -15 108 C 22 108 55 88 68 62 L 40 44 C 28 62 8 78 -15 78 C -52 78 -86 48 -86 20 C -86 -8 -52 -38 -15 -38 C 5 -38 25 -25 38 -10 L 68 -28 C 50 -52 18 -68 -15 -68 Z" fill="url(#ceIconCyan)" stroke="#bae6fd" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M -15 -62 C -65 -62 -110 -20 -110 20 C -110 60 -65 100 -15 100 C 18 100 48 82 60 58" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
          <path d="M -45 52 C -20 62 10 50 35 15 C 55 -15 80 -45 110 -68" fill="none" stroke="url(#ceIconArrow)" strokeWidth="12" strokeLinecap="round" />
          <path d="M -42 52 C -18 61 10 50 35 15 C 55 -15 80 -45 106 -66" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
          <polygon points="112,-88 126,-50 92,-64" fill="url(#ceIconArrow)" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }

  // Header horizontal variant (ideal for the top navbar row)
  return (
    <svg 
      viewBox="0 0 470 100" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient id="ceHdrCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="25%" stopColor="#bae6fd" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="75%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        <linearGradient id="ceHdrArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>

        <linearGradient id="ceHdrTextStudio" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        <filter id="ceHdrDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        <filter id="ceHdrGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient Blue Halo behind emblem */}
      <ellipse cx="55" cy="50" rx="45" ry="35" fill="#0284c7" opacity="0.4" filter="url(#ceHdrGlow)" />

      {/* 3D METALLIC EMBLEM ON LEFT */}
      <g transform="translate(55, 48) scale(0.38)" filter="url(#ceHdrDropShadow)" textAnchor="middle">
        <g opacity="0.4" filter="url(#ceHdrGlow)">
          <path d="M -20 -70 C -75 -70 -120 -25 -120 20 C -120 65 -75 110 -20 110 C 15 110 40 95 55 75 L 25 55 C 15 70 -3 82 -20 82 C -55 82 -88 52 -88 20 C -88 -12 -55 -42 -20 -42 C 0 -42 20 -30 32 -15 L 62 -35 C 40 -58 12 -70 -20 -70 Z" fill="#38bdf8" />
          <path d="M -5 -65 L 85 -65 L 85 -37 L 25 -37 L 25 -10 L 75 -10 L 75 18 L 25 18 L 25 78 L 90 78 L 90 106 L -5 106 Z" fill="#0284c7" />
        </g>
        <path d="M 0 -62 L 95 -62 L 95 -34 L 32 -34 L 32 -6 L 82 -6 L 82 20 L 32 20 L 32 78 L 98 78 L 98 106 L 0 106 Z" fill="url(#ceHdrCyan)" stroke="#0369a1" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 2 -60 L 93 -60 L 93 -36 L 34 -36 L 34 -4 L 80 -4 L 80 18 L 34 18 L 34 80 L 96 80 L 96 104 L 2 104 Z" fill="none" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.75" />
        <path d="M -15 -68 C -70 -68 -118 -25 -118 20 C -118 65 -70 108 -15 108 C 22 108 55 88 68 62 L 40 44 C 28 62 8 78 -15 78 C -52 78 -86 48 -86 20 C -86 -8 -52 -38 -15 -38 C 5 -38 25 -25 38 -10 L 68 -28 C 50 -52 18 -68 -15 -68 Z" fill="url(#ceHdrCyan)" stroke="#bae6fd" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M -15 -62 C -65 -62 -110 -20 -110 20 C -110 60 -65 100 -15 100 C 18 100 48 82 60 58" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
        <path d="M -45 52 C -20 62 10 50 35 15 C 55 -15 80 -45 110 -68" fill="none" stroke="url(#ceHdrArrow)" strokeWidth="12" strokeLinecap="round" />
        <path d="M -42 52 C -18 61 10 50 35 15 C 55 -15 80 -45 106 -66" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <polygon points="112,-88 126,-50 92,-64" fill="url(#ceHdrArrow)" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* TYPOGRAPHY ON RIGHT */}
      <g textAnchor="start">
        {/* C.E. LEAL */}
        <text 
          x="115" 
          y="44" 
          fill="#ffffff" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="35" 
          fontWeight="900" 
          letterSpacing="3"
        >
          C.E. LEAL
        </text>

        {/* studio */}
        <text 
          x="315" 
          y="44" 
          fill="url(#ceHdrTextStudio)" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="29" 
          fontWeight="500" 
          letterSpacing="2"
        >
          studio
        </text>

        {/* Divider line */}
        <line x1="115" y1="56" x2="450" y2="56" stroke="#38bdf8" strokeWidth="1.8" opacity="0.65" strokeLinecap="round" />
        <circle cx="280" cy="56" r="2.5" fill="#38bdf8" opacity="0.9" />

        {/* SOFTWARE & MEDICAL APPS */}
        <text 
          x="115" 
          y="79" 
          fill="#94a3b8" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="14.5" 
          fontWeight="800" 
          letterSpacing="4.5"
        >
          SOFTWARE &amp; MEDICAL APPS
        </text>
      </g>
    </svg>
  );
};
