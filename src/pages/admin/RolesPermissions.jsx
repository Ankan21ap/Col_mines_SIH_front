import React from 'react'
import PermissionMatrix from '../../components/ui/PermissionMatrix.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { ROLES, ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSION_PREVIEW } from '../../utils/permissions.js'

const ROLE_DESCRIPTIONS = {
  [ROLES.SYSTEM_ADMIN]: 'Full platform access. Manages users, roles, mines, subsidiaries, and all system configuration.',
  [ROLES.FIELD_INSPECTOR]: 'Field-level data collection. Conducts inspections, submits observations and violations. Mobile-optimized.',
  [ROLES.SAFETY_OFFICER]: 'Validates field data and manages compliance. Can verify observations, change severity, create corrective actions.',
  [ROLES.MINE_MANAGER]: 'Manages mine-level operations. Focuses on corrective actions, contractors, and compliance within their mine.',
  [ROLES.CORPORATE_REGULATORY_OFFICER]: 'Monitor, review, and oversee multi-mine compliance, issue management directives & statutory notices, approve & verify regulatory reports.',
}

export function RolesPermissions() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
        <p className="text-slate-400 text-sm mt-1">System-wide permission matrix and role definitions. Permissions are automatically applied based on role assignment.</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(ROLES).map(role => {
          const color = ROLE_COLORS[role]
          const preview = ROLE_PERMISSION_PREVIEW[role]
          return (
            <div key={role} className={`rounded-2xl border p-5 bg-gradient-to-br from-slate-900 to-slate-900 ${color.border}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color.bg} ${color.text} ${color.border}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  {ROLE_LABELS[role]}
                </span>
                <span className="text-xs text-slate-500">{preview?.allowed.length || 0} permissions</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{ROLE_DESCRIPTIONS[role]}</p>
              <div className="mt-3 space-y-1">
                {preview?.allowed.slice(0, 3).map(p => (
                  <div key={p} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {p}
                  </div>
                ))}
                {(preview?.allowed.length || 0) > 3 && (
                  <p className="text-xs text-slate-600">+{preview.allowed.length - 3} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Full matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">Full Permission Matrix</h2>
          <p className="text-xs text-slate-400 mt-1">Click a category row to expand its permissions. Use search to filter.</p>
        </div>
        <PermissionMatrix />
      </div>
    </div>
  )
}
