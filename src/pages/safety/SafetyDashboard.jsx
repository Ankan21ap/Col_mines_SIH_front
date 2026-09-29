import React, { useState } from 'react'
import StatCard from '../../components/shared/StatCard.jsx'
import VerificationPanel from '../../components/shared/VerificationPanel.jsx'
import Badge from '../../components/ui/Badge.jsx'

const QUEUE = [
  {
    id: '102', severity: 'HIGH', submittedAt: '2026-08-27 · 10:42 AM',
    description: 'Fire extinguisher at Level 3 found expired. Tag date: June 2026. No replacement available on floor.',
    evidenceCount: 3, gps: true, timestamp: '10:42 AM',
    mineName: 'Jharia Block A',
    inspector: { name: 'Rahul Sharma', avatar: 'RS', employeeId: 'EMP-042' },
    auditTrail: [
      { actor: 'Rahul Sharma', action: 'submitted observation', time: '10:42 AM' },
      { actor: 'System', action: 'escalated to safety officer queue', time: '10:43 AM' },
    ],
  },
  {
    id: '103', severity: 'MEDIUM', submittedAt: '2026-08-26 · 03:15 PM',
    description: 'Ventilation duct partially blocked by debris near shaft B. Approx 40% blockage observed.',
    evidenceCount: 2, gps: true, timestamp: '03:15 PM',
    mineName: 'Bokaro North',
    inspector: { name: 'Rahul Sharma', avatar: 'RS', employeeId: 'EMP-042' },
    auditTrail: [
      { actor: 'Rahul Sharma', action: 'submitted observation', time: 'Yesterday 3:15 PM' },
    ],
  },
]

export default function SafetyDashboard() {
  const [selected, setSelected] = useState(null)
  const [queue, setQueue] = useState(QUEUE)

  const handleVerify = async ({ comment, severity }) => {
    setQueue(q => q.filter(o => o.id !== selected.id))
    setSelected(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Safety & Compliance Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Review field observations, manage compliance, and verify evidence.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Review" value={queue.length} color="amber"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        />
        <StatCard label="Open Violations" value="8" color="red"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <StatCard label="Corrective Actions" value="5" sub="2 overdue" color="violet"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Avg Compliance" value="74%" color="emerald" trend={2}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="xl:col-span-1 rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Verification Queue</h2>
            <Badge label={`${queue.length} pending`} variant="pending" />
          </div>
          <div className="space-y-3">
            {queue.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-sm">All observations reviewed ✓</div>
            )}
            {queue.map(obs => {
              const sevColor = obs.severity === 'HIGH' ? 'text-orange-400' : obs.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'
              return (
                <button
                  key={obs.id}
                  onClick={() => setSelected(obs)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all
                    ${selected?.id === obs.id
                      ? 'border-amber-500/40 bg-amber-500/8'
                      : 'border-slate-700/60 hover:border-slate-600 bg-slate-800/40'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400">Obs #{obs.id}</span>
                    <span className={`text-xs font-bold ${sevColor}`}>{obs.severity}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{obs.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">{obs.inspector.name}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{obs.mineName}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="xl:col-span-2">
          {selected ? (
            <VerificationPanel
              observation={selected}
              onVerify={handleVerify}
              onRequestCorrection={handleVerify}
              onReject={handleVerify}
            />
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center h-64">
              <div className="text-center text-slate-500 space-y-2">
                <svg className="w-10 h-10 mx-auto opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <p className="text-sm">Select an observation to review</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
