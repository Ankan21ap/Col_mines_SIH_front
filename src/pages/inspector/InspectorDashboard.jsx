import React, { useState } from 'react'
import StatCard from '../../components/shared/StatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useRBAC } from '../../context/RBACContext.jsx'
import { MOCK_MINES } from '../../utils/mockData.js'

const MY_INSPECTIONS = [
  { id: 'INS-001', mine: 'Jharia Block A', date: '2026-08-27', status: 'in_progress', items: 12, checked: 8 },
  { id: 'INS-002', mine: 'Bokaro North', date: '2026-08-24', status: 'submitted', items: 10, checked: 10 },
]

const MY_OBSERVATIONS = [
  { id: 'OBS-101', desc: 'Fire extinguisher expired at Level 3', severity: 'HIGH', status: 'pending', time: '10:42 AM' },
  { id: 'OBS-102', desc: 'Ventilation duct partially blocked', severity: 'MEDIUM', status: 'verified', time: 'Yesterday' },
]

export default function InspectorDashboard() {
  const { user, accessibleMines } = useRBAC()

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/3 border border-amber-500/20 p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl font-bold text-amber-300 shrink-0">
          {user?.avatar}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Good day, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-400 mt-0.5">You have {accessibleMines.length} mines assigned. {MY_INSPECTIONS.filter(i => i.status === 'in_progress').length} inspection in progress.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Assigned Mines" value={accessibleMines.length} color="amber"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Active Inspections" value="1" color="blue"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
        />
        <StatCard label="Pending Observations" value="1" color="red"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        />
        <StatCard label="This Month" value="6" sub="Inspections completed" color="emerald"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Mines */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">My Assigned Mines</h2>
          <div className="space-y-2">
            {accessibleMines.map(mine => (
              <div key={mine.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/40 hover:border-slate-600 transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-white">{mine.name}</p>
                  <p className="text-xs text-slate-500">{mine.mineId} · {mine.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${mine.riskScore >= 75 ? 'text-red-400' : mine.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Risk {mine.riskScore}
                  </span>
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-semibold hover:bg-amber-500/10 transition-colors">
            Start New Inspection +
          </button>
        </div>

        {/* Recent observations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">My Observations</h2>
          <div className="space-y-3">
            {MY_OBSERVATIONS.map(obs => {
              const sevColor = obs.severity === 'HIGH' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              return (
                <div key={obs.id} className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{obs.id}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sevColor}`}>{obs.severity}</span>
                      <Badge label={obs.status === 'pending' ? 'Pending' : 'Verified'} variant={obs.status === 'pending' ? 'pending' : 'verified'} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-200">{obs.desc}</p>
                  <p className="text-xs text-slate-500">{obs.time}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
