import React, { useState } from 'react'

/**
 * VerificationPanel — Safety Officer / Manager verification UI
 * Shows field observation with officer decision controls and audit trail.
 */
export default function VerificationPanel({ observation, onVerify, onRequestCorrection, onReject }) {
  const [decision, setDecision] = useState(null)
  const [comment, setComment] = useState('')
  const [newSeverity, setNewSeverity] = useState(observation?.severity || '')
  const [submitting, setSubmitting] = useState(false)

  if (!observation) return null

  const severityColors = {
    CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
    HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  }

  const handleSubmit = async () => {
    if (!decision) return
    setSubmitting(true)
    try {
      if (decision === 'verify') await onVerify?.({ comment, severity: newSeverity })
      else if (decision === 'request') await onRequestCorrection?.({ comment })
      else if (decision === 'reject') await onReject?.({ comment })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Field Observation #{observation.id}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Submitted {observation.submittedAt}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${severityColors[observation.severity] || severityColors.MEDIUM}`}>
          {observation.severity}
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original record */}
        <div className="space-y-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Original Field Record</h4>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-400">
              {observation.inspector?.avatar || 'FI'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{observation.inspector?.name || 'Field Inspector'}</p>
              <p className="text-xs text-slate-500">Field Inspector · {observation.inspector?.employeeId}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-4">
              <p className="text-xs text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-200">{observation.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3">
                <p className="text-xs text-slate-400 mb-1">Evidence</p>
                <p className="text-sm font-semibold text-white">{observation.evidenceCount} Photos</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3">
                <p className="text-xs text-slate-400 mb-1">GPS</p>
                <p className="text-sm font-semibold text-white">{observation.gps ? '✓ Captured' : '✗ Missing'}</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3">
                <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                <p className="text-sm font-semibold text-white">{observation.timestamp}</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3">
                <p className="text-xs text-slate-400 mb-1">Mine</p>
                <p className="text-sm font-semibold text-white truncate">{observation.mineName}</p>
              </div>
            </div>
          </div>

          {/* Audit trail */}
          {observation.auditTrail?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Audit Trail</p>
              {observation.auditTrail.map((entry, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                  <span><span className="text-slate-300">{entry.actor}</span> {entry.action} · {entry.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Officer decision */}
        <div className="space-y-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Officer Decision</h4>

          {/* Severity override */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Override Severity (creates audit event)</label>
            <div className="grid grid-cols-4 gap-2">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setNewSeverity(sev)}
                  className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all
                    ${newSeverity === sev
                      ? severityColors[sev] + ' ring-1 ring-current'
                      : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                >
                  {sev}
                </button>
              ))}
            </div>
            {newSeverity !== observation.severity && (
              <p className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Severity change {observation.severity} → {newSeverity} will be logged
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Officer Comments</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              placeholder="Add verification notes, correction instructions, or rejection reason..."
              className="w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none transition-all"
            />
          </div>

          {/* Decision buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDecision('verify')}
              className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all
                ${decision === 'verify'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'}`}
            >
              ✓ Verify
            </button>
            <button
              onClick={() => setDecision('request')}
              className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all
                ${decision === 'request'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/30'}`}
            >
              ↩ Correct
            </button>
            <button
              onClick={() => setDecision('reject')}
              className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all
                ${decision === 'reject'
                  ? 'bg-red-500/20 border-red-500/40 text-red-300 ring-1 ring-red-500/40'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30'}`}
            >
              ✗ Reject
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!decision || submitting}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Decision'}
          </button>
        </div>
      </div>
    </div>
  )
}
