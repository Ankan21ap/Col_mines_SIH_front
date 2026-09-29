import React from 'react'

/**
 * StepWizard — Multi-step form progress indicator + container
 * 
 * @param {string[]} steps     — step labels
 * @param {number}  current    — 0-indexed current step
 * @param {node}    children   — step content
 * @param {fn}      onNext
 * @param {fn}      onBack
 * @param {fn}      onSubmit
 * @param {boolean} submitting
 */
export default function StepWizard({ steps, current, children, onNext, onBack, onSubmit, submitting = false }) {
  const isFirst = current === 0
  const isLast = current === steps.length - 1

  return (
    <div className="flex flex-col gap-8">
      {/* Step indicators */}
      <div className="flex items-center gap-0">
        {steps.map((label, idx) => {
          const done = idx < current
          const active = idx === current

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                  ${done ? 'bg-amber-500 border-amber-500 text-white' : ''}
                  ${active ? 'bg-slate-900 border-amber-500 text-amber-400 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]' : ''}
                  ${!done && !active ? 'bg-slate-800 border-slate-700 text-slate-500' : ''}
                `}>
                  {done ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : idx + 1}
                </div>
                <span className={`text-xs font-medium text-center leading-tight transition-colors
                  ${active ? 'text-amber-400' : done ? 'text-slate-300' : 'text-slate-600'}`}>
                  {label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mt-[-14px] mb-auto transition-all duration-500
                  ${done ? 'bg-amber-500' : 'bg-slate-700'}`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[200px]">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBack}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {!isLast ? (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20"
          >
            Continue
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Create User
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
