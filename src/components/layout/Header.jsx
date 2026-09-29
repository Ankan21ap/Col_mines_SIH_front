import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRBAC } from '../../context/RBACContext.jsx'
import { ROLE_COLORS, ROLE_LABELS, ROLES } from '../../utils/permissions.js'

const ROLE_OPTIONS = [
  { role: ROLES.SYSTEM_ADMIN, label: 'System Admin', icon: '⚙️' },
  { role: ROLES.FIELD_INSPECTOR, label: 'Field Inspector', icon: '🔍' },
  { role: ROLES.SAFETY_OFFICER, label: 'Safety Officer', icon: '🛡️' },
  { role: ROLES.MINE_MANAGER, label: 'Mine Manager', icon: '⛏️' },
  { role: ROLES.CORPORATE_REGULATORY_OFFICER, label: 'Corporate & Regulatory', icon: '🏢' },
]

export default function Header({ onOpenMobileSidebar = () => {} }) {
  const { user, logout, switchRole } = useAuth()
  const { roleLabel } = useRBAC()
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null
  const roleColor = ROLE_COLORS[user.role] || { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' }

  // Derive human-readable title from pathname
  const getPageTitle = (path) => {
    if (path.startsWith('/admin/users')) return 'User Management & Clearances'
    if (path.startsWith('/admin/roles')) return 'Roles & Statutory Permissions'
    if (path.startsWith('/admin/subsidiaries')) return 'Subsidiaries Directorate'
    if (path.startsWith('/admin/mines') || path === '/mines') return 'National Coal Mines Directory'
    if (path.startsWith('/inspections')) return 'DGMS Statutory Field Inspections'
    if (path.startsWith('/violations')) return 'Violations & Statutory Non-Compliance'
    if (path.startsWith('/actions')) return 'Corrective Actions (CAPA) Log'
    if (path.startsWith('/gis')) return 'Geospatial GIS Surveillance Grid'
    if (path.startsWith('/risk')) return 'Predictive AI Colliery Risk Engine'
    if (path.startsWith('/audit-logs')) return 'Immutable Audit & Access Logs'
    if (path.startsWith('/notifications')) return 'Statutory Alerts & Urgent Notices'
    return 'National Coal Intelligence Dashboard'
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
      {/* Left: Mobile Hamburger & Page Context */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Current Active Section Name */}
        <div className="hidden sm:flex flex-col">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400/90">
            Ministry of Coal • Portal Section
          </span>
          <h2 className="text-sm sm:text-base font-black text-white leading-tight">
            {getPageTitle(location.pathname)}
          </h2>
        </div>
      </div>

      {/* Right: Role Switcher Pill + Notifications + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSwitcher((s) => !s)
              setShowUserMenu(false)
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:brightness-110 shadow-sm ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="hidden sm:inline">Role:</span>
            <span>{roleLabel}</span>
            <svg className="w-3.5 h-3.5 opacity-75" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showRoleSwitcher && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in">
              <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/80">
                <p className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                  Switch Authority Role (Demo)
                </p>
              </div>
              <div className="p-1">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      switchRole(opt.role)
                      setShowRoleSwitcher(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors hover:bg-slate-800 text-left ${
                      user.role === opt.role ? 'text-amber-400 bg-amber-500/10 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                    {user.role === opt.role && (
                      <span className="ml-auto text-amber-400 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell Button */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          title="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
        </button>

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu((s) => !s)
              setShowRoleSwitcher(false)
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border shadow-sm ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}
            >
              {user.avatar || user.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden md:block pr-1">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {user.employeeId || 'DGMS Officer'}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/80">
                <p className="text-xs font-black text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/dashboard')
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Dashboard Overview
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/landing')
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  View Public Landing Page
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                >
                  Sign Out of Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
