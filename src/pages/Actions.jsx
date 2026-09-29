import React, { useState, useEffect } from 'react'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import PermissionGate from '../components/rbac/PermissionGate.jsx'
import { PERMISSIONS } from '../utils/permissions.js'
import { useRBAC } from '../context/RBACContext.jsx'
import { actionApi } from '../api/actionApi.js'

const MOCK_ACTIONS = [
  { _id: 'CA-001', mine: { name: 'Jharia Block A' }, title: 'Replace all fire extinguishers – Level 3', priority: 'critical', status: 'in_progress', assignedTo: { name: 'Rahul Sharma' }, deadline: '2026-09-05' },
  { _id: 'CA-002', mine: { name: 'Bokaro North'   }, title: 'Clear ventilation blockage shaft B', priority: 'high', status: 'pending', assignedTo: { name: 'Rahul Sharma' }, deadline: '2026-08-30' },
  { _id: 'CA-003', mine: { name: 'Dhanbad East'   }, title: 'Issue PPE to all workstation 7 staff', priority: 'critical', status: 'completed', assignedTo: { name: 'Priya Nair' }, deadline: '2026-08-25' },
  { _id: 'CA-004', mine: { name: 'Talcher Central' }, title: 'Overhaul emergency lighting adit 3', priority: 'medium', status: 'verified', assignedTo: { name: 'Suresh Kumar' }, deadline: '2026-09-15' },
]

const PRIO_VARIANT = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' }
const STAT_VARIANT = { pending: 'pending', in_progress: 'observation', completed: 'resolved', verified: 'verified', overdue: 'critical', rejected: 'critical' }

export function Actions() {
  const { can } = useRBAC()
  const [rows, setRows]       = useState(MOCK_ACTIONS)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')

  const canApprove = can(PERMISSIONS.APPROVE_CORRECTIVE_ACTION)
  const canCreate  = can(PERMISSIONS.CREATE_CORRECTIVE_ACTION)

  useEffect(() => {
    actionApi.getAll()
      .then(({ data }) => { if (data.data?.length) setRows(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const enriched = rows.map(r => ({
    ...r,
    isOverdue: !['completed', 'verified'].includes(r.status) && r.deadline && new Date(r.deadline) < now,
  }))

  const filtered = filter ? enriched.filter(r => r.status === filter || (filter === 'overdue' && r.isOverdue)) : enriched

  const columns = [
    { key: '_id', label: 'ID', sortable: true, render: v => <span className="font-mono text-xs text-amber-400">{v}</span> },
    { key: 'mine', label: 'Mine', render: v => v?.name || v || '—' },
    { key: 'title', label: 'Action', render: v => <span className="text-sm text-slate-200 max-w-xs block truncate" title={v}>{v}</span> },
    { key: 'priority', label: 'Priority', sortable: true, render: v => <Badge label={v?.toUpperCase()} variant={PRIO_VARIANT[v] || 'default'} /> },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <Badge label={v?.replace('_', ' ')} variant={STAT_VARIANT[v] || 'default'} />
          {row.isOverdue && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300">OVERDUE</span>}
        </div>
      )
    },
    { key: 'assignedTo', label: 'Assigned To', render: v => v?.name || v || '—' },
    { key: 'deadline', label: 'Deadline', sortable: true, render: v => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="text-xs text-slate-400 hover:text-white transition-colors">View</button>
          {canApprove && row.status === 'completed' && (
            <button
              onClick={() => actionApi.approve(row._id, { approved: true }).then(() => setRows(prev => prev.map(r => r._id === row._id ? { ...r, status: 'verified' } : r)))}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              ✓ Approve
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Corrective Actions</h1>
          <p className="text-slate-400 text-sm mt-0.5">{enriched.filter(r => r.isOverdue).length} overdue · {enriched.filter(r => r.status === 'pending').length} pending</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['', 'pending', 'in_progress', 'completed', 'verified', 'overdue'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === s ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {s ? s.replace('_', ' ') : 'All'}
            </button>
          ))}
          {canCreate && (
            <button className="ml-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all">
              + Create Action
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="No corrective actions found." />
      </div>
    </div>
  )
}

export function ActionDetails() {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-900 border border-slate-800">
      <p className="text-slate-500">Select an action to view details.</p>
    </div>
  )
}
