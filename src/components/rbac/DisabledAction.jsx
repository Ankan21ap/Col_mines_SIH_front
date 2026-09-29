import React, { useState } from 'react'

/**
 * DisabledAction — shown when a user lacks permission for an action.
 * Can render inline text, a tooltip-wrapped button, or a banner.
 */
export default function DisabledAction({ reason, mode = 'inline', children }) {
  const [show, setShow] = useState(false)

  const msg = reason || "You don't have permission to perform this action."

  if (mode === 'tooltip' && children) {
    return (
      <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <div className="opacity-40 cursor-not-allowed pointer-events-none select-none">{children}</div>
        {show && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 px-3 py-2 rounded-lg bg-slate-900 border border-red-500/40 text-red-300 text-xs shadow-xl">
            <div className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>{msg}</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        )}
      </div>
    )
  }

  if (mode === 'banner') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
        <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-red-300">{msg}</p>
      </div>
    )
  }

  // inline (default)
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
      No permission
    </span>
  )
}
