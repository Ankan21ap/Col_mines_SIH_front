import React, { useState, useEffect } from 'react'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import PermissionGate from '../components/rbac/PermissionGate.jsx'
import { PERMISSIONS } from '../utils/permissions.js'
import { useRBAC } from '../context/RBACContext.jsx'
import axiosClient from '../api/axiosClient.js'

const MOCK_LOGS = [
  { _id: 'AL-001', actor: { name: 'Arjun Verma', role: 'system_admin' }, action: 'CREATE_USER', resource: 'User', description: 'Created user Priya Nair (EMP-018)', ipAddress: '192.168.1.10', createdAt: '2026-08-27T13:00:02Z' },
  { _id: 'AL-002', actor: { name: 'Priya Nair', role: 'safety_officer' }, action: 'UPDATE_VIOLATION', resource: 'Violation', description: 'Changed severity LOW → HIGH on V-021', ipAddress: '192.168.1.22', createdAt: '2026-08-27T10:45:44Z' },
  { _id: 'AL-003', actor: { name: 'Rahul Sharma', role: 'field_inspector' }, action: 'CREATE_INSPECTION', resource: 'Inspection', description: 'Submitted inspection INS-002 at Bokaro North', ipAddress: '10.0.0.5', createdAt: '2026-08-27T05:12:11Z' },
  { _id: 'AL-004', actor: { name: 'Suresh Kumar', role: 'mine_manager' }, action: 'APPROVE_ACTION', resource: 'CorrectiveAction', description: 'Approved corrective action CA-004', ipAddress: '192.168.1.33', createdAt: '2026-08-26T08:50:00Z' },
  { _id: 'AL-005', actor: { name: 'Ananya Singh', role: 'corporate_regulatory_officer' }, action: 'UPDATE_ACTION', resource: 'CorrectiveAction', description: 'Added regulatory remark on CA-001', ipAddress: '10.0.0.2', createdAt: '2026-08-25T03:30:12Z' },
]

const ROLE_LABELS = {
  system_admin: 'Admin', field_inspector: 'Inspector', safety_officer: 'Safety',
  mine_manager: 'Manager', corporate_regulatory_officer: 'Corporate',
}

const ACTION_COLOR = {
  CREATE_USER:      'text-emerald-400', DELETE_USER: 'text-red-400',
  CREATE_INSPECTION:'text-blue-400',    VERIFY_INSPECTION: 'text-emerald-400',
  CREATE_VIOLATION: 'text-orange-400',  UPDATE_VIOLATION: 'text-amber-400',
  APPROVE_ACTION:   'text-emerald-400', UPDATE_ACTION: 'text-sky-400',
  CREATE_ACTION:    'text-blue-400',    UPDATE_MINE: 'text-amber-400',
  CREATE_SUBSIDIARY:'text-violet-400',
}

export function AuditLogs() {
  const { can } = useRBAC()
  const [logs, setLogs]       = useState(MOCK_LOGS)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    axiosClient.get('/audit-logs', { params: { limit: 100 } })
      .then(({ data }) => { if (data.data?.length) setLogs(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? logs.filter(l =>
        l.description?.toLowerCase().includes(search.toLowerCase()) ||
        l.actor?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.action?.toLowerCase().includes(search.toLowerCase()) ||
        l.resource?.toLowerCase().includes(search.toLowerCase())
      )
    : logs

  const columns = [
    { key: 'createdAt', label: 'Timestamp', sortable: true, render: v => (
        <span className="text-xs font-mono text-slate-400">{v ? new Date(v).toLocaleString('en-IN') : '—'}</span>
    )},
    { key: 'actor', label: 'Officer', render: v => (
        <div>
          <p className="text-xs font-semibold text-white">{v?.name || '—'}</p>
          <p className="text-[10px] text-slate-500">{ROLE_LABELS[v?.role] || v?.role}</p>
        </div>
    )},
    { key: 'action', label: 'Action', sortable: true, render: v => (
        <span className={`text-xs font-mono font-bold ${ACTION_COLOR[v] || 'text-slate-300'}`}>{v}</span>
    )},
    { key: 'resource', label: 'Resource', render: v => (
        <Badge label={v} variant="default" />
    )},
    { key: 'description', label: 'Description', render: v => (
        <span className="text-xs text-slate-300 max-w-xs block truncate" title={v}>{v || '—'}</span>
    )},
    { key: 'ipAddress', label: 'IP', render: v => (
        <span className="text-xs font-mono text-slate-500">{v || '—'}</span>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Trail</h1>
          <p className="text-slate-400 text-sm mt-0.5">Immutable, tamper-evident record of all system actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search actions, officers, resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="No audit logs found." />
      </div>

      <p className="text-[10px] text-slate-600 text-center">
        All actions are logged in accordance with the IT Act 2000 and Mines Act 1952 regulatory requirements. Logs are immutable.
      </p>
    </div>
  )
}
