import React from 'react'

const FACTOR_LABELS = {
  criticalViolations:  { label: 'Critical Violations',       icon: '🔴', maxPoints: 50 },
  highViolations:      { label: 'High-Severity Violations',  icon: '🟠', maxPoints: 30 },
  overdueActions:      { label: 'Overdue Corrective Actions', icon: '⏰', maxPoints: 20 },
  recurringViolations: { label: 'Recurring Violation Pattern', icon: '🔁', maxPoints: 18 },
  inspectionTrend:     { label: 'Negative Inspection Trend', icon: '📉', maxPoints: 14 },
  contractorIssues:    { label: 'Contractor Issues',         icon: '👷', maxPoints: 10 },
  complianceModifier:  { label: 'Compliance Rate Modifier',  icon: '📋', maxPoints: 15 },
}

/**
 * RiskBreakdown — Explainability panel showing factor contributions
 */
export default function RiskBreakdown({ breakdown, aiExplanation, loading }) {
  if (!breakdown) return null

  const factors = Object.entries(FACTOR_LABELS)
    .map(([key, meta]) => ({
      key,
      ...meta,
      value: breakdown[key] || 0,
    }))
    .filter(f => f.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))

  return (
    <div className="space-y-5">
      {/* AI Explanation */}
      <div className="rounded-2xl bg-violet-500/8 border border-violet-500/20 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm">🤖</div>
          <div>
            <p className="text-xs font-bold text-violet-300">AI Risk Analysis</p>
            <p className="text-[10px] text-slate-500">Powered by Groq · llama-3.3-70b-versatile</p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-3.5 h-3.5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
            Generating AI explanation...
          </div>
        ) : (
          <p className="text-xs text-slate-300 leading-relaxed">
            {aiExplanation || 'AI explanation not available. Run risk computation to generate.'}
          </p>
        )}
        <p className="text-[9px] text-slate-600 italic">
          Note: AI scores are advisory. Human verification required before action.
        </p>
      </div>

      {/* Factor breakdown */}
      {factors.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contributing Factors</p>
          {factors.map(factor => {
            const isNegative = factor.value < 0
            const absVal = Math.abs(factor.value)
            const pct = Math.min((absVal / Math.max(factor.maxPoints, 1)) * 100, 100)

            return (
              <div key={factor.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span>{factor.icon}</span>
                    <span className="text-slate-300 font-medium">{factor.label}</span>
                  </div>
                  <span className={`font-black font-mono ${isNegative ? 'text-emerald-400' : absVal > 15 ? 'text-red-400' : absVal > 8 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {isNegative ? '' : '+'}{factor.value}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isNegative ? 'bg-emerald-500' : absVal > 15 ? 'bg-red-500' : absVal > 8 ? 'bg-amber-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {factors.length === 0 && (
        <div className="text-center py-4">
          <p className="text-xs text-emerald-400 font-bold">🟢 No significant risk factors detected</p>
          <p className="text-[10px] text-slate-500 mt-1">This mine shows excellent compliance and safety performance.</p>
        </div>
      )}
    </div>
  )
}
