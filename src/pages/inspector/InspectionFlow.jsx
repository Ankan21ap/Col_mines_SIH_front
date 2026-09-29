import React, { useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import DisabledAction from '../../components/rbac/DisabledAction.jsx'
import { useRBAC } from '../../context/RBACContext.jsx'
import { PERMISSIONS } from '../../utils/permissions.js'

const CHECKLIST = [
  { id: 'c1', requirement: 'Fire extinguishers inspected and valid', frequency: 'Monthly', category: 'Fire Safety' },
  { id: 'c2', requirement: 'Emergency exit signs illuminated and unobstructed', frequency: 'Weekly', category: 'Emergency' },
  { id: 'c3', requirement: 'Ventilation system operational – all ducts clear', frequency: 'Daily', category: 'Ventilation' },
  { id: 'c4', requirement: 'Personal protective equipment available at all workstations', frequency: 'Daily', category: 'PPE' },
  { id: 'c5', requirement: 'Gas detection devices calibrated and functional', frequency: 'Monthly', category: 'Gas Safety' },
  { id: 'c6', requirement: 'Emergency communication systems tested', frequency: 'Weekly', category: 'Emergency' },
]

const STATUS_OPTIONS = [
  { key: 'compliant', label: '✓ Compliant', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { key: 'observation', label: '⚠ Observation', bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400' },
  { key: 'violation', label: '✕ Violation', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400' },
  { key: 'na', label: 'N/A', bg: 'bg-slate-700/30', border: 'border-slate-600/30', text: 'text-slate-400' },
]

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export function InspectionFlow() {
  const { can } = useRBAC()
  const [results, setResults] = useState({})
  const [details, setDetails] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const canUpload = can(PERMISSIONS.UPLOAD_EVIDENCE)
  const canGPS = can(PERMISSIONS.CAPTURE_GPS)

  const setStatus = (id, status) => setResults(r => ({ ...r, [id]: status }))
  const setDetail = (id, key, val) => setDetails(d => ({ ...d, [id]: { ...(d[id] || {}), [key]: val } }))

  const handleSubmit = () => setSubmitted(true)

  const completed = Object.keys(results).length
  const progress = Math.round((completed / CHECKLIST.length) * 100)

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold text-white">Inspection Submitted</h2>
        <p className="text-slate-400 text-sm">Your inspection has been recorded and sent for review.</p>
        <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950">New Inspection</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Compliance Inspection</h1>
          <p className="text-xs text-slate-400 mt-0.5">Jharia Block A · 27 Aug 2026 · 10:42 AM</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{completed}/{CHECKLIST.length} items</p>
          <div className="mt-1 w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {CHECKLIST.map(item => {
          const status = results[item.id]
          const detail = details[item.id] || {}
          const isViolation = status === 'violation'
          const isObservation = status === 'observation'

          return (
            <div key={item.id} className={`rounded-2xl border transition-all ${
              status ? 'border-slate-700 bg-slate-900' : 'border-slate-800 bg-slate-900/60'}`}>
              {/* Header */}
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{item.category}</p>
                    <p className="text-sm font-medium text-white mt-0.5">{item.requirement}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Frequency: {item.frequency}</p>
                  </div>
                  {status && <Badge label={status} variant={status === 'compliant' ? 'compliant' : status === 'violation' ? 'violation' : status === 'observation' ? 'observation' : 'default'} />}
                </div>

                {/* Status selector */}
                <div className="grid grid-cols-4 gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setStatus(item.id, opt.key)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all
                        ${status === opt.key ? `${opt.bg} ${opt.border} ${opt.text}` : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Violation / Observation detail form */}
              {(isViolation || isObservation) && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800 space-y-4">
                  {isViolation && (
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Severity</label>
                      <div className="flex gap-2">
                        {SEVERITY_OPTIONS.map(sev => (
                          <button key={sev} onClick={() => setDetail(item.id, 'severity', sev)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all
                              ${detail.severity === sev
                                ? sev === 'CRITICAL' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                                  sev === 'HIGH' ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' :
                                  sev === 'MEDIUM' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                          >{sev}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Description</label>
                    <textarea
                      rows={2}
                      value={detail.desc || ''}
                      onChange={e => setDetail(item.id, 'desc', e.target.value)}
                      placeholder="Describe the issue in detail..."
                      className="w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    {/* Photo evidence */}
                    {canUpload ? (
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:border-amber-500/40 hover:text-amber-400 transition-colors flex-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Upload Photo
                      </button>
                    ) : (
                      <DisabledAction mode="banner" reason="You don't have permission to upload evidence." />
                    )}

                    {/* GPS */}
                    {canGPS ? (
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:border-emerald-500/40 hover:text-emerald-400 transition-colors flex-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Capture GPS
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={completed < CHECKLIST.length}
        className="w-full py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {completed < CHECKLIST.length ? `Complete all items to submit (${CHECKLIST.length - completed} remaining)` : 'Submit Inspection →'}
      </button>
    </div>
  )
}
