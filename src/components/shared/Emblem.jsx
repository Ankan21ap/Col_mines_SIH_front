import React from 'react'

/**
 * State Emblem of India (Ashoka Lion Capital) + Ministry of Coal Typography (English)
 * Scalable SVG vector with official Government of India styling.
 */
export default function Emblem({
  size = 'md',
  variant = 'gold',
  showText = true,
  stacked = false,
  className = '',
}) {
  // Dimensions based on size
  const sizes = {
    xs: { emblem: 26, textScale: 'text-[9px]', titleScale: 'text-xs' },
    sm: { emblem: 34, textScale: 'text-[10px]', titleScale: 'text-sm' },
    md: { emblem: 46, textScale: 'text-xs', titleScale: 'text-base' },
    lg: { emblem: 60, textScale: 'text-sm', titleScale: 'text-xl' },
    xl: { emblem: 76, textScale: 'text-base', titleScale: 'text-2xl' },
    hero: { emblem: 96, textScale: 'text-sm', titleScale: 'text-3xl' },
  }

  const s = sizes[size] || sizes.md

  // Color variants
  const colors = {
    gold: {
      subtext: 'text-amber-200/90',
      title: 'text-white',
      filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.3))',
    },
    white: {
      subtext: 'text-slate-300',
      title: 'text-white',
      filter: 'drop-shadow(0 2px 6px rgba(255, 255, 255, 0.2))',
    },
    dark: {
      subtext: 'text-slate-600',
      title: 'text-slate-900',
      filter: 'none',
    },
  }

  const c = colors[variant] || colors.gold

  return (
    <div className={`flex ${stacked ? 'flex-col items-center text-center' : 'flex-row items-center text-left'} gap-3 ${className}`}>
      {/* Ashoka Lion Capital SVG */}
      <div
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: s.emblem, height: s.emblem * 1.25, filter: c.filter }}
      >
        <svg
          viewBox="0 0 200 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Central Lion Head */}
          <path
            d="M100 20 C90 20 82 28 82 40 C82 48 86 54 90 58 C84 62 80 70 80 80 C80 92 88 100 100 100 C112 100 120 92 120 80 C120 70 116 62 110 58 C114 54 118 48 118 40 C118 28 110 20 100 20 Z"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-400' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />
          {/* Mane details */}
          <path
            d="M75 50 C70 58 68 70 72 82 C74 90 80 96 86 102 C82 108 78 116 78 126 C78 140 88 152 100 152 C112 152 122 140 122 126 C122 116 118 108 114 102 C120 96 126 90 128 82 C132 70 130 58 125 50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className={variant === 'gold' ? 'text-amber-300' : variant === 'white' ? 'text-slate-200' : 'text-slate-700'}
          />
          {/* Left Lion Profile */}
          <path
            d="M56 36 C46 40 40 50 42 64 C44 74 52 82 62 86 C58 96 60 108 68 118 C72 124 78 128 84 130 C76 138 72 148 74 158"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            className={variant === 'gold' ? 'text-amber-400' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />
          {/* Right Lion Profile */}
          <path
            d="M144 36 C154 40 160 50 158 64 C156 74 148 82 138 86 C142 96 140 108 132 118 C128 124 122 128 116 130 C124 138 128 148 126 158"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            className={variant === 'gold' ? 'text-amber-400' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />

          {/* Abacus / Base Platform */}
          <rect
            x="30"
            y="162"
            width="140"
            height="14"
            rx="3"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-500' : variant === 'white' ? 'text-slate-300' : 'text-slate-700'}
          />

          {/* Center Ashoka Chakra */}
          <circle
            cx="100"
            cy="188"
            r="16"
            stroke="currentColor"
            strokeWidth="3.5"
            className={variant === 'gold' ? 'text-amber-300' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />
          <circle
            cx="100"
            cy="188"
            r="3"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-300' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />
          {/* Chakra Spokes */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="188"
              x2={100 + 13 * Math.cos((deg * Math.PI) / 180)}
              y2={188 + 13 * Math.sin((deg * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="1.6"
              className={variant === 'gold' ? 'text-amber-400' : variant === 'white' ? 'text-slate-200' : 'text-slate-700'}
            />
          ))}

          {/* Galloping Horse (Left) */}
          <path
            d="M52 186 C46 182 42 184 40 190 C42 194 48 196 54 194 C58 192 62 186 52 186 Z"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-400' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />
          {/* Bull (Right) */}
          <path
            d="M148 186 C154 182 158 184 160 190 C158 194 152 196 146 194 C142 192 138 186 148 186 Z"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-400' : variant === 'white' ? 'text-white' : 'text-slate-800'}
          />

          {/* Lower Base Step */}
          <rect
            x="20"
            y="206"
            width="160"
            height="10"
            rx="2"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-500' : variant === 'white' ? 'text-slate-300' : 'text-slate-700'}
          />

          {/* Satyameva Jayate Banner Text */}
          <text
            x="100"
            y="238"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="2"
            fill="currentColor"
            className={variant === 'gold' ? 'text-amber-300 font-serif' : variant === 'white' ? 'text-white font-serif' : 'text-slate-900 font-serif'}
          >
            SATYAMEVA JAYATE
          </text>
        </svg>
      </div>

      {/* Official English Typography */}
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span className={`text-[10px] font-extrabold tracking-widest uppercase ${c.subtext}`}>
            GOVERNMENT OF INDIA
          </span>
          <h1 className={`font-black uppercase tracking-wider leading-tight ${s.titleScale} ${c.title} drop-shadow-sm`}>
            MINISTRY OF <span className="text-amber-400">COAL</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-slate-400 font-medium tracking-normal">
              CoalGov Intelligence Platform
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
