import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import PermissionGate from '../components/rbac/PermissionGate.jsx'
import { PERMISSIONS } from '../utils/permissions.js'
import { useRBAC } from '../context/RBACContext.jsx'
import { inspectionApi } from '../api/inspectionApi.js'

const MOCK_INSPECTIONS = [
  { _id: 'INS-001', mine: { name: 'Jharia Block A' }, inspector: { name: 'Rahul Sharma' }, conductedDate: '2026-08-27', status: 'draft',    checklist: Array(12).fill({}), summary: null },
  { _id: 'INS-002', mine: { name: 'Bokaro North'   }, inspector: { name: 'Rahul Sharma' }, conductedDate: '2026-08-24', status: 'submitted', checklist: Array(10).fill({}), summary: '80% compliance' },
  { _id: 'INS-003', mine: { name: 'Talcher Central' }, inspector: { name: 'Priya Nair'   }, conductedDate: '2026-08-22', status: 'verified',  checklist: Array(14).fill({}), summary: '86% compliance' },
  { _id: 'INS-004', mine: { name: 'Dhanbad East'   }, inspector: { name: 'Rahul Sharma' }, conductedDate: '2026-08-20', status: 'rejected',  checklist: Array(12).fill({}), summary: '58% compliance' },
]

const STATUS_VARIANT = { draft: 'pending', submitted: 'observation', under_review: 'observation', verified: 'verified', rejected: 'critical' }

export function Inspections() {
  const { can } = useRBAC()
  const [rows, setRows]       = useState(MOCK_INSPECTIONS)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')

  useEffect(() => {
    inspectionApi.getAll()
      .then(({ data }) => {
        if (data.data?.length) setRows(data.data)
      })
      .catch(() => { /* keep mock data */ })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter
    ? rows.filter(r => r.status === filter)
    : rows

  const columns = [
    { key: '_id', label: 'ID', sortable: true, render: v => <span className="font-mono text-xs text-amber-400">{v}</span> },
    { key: 'mine', label: 'Mine', sortable: true, render: v => v?.name || v || '—' },
    { key: 'inspector', label: 'Inspector', render: v => v?.name || v || '—' },
    { key: 'conductedDate', label: 'Date', sortable: true, render: v => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
    { key: 'type', label: 'Type', render: v => <span className="text-xs text-slate-400 capitalize">{v || 'routine'}</span> },
    { key: 'status', label: 'Status', sortable: true, render: v => <Badge label={v?.replace('_', ' ')} variant={STATUS_VARIANT[v] || 'default'} /> },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link to={`/inspections/${row._id}`} className="text-xs text-slate-400 hover:text-white transition-colors">View</Link>
          {can(PERMISSIONS.VERIFY_OBSERVATION) && row.status === 'submitted' && (
            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Verify</button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Inspections</h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} inspections · {rows.filter(r => r.status === 'submitted').length} pending review</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter pills */}
          {['', 'draft', 'submitted', 'verified', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === s ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {s ? s.replace('_', ' ') : 'All'}
            </button>
          ))}
          <PermissionGate permission={PERMISSIONS.CREATE_INSPECTION} silent>
            <Link to="/inspections/new" className="ml-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all">
              + New Inspection
            </Link>
          </PermissionGate>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="No inspections found." />
      </div>
    </div>
  )
}

export function InspectionDetails() {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="text-center">
        <p className="text-white font-semibold">Inspection Detail View</p>
        <p className="text-slate-500 text-sm mt-1">Select an inspection from the list to view full details.</p>
      </div>
    </div>
  )
}
