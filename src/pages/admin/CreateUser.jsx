import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROLES, ROLE_LABELS, ROLE_PERMISSION_PREVIEW } from '../../utils/permissions.js'
import { MOCK_SUBSIDIARIES, DEMO_USERS } from '../../utils/mockData.js'

const FIELD_CLASSES = 'w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all'
const LABEL_CLASSES = 'block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'

const ROLE_OPTIONS = [
  { value: ROLES.SYSTEM_ADMIN, label: ROLE_LABELS[ROLES.SYSTEM_ADMIN] },
  { value: ROLES.FIELD_INSPECTOR, label: ROLE_LABELS[ROLES.FIELD_INSPECTOR] },
  { value: ROLES.SAFETY_OFFICER, label: ROLE_LABELS[ROLES.SAFETY_OFFICER] },
  { value: ROLES.MINE_MANAGER, label: ROLE_LABELS[ROLES.MINE_MANAGER] },
  { value: ROLES.CORPORATE_REGULATORY_OFFICER, label: ROLE_LABELS[ROLES.CORPORATE_REGULATORY_OFFICER] },
]

export function CreateUser() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    role: ROLES.FIELD_INSPECTOR,
    subsidiary: 'sub-a',
    status: 'active',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const preview = form.role ? ROLE_PERMISSION_PREVIEW[form.role] : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.employeeId) return

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setSubmitting(false)
    navigate('/admin/users')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Direct Add User</h1>
          <p className="text-slate-400 text-sm mt-1">Directly add a new user from System Admin panel.</p>
        </div>
        <Link
          to="/admin/users"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          ← Back to Users
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className={LABEL_CLASSES}>Full Name *</label>
              <input
                type="text"
                className={FIELD_CLASSES}
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="sm:col-span-2">
              <label className={LABEL_CLASSES}>Email Address *</label>
              <input
                type="email"
                className={FIELD_CLASSES}
                placeholder="e.g. rahul@coalcorp.in"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className={LABEL_CLASSES}>Phone Number *</label>
              <input
                type="tel"
                className={FIELD_CLASSES}
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className={LABEL_CLASSES}>Employee ID (EmpID) *</label>
              <input
                type="text"
                className={FIELD_CLASSES}
                placeholder="e.g. EMP-108"
                value={form.employeeId}
                onChange={e => set('employeeId', e.target.value)}
                required
              />
            </div>

            {/* Role Dropdown */}
            <div className="sm:col-span-2">
              <label className={LABEL_CLASSES}>Role (Dropdown Selection) *</label>
              <select
                value={form.role}
                onChange={e => set('role', e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subsidiary */}
            <div className="sm:col-span-2">
              <label className={LABEL_CLASSES}>Assigned Subsidiary</label>
              <select
                value={form.subsidiary}
                onChange={e => set('subsidiary', e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Corporate Headquarters / All Subsidiaries</option>
                {MOCK_SUBSIDIARIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code} - {s.state})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Automatic RBAC Permission Preview */}
          {preview && (
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Role Assigned: <strong className="text-amber-400">{ROLE_LABELS[form.role]}</strong>
                </span>
                <span className="text-emerald-400">✓ {preview.allowed.length} Permissions Enforced</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                {preview.allowed.slice(0, 4).map(p => (
                  <div key={p} className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-emerald-400">✓</span> {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link
              to="/admin/users"
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? 'Adding User...' : 'Direct Add User →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
