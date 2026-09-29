import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useRoleNav } from '../../hooks/useRoleNav.js'
import { useRBAC } from '../../context/RBACContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLE_COLORS, ROLE_LABELS } from '../../utils/permissions.js'
import Emblem from '../shared/Emblem.jsx'
import MoCoalLogo from '../shared/MoCoalLogo.jsx'

// ─── SVG Icons Map ─────────────────────────────────────────────────────────────
const NavIcon = ({ name, className = 'w-5 h-5' }) => {
  const icons = {
    dashboard: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    building: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
    mine: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    clipboard: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    eye: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ),
    alert: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    'check-circle': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    camera: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
    file: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
    briefcase: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    brain: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    ),
    map: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    list: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    ),
    bell: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    ),
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      {icons[name] || icons.dashboard}
    </svg>
  )
}

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const navItems = useRoleNav()
  const { user } = useRBAC()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  if (!user) return null

  const roleColor = ROLE_COLORS[user.role] || { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col
          bg-slate-950 border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Top Ministry of Coal Branding Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0 bg-slate-950">
          <div
            onClick={() => {
              navigate('/dashboard')
              setMobileOpen(false)
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none overflow-hidden"
          >
            {/* Official Ministry of Coal Logo */}
            <div className="shrink-0 group-hover:scale-105 transition-transform">
              <MoCoalLogo size="xs" variant="light" showText={false} />
            </div>

            {/* Title Text (Hidden when collapsed) */}
            {!collapsed && (
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-wider uppercase text-white group-hover:text-amber-300 transition-colors">
                    Coal<span className="text-amber-400">Gov</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    MoC
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-normal truncate">
                  Intelligence Platform
                </span>
              </div>
            )}
          </div>

          {/* Close on Mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Officer Active Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Clearance Jurisdiction
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${roleColor.bg} ${roleColor.text} ${roleColor.border} w-full truncate shadow-sm`}>
              <span className="truncate">
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
          </div>
        )}

        {/* ─── Left Side Navigation Items ─── */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-2 pb-1.5">
            {!collapsed && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Statutory Navigation
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                  ${collapsed ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent'
                  }
                `}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-400 shadow-sm shadow-amber-400" />
                )}

                <NavIcon
                  name={item.icon}
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}

                {/* Tooltip on collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Bottom Actions & Collapse Toggle */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 shrink-0 space-y-2">
          {/* User Profile Mini Bar */}
          <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 ${collapsed ? 'justify-center' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
              {user.avatar || user.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 flex-1 truncate">
                <span className="text-xs font-bold text-white truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user.employeeId || user.email}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-900 transition-colors text-xs font-bold ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
