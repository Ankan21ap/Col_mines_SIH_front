import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRoleNav } from '../../hooks/useRoleNav.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRBAC } from '../../context/RBACContext.jsx'
import { ROLE_COLORS, ROLE_LABELS } from '../../utils/permissions.js'
import Emblem from '../shared/Emblem.jsx'

// ─── Nav Icon Map ─────────────────────────────────────────────────────────────
const NavIcon = ({ name }) => {
  const paths = {
    dashboard:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    users:        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    shield:       'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    building:     'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    mine:         'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    clipboard:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    list:         'M4 6h16M4 10h16M4 14h16M4 18h16',
    bell:         'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    search:       'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    eye:          'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    alert:        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    'check-circle':'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    camera:       'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    file:         'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    briefcase:    'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    brain:        'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    map:          'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    chart:        'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  }
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name] || paths.dashboard} />
    </svg>
  )
}

const ROLE_OPTIONS = [
  { role: 'system_admin',                  label: 'System Admin',                            icon: '⚙️', desc: 'Full IT Governance, Master Data & Permissions' },
  { role: 'field_inspector',               label: 'Field Inspector',                         icon: '🔍', desc: 'DGMS Statutory Mine Safety Inspections' },
  { role: 'safety_officer',                label: 'Safety Officer',                          icon: '🛡️', desc: 'Hazard Mitigation, Air Quality & SLA Logs' },
  { role: 'mine_manager',                  label: 'Mine Manager',                            icon: '⛏️', desc: 'Opencast & UG Production & Equipment Telemetry' },
  { role: 'corporate_regulatory_officer',  label: 'Corporate & Regulatory Officer',          icon: '🏢', desc: 'CIL Executive Board & Ministry Reporting' },
]

export default function TopNav() {
  const navItems = useRoleNav()
  const { user, logout, switchRole } = useAuth()
  const { roleLabel } = useRBAC()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (!user) return null

  const roleColor = ROLE_COLORS[user.role] || { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' }

  const closeAll = () => {
    setShowRoleSwitcher(false)
    setShowUserMenu(false)
    setMobileOpen(false)
  }

  return (
    <>
      {/* ── Main Topbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-xl shadow-black/40">
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-16 gap-4">

          {/* Left: Ministry Branding & State Emblem */}
          <div
            className="flex items-center gap-3 shrink-0 cursor-pointer group select-none py-1"
            onClick={() => navigate('/dashboard')}
          >
            <Emblem size="sm" variant="gold" showText={false} />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wider uppercase text-white group-hover:text-amber-300 transition-colors">
                  MINISTRY OF <span className="text-amber-400">COAL</span>
                </span>
                <span className="text-slate-600 text-xs">|</span>
                <span className="font-semibold text-xs text-slate-300">
                  Govt. of India
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide">
                CoalGov Intelligence · Statutory Mine Governance Platform
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden xl:block h-7 w-px bg-slate-800 shrink-0" />

          {/* ── Center Nav Links (Desktop) ─────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none py-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* ── Right Controls ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => { setShowRoleSwitcher((s) => !s); setShowUserMenu(false) }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:brightness-110 shadow-sm ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}
                title="Click to switch officer role preview"
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span className="hidden sm:inline font-medium text-slate-400 text-[10px] uppercase">Clearance:</span>
                <span className="truncate max-w-[130px] sm:max-w-none">{roleLabel}</span>
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Role Switcher Dropdown Modal */}
              {showRoleSwitcher && (
                <div className="absolute top-full right-0 mt-2.5 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Switch Officer Role</p>
                      <p className="text-[10px] text-slate-400">Statutory RBAC Simulation</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      DEMO MODE
                    </span>
                  </div>
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => { switchRole(opt.role); closeAll() }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all
                        ${user.role === opt.role ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' : 'hover:bg-slate-800 text-slate-300'}`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white">{opt.label}</p>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                      </div>
                      {user.role === opt.role && (
                        <span className="text-amber-400 font-bold text-xs">Active ✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Statutory Alerts & Broadcasts"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-950" />
            </button>

            {/* Officer Profile Menu */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu((s) => !s); setShowRoleSwitcher(false) }}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
                  {user.avatar}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono leading-tight">{user.employeeId}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-500 hidden md:block" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2.5 w-60 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
                        {roleLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] text-slate-400">
                      <span>Department: </span>
                      <strong className="text-slate-200">{user.department || 'Statutory Operations'}</strong>
                    </div>
                    <button
                      onClick={() => { logout(); closeAll(); navigate('/login') }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav Drawer ──────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={closeAll}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`
                }
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Backdrop overlay for closing dropdowns */}
      {(showRoleSwitcher || showUserMenu) && (
        <div className="fixed inset-0 z-30" onClick={closeAll} />
      )}
    </>
  )
}
