import React, { useState, useEffect } from 'react'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import PermissionGate from '../components/rbac/PermissionGate.jsx'
import DisabledAction from '../components/rbac/DisabledAction.jsx'
import { PERMISSIONS } from '../utils/permissions.js'
import { useRBAC } from '../context/RBACContext.jsx'
import { violationApi } from '../api/violationApi.js'

const MOCK_VIOLATIONS = [
  { _id: 'V-021', mine: { name: 'Jharia Block A' }, title: 'Fire extinguisher expired – Level 3', severity: 'high', status: 'open', reportedBy: { name: 'Rahul Sharma' }, createdAt: '2026-08-27', recurring: false },
  { _id: 'V-020', mine: { name: 'Bokaro North' },   title: 'Ventilation blockage shaft B', severity: 'medium', status: 'in_progress', reportedBy: { name: 'Rahul Sharma' }, createdAt: '2026-08-26', recurring: false },
  { _id: 'V-019', mine: { name: 'Dhanbad East' },   title: 'PPE missing at workstation 7', severity: 'critical', status: 'open', reportedBy: { name: 'Priya Nair' }, createdAt: '2026-08-22', recurring: true },
  { _id: 'V-018', mine: { name: 'Jharia Block A' }, title: 'Emergency lighting failure adit 3', severity: 'high', status: 'resolved', reportedBy: { name: 'Rahul Sharma' }, createdAt: '2026-08-18', recurring: false },
]

const SEV_VARIANT  = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' }
const STAT_VARIANT = { open: 'open', in_progress: 'pending', under_review: 'observation', resolved: 'resolved', closed: 'verified' }

export function Violations() {
  const { can } = useRBAC()
  const [rows, setRows]       = useState(MOCK_VIOLATIONS)
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter]     = useState('')

  const canCreate        = can(PERMISSIONS.CREATE_VIOLATION)
  const canChangeSeverity = can(PERMISSIONS.CHANGE_VIOLATION_SEVERITY)

  useEffect(() => {
    violationApi.getAll()
      .then(({ data }) => { if (data.data?.length) setRows(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = rows
    .filter(r => !severityFilter || r.severity === severityFilter)
    .filter(r => !statusFilter   || r.status   === statusFilter)

  const columns = [
    { key: '_id', label: 'ID', sortable: true, render: v => <span className="font-mono text-xs text-red-400">{v}</span> },
    { key: 'mine', label: 'Mine', sortable: true, render: v => v?.name || v || '—' },
    { key: 'title', label: 'Violation', render: v => <span className="text-sm text-slate-200 max-w-xs block truncate" title={v}>{v}</span> },
    { key: 'severity', label: 'Severity', sortable: true, render: v => <Badge label={v?.toUpperCase()} variant={SEV_VARIANT[v] || 'default'} /> },
    { key: 'status', label: 'Status', sortable: true, render: v => <Badge label={v?.replace('_', ' ')} variant={STAT_VARIANT[v] || 'default'} /> },
    { key: 'recurring', label: '', render: v => v ? <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-300">RECURRING</span> : null },
    { key: 'reportedBy', label: 'Reporter', render: v => v?.name || v || '—' },
    { key: 'createdAt', label: 'Date', sortable: true, render: v => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="text-xs text-slate-400 hover:text-white transition-colors">View</button>
          {canChangeSeverity ? (
            <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Change Severity</button>
          ) : (
            <DisabledAction mode="tooltip" reason="You don't have permission to change violation severity.">
              <button className="text-xs text-slate-600 cursor-not-allowed">Change Severity</button>
            </DisabledAction>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Violations</h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} violations · {rows.filter(r => r.status === 'open').length} open</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Severity filter */}
          {['', 'critical', 'high', 'medium', 'low'].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                severityFilter === s ? 'bg-red-500/15 border-red-500/40 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {s ? s : 'All Severities'}
            </button>
          ))}
          {canCreate && (
            <button className="ml-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold hover:bg-red-500/20 transition-all">
              + Report Violation
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="No violations found." />
      </div>
    </div>
  )
}

export function ViolationDetails() {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-900 border border-slate-800">
      <p className="text-slate-500">Select a violation to view details.</p>
    </div>
  )
}
