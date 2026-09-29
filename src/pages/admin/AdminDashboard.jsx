import React from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/shared/StatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'

const RECENT_ACTIVITY = [
  { id: 1, action: 'New user created', user: 'Priya Nair (Safety Officer)', time: '2 min ago', type: 'user' },
  { id: 2, action: 'Mine B1 compliance updated', user: 'Suresh Kumar (Manager)', time: '18 min ago', type: 'mine' },
  { id: 3, action: 'Role permissions updated', user: 'Arjun Verma (Admin)', time: '1h ago', type: 'role' },
  { id: 4, action: 'New violation reported', user: 'Rahul Sharma (Inspector)', time: '2h ago', type: 'alert' },
  { id: 5, action: 'Subsidiary C added', user: 'Arjun Verma (Admin)', time: '3h ago', type: 'org' },
]

const CRITICAL_ALERTS = [
  { id: 1, text: 'Jharia Block A risk score CRITICAL (88/100)', severity: 'critical' },
  { id: 2, text: 'Surguja Deep — maintenance mode, 3 overdue actions', severity: 'high' },
  { id: 3, text: '2 users with no login in 30 days', severity: 'medium' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">System Governance & IT Administration</h2>
            <Badge label="Super User Mode" variant="critical" />
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Manage user accounts, RBAC permissions, CIL subsidiaries, and statutory compliance templates.
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Provision Officer Access
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value="6"
          sub="4 active today"
          color="violet"
          trend={2}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Roles"
          value="5"
          sub="Permission matrices verified"
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          label="Subsidiaries"
          value="3"
          sub="All active (CIL / ECS / NCS)"
          color="emerald"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          label="Monitored Mines"
          value="7"
          sub="1 in maintenance"
          color="amber"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Second stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Pending Configuration"
          value="2"
          sub="Mines need compliance templates"
          color="red"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Avg Compliance"
          value="73%"
          sub="Across all mines"
          color="blue"
          trend={-3}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          label="Open Violations"
          value="12"
          sub="3 critical, 4 high"
          color="red"
          trend={5}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Critical DGMS Alerts & Thresholds</h2>
            <Badge label="3 alerts" variant="critical" />
          </div>
          <div className="space-y-3">
            {CRITICAL_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/8 border-red-500/20'
                    : alert.severity === 'high'
                    ? 'bg-orange-500/8 border-orange-500/20'
                    : 'bg-amber-500/8 border-amber-500/20'
                }`}
              >
                <svg
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    alert.severity === 'critical'
                      ? 'text-red-400'
                      : alert.severity === 'high'
                      ? 'text-orange-400'
                      : 'text-amber-400'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-slate-300 flex-1">{alert.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick management shortcuts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Administrative Actions</h2>
            <Badge label="Master Control" variant="default" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Officers', path: '/admin/users', icon: '👥', desc: 'RBAC user accounts' },
              { label: 'Role Permissions', path: '/admin/roles', icon: '🛡️', desc: 'Permission matrix' },
              { label: 'Subsidiaries', path: '/admin/subsidiaries', icon: '🏢', desc: 'CIL operational zones' },
              { label: 'Mine Config', path: '/admin/mines', icon: '⛏️', desc: 'Active colliery setups' },
            ].map((shortcut) => (
              <Link
                key={shortcut.path}
                to={shortcut.path}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all text-left group"
              >
                <span className="text-xl">{shortcut.icon}</span>
                <p className="text-xs font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                  {shortcut.label}
                </p>
                <p className="text-[10px] text-slate-400">{shortcut.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
