import React from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge.jsx'
import DisabledAction from '../components/rbac/DisabledAction.jsx'
import { useRBAC } from '../context/RBACContext.jsx'
import { PERMISSIONS } from '../utils/permissions.js'
import MinistryHeroBanner from '../components/shared/MinistryHeroBanner.jsx'

export function Mines() {
  const { accessibleMines, can } = useRBAC()
  const canManage = can(PERMISSIONS.MANAGE_MINES)

  return (
    <div className="space-y-6">
      {/* Official Banner */}
      <MinistryHeroBanner
        title="National Colliery Surveillance & Registry"
        subtitle="Operational coal mines, real-time risk scores, DGMS compliance indices and telemetry status across India."
        badgeText={`${accessibleMines.length} Mines in Scope`}
        stats={[
          { label: 'Total In Scope', value: `${accessibleMines.length} Collieries` },
          { label: 'DGMS Avg Score', value: '74.2%' },
          { label: 'Real-Time Sync', value: 'Active' },
        ]}
        actionButton={
          canManage ? (
            <Link
              to="/admin/mines"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Manage Colliery Setup
            </Link>
          ) : null
        }
        backgroundImage="/assets/coal_dump_trucks.jpg"
      />

      {/* Grid of Mines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {accessibleMines.map((mine) => {
          const isHighRisk = mine.riskScore >= 75
          const isModRisk = mine.riskScore >= 50 && mine.riskScore < 75

          return (
            <div
              key={mine.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-amber-500/40 transition-all duration-200 shadow-lg group flex flex-col justify-between"
            >
              {/* Card Header with Industrial Badge */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                      {mine.type === 'Open Cast' ? '🚜' : '⛏️'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {mine.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {mine.mineId} · {mine.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    label={mine.status === 'active' ? 'Active Colliery' : 'Maintenance'}
                    variant={mine.status === 'active' ? 'active' : 'maintenance'}
                    dot
                  />
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <span>📍</span>
                  <span>{mine.district}, {mine.state}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {mine.lat}°N, {mine.lng}°E
                  </span>
                </p>
              </div>

              {/* Gauges & Indicators */}
              <div className="px-5 py-3 bg-slate-950/50 border-t border-b border-slate-800/60 space-y-3">
                {/* Risk Score */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">AI Risk Factor</span>
                    <span className={`font-mono font-bold ${isHighRisk ? 'text-red-400' : isModRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {mine.riskScore}/100 {isHighRisk ? '(Critical)' : isModRisk ? '(Elevated)' : '(Low)'}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHighRisk ? 'bg-red-500' : isModRisk ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${mine.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* DGMS Compliance */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">DGMS Compliance Index</span>
                    <span className={`font-mono font-bold ${mine.complianceRate >= 80 ? 'text-emerald-400' : mine.complianceRate >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
                      {mine.complianceRate}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        mine.complianceRate >= 80 ? 'bg-emerald-500' : mine.complianceRate >= 65 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${mine.complianceRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action link */}
              <div className="p-3 bg-slate-900 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Subsidiary: {mine.subsidiaryId?.toUpperCase() || 'CIL'}
                </span>
                <Link
                  to={`/mines/${mine.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-all border border-slate-700 hover:border-amber-400"
                >
                  View Dossier →
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MineDetails() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 mx-auto flex items-center justify-center text-xl">
          ⛏️
        </div>
        <h2 className="text-xl font-bold text-white">Detailed Mine Telemetry Dossier</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Connected to Ministry of Coal & DGMS central database. Real-time pit slope, ventilation sensors, and gas detection logs stream continuously.
        </p>
        <Link
          to="/mines"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all"
        >
          ← Return to Colliery Registry
        </Link>
      </div>
    </div>
  )
}
