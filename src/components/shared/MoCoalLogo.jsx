import React from 'react'

/**
 * Official Ministry of Coal Logo Component
 * Uses the real Government of India — Ashoka Lion Capital emblem
 * with bilingual "कोयला मंत्रालय / MINISTRY OF COAL" branding.
 *
 * Props:
 *  size      — 'xs' | 'sm' | 'md' | 'lg' | 'xl'   (controls height)
 *  variant   — 'dark' (black on transparent) | 'light' (white/gold on dark)
 *  showText  — show "Ministry of Coal" text alongside emblem (default true)
 *  className — extra classes
 */
export default function MoCoalLogo({
  size = 'md',
  variant = 'light',
  showText = true,
  className = '',
}) {
  const heights = {
    xs: 28,
    sm: 36,
    md: 46,
    lg: 60,
    xl: 80,
  }

  const h = heights[size] || heights.md

  // When variant='light' (used on dark backgrounds) we invert the black SVG to white/gold
  const filter =
    variant === 'light'
      ? 'brightness(0) saturate(100%) invert(78%) sepia(61%) saturate(600%) hue-rotate(5deg) brightness(105%)'
      : 'none'

  if (!showText) {
    // Emblem-only mode (just the Ashoka Pillar icon)
    return (
      <img
        src="/assets/ministry_of_coal_logo.svg"
        alt="Ministry of Coal – Government of India"
        style={{
          height: h,
          width: 'auto',
          filter,
          objectFit: 'contain',
          // Only show the left ~40% (emblem portion) by cropping via clip
          maxWidth: h * 0.6,
          objectPosition: 'left center',
        }}
        className={`shrink-0 select-none ${className}`}
        draggable={false}
      />
    )
  }

  return (
    <img
      src="/assets/ministry_of_coal_logo.svg"
      alt="Ministry of Coal – Government of India"
      style={{
        height: h,
        width: 'auto',
        filter,
        objectFit: 'contain',
      }}
      className={`shrink-0 select-none ${className}`}
      draggable={false}
    />
  )
}
