import React, { useState } from 'react'
import { ROLE_PERMISSIONS, PERMISSION_CATEGORIES, ROLE_LABELS, ROLES } from '../../utils/permissions.js'

const ALL_ROLES = Object.values(ROLES)

const ROLE_SHORT = {
  [ROLES.SYSTEM_ADMIN]: 'Admin',
  [ROLES.FIELD_INSPECTOR]: 'Inspector',
  [ROLES.SAFETY_OFFICER]: 'Safety',
  [ROLES.MINE_MANAGER]: 'Manager',
  [ROLES.CORPORATE_REGULATORY_OFFICER]: 'Corp & Reg',
}

const ROLE_COLORS_HEADER = {
  [ROLES.SYSTEM_ADMIN]: 'text-violet-400',
  [ROLES.FIELD_INSPECTOR]: 'text-amber-400',
  [ROLES.SAFETY_OFFICER]: 'text-blue-400',
  [ROLES.MINE_MANAGER]: 'text-emerald-400',
  [ROLES.CORPORATE_REGULATORY_OFFICER]: 'text-rose-400',
}

function CheckIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

function DashIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
        <span className="text-slate-600 text-sm font-bold leading-none">—</span>
      </div>
    </div>
  )
}

export default function PermissionMatrix() {
  const [search, setSearch] = useState('')
  const [expandedCat, setExpandedCat] = useState(null)

  const filtered = PERMISSION_CATEGORIES.map(cat => ({
    ...cat,
    permissions: cat.permissions.filter(p =>
      p.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.permissions.length > 0)

  const hasPermission = (role, permKey) =>
    (ROLE_PERMISSIONS[role] || []).includes(permKey)

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Filter permissions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 w-full text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all"
        />
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-56">Permission</th>
              {ALL_ROLES.map(role => (
                <th key={role} className={`px-3 py-4 text-center text-xs font-bold uppercase tracking-wider ${ROLE_COLORS_HEADER[role]}`}>
                  {ROLE_SHORT[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(cat => (
              <React.Fragment key={cat.label}>
                {/* Category header */}
                <tr
                  className="border-b border-slate-800 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpandedCat(expandedCat === cat.label ? null : cat.label)}
                >
                  <td colSpan={ALL_ROLES.length + 1} className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${expandedCat === cat.label || search ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{cat.label}</span>
                      <span className="text-xs text-slate-600">({cat.permissions.length})</span>
                    </div>
                  </td>
                </tr>

                {/* Permission rows */}
                {(expandedCat === cat.label || search) && cat.permissions.map(perm => (
                  <tr key={perm.key} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-300">{perm.label}</td>
                    {ALL_ROLES.map(role => (
                      <td key={role} className="px-3 py-3 text-center">
                        {hasPermission(role, perm.key) ? <CheckIcon /> : <DashIcon />}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2"><CheckIcon /> <span>Permission granted</span></div>
        <div className="flex items-center gap-2"><DashIcon /> <span>Not allowed</span></div>
      </div>
    </div>
  )
}
