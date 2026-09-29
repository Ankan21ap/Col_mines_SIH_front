import React, { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useRBAC } from '../context/RBACContext.jsx'
import { ROLES, ROLE_COLORS } from '../utils/permissions.js'
import AdminDashboard     from './admin/AdminDashboard.jsx'
import InspectorDashboard from './inspector/InspectorDashboard.jsx'
import SafetyDashboard    from './safety/SafetyDashboard.jsx'
import ManagerDashboard   from './manager/ManagerDashboard.jsx'
import CorporateDashboard from './corporate/CorporateDashboard.jsx'

// Lazy-load the map to avoid SSR issues
const MineMap = lazy(() => import('../components/map/MineMap.jsx'))

const GIS_ROLES = [ROLES.SAFETY_OFFICER, ROLES.MINE_MANAGER, ROLES.CORPORATE_REGULATORY_OFFICER, ROLES.SYSTEM_ADMIN]

export function Dashboard() {
  const { user, roleLabel, accessibleMines, can } = useRBAC()

  if (!user) return null

  const activeRoleColor = ROLE_COLORS[user.role] || { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' }
  const showMap = GIS_ROLES.includes(user.role) || (user.assignedMines?.length > 0)

  const renderRoleDashboard = () => {
    switch (user.role) {
      case ROLES.SYSTEM_ADMIN:                 return <AdminDashboard />
      case ROLES.FIELD_INSPECTOR:              return <InspectorDashboard />
      case ROLES.SAFETY_OFFICER:               return <SafetyDashboard />
      case ROLES.MINE_MANAGER:                 return <ManagerDashboard />
      case ROLES.CORPORATE_REGULATORY_OFFICER: return <CorporateDashboard />
      default: return (
        <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400">Unknown role. Contact system administrator.</p>
        </div>
      )
    }
  }

  const mines = accessibleMines || []

  return (
    <div className="space-y-6">
      {/* ── 1. NATIONAL COAL INTELLIGENCE HERO BANNER ─────────────────────── */}
      <div className="relative rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl shadow-black/50 bg-slate-900">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url('/assets/coal_mine_hero.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60 backdrop-blur-[1.5px]" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-6 right-8 w-80 h-80 bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              National Mine Governance, Safety & Compliance Intelligence Platform
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">Logged in as:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeRoleColor.bg} ${activeRoleColor.text} ${activeRoleColor.border}`}>
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Empowering Sustainable Mining &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                National Coal Intelligence
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl">
              Official unified platform for real-time safety surveillance, RBAC-driven statutory compliance, and DGMS risk monitoring across all Coal India subsidiaries and mining blocks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            {[
              { label: 'Coal Monitored', value: '754+ MT', icon: '⛏️', tag: 'Annual' },
              { label: 'DGMS Safety Score', value: '94.8%', icon: '🛡️', tag: 'Compliant' },
              { label: 'Active Mines', value: mines.length || '318', icon: '🏔️', tag: 'In Scope' },
              { label: 'Telemetry Stream', value: '24×7', icon: '📡', tag: 'Live IoT' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 hover:border-amber-500/50 p-4 transition-all duration-200 group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">{stat.tag}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono group-hover:text-amber-300 transition-colors">{stat.value}</p>
                <p className="text-xs text-slate-300 mt-1 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. INTERACTIVE MINE MAP ────────────────────────────────────────── */}
      {showMap && mines.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Mine Location Intelligence</h2>
                <p className="text-[10px] text-slate-500">{mines.length} collieries in scope · Color-coded by AI risk score</p>
              </div>
            </div>
            <Link to="/gis" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
              Full GIS View →
            </Link>
          </div>
          <Suspense fallback={
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            </div>
          }>
            <MineMap mines={mines} height="340px" compact={true} />
          </Suspense>
        </div>
      )}

      {/* ── 3. ACTIVE ROLE-SPECIFIC DASHBOARD VIEW ─────────────────────────── */}
      <div className="transition-all duration-300">
        {renderRoleDashboard()}
      </div>
    </div>
  )
}
