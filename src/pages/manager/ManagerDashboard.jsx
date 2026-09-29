import React, { useState } from 'react'
import StatCard from '../../components/shared/StatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import PermissionGate from '../../components/rbac/PermissionGate.jsx'
import { PERMISSIONS } from '../../utils/permissions.js'
import { useRBAC } from '../../context/RBACContext.jsx'

const ACTIONS = [
  { id: 'CA-001', title: 'Replace expired fire extinguishers – Level 3', mine: 'Jharia Block A', priority: 'CRITICAL', status: 'open', assignee: 'Suresh Kumar', deadline: '2026-09-01', overdue: false, violations: ['V-021'] },
  { id: 'CA-002', title: 'Clear ventilation duct blockage at Shaft B', mine: 'Bokaro North', priority: 'HIGH', status: 'in_progress', assignee: 'Rahul Sharma', deadline: '2026-08-28', overdue: true, violations: ['V-019'] },
  { id: 'CA-003', title: 'Calibrate gas detection devices — quarterly check', mine: 'Jharia Block A', priority: 'MEDIUM', status: 'pending_approval', assignee: 'Priya Nair', deadline: '2026-09-10', overdue: false, violations: [] },
  { id: 'CA-004', title: 'Install additional emergency lighting — access road', mine: 'Surguja Deep', priority: 'HIGH', status: 'resolved', assignee: 'Suresh Kumar', deadline: '2026-08-20', overdue: false, violations: [] },
]

const priorityColors = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
const statusColors = { open: 'open', in_progress: 'pending', pending_approval: 'pending', resolved: 'resolved' }
const statusLabels = { open: 'Open', in_progress: 'In Progress', pending_approval: 'Pending Approval', resolved: 'Resolved' }

export default function ManagerDashboard() {
  const { can, user } = useRBAC()
  const [createModal, setCreateModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const canApprove = can(PERMISSIONS.APPROVE_CORRECTIVE_ACTION)
  const canCreate = can(PERMISSIONS.CREATE_CORRECTIVE_ACTION)

  const overdueCount = ACTIONS.filter(a => a.overdue).length
  const openCount = ACTIONS.filter(a => a.status !== 'resolved').length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mine Manager Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">What requires your attention today?</p>
        </div>
        <PermissionGate permission={PERMISSIONS.CREATE_CORRECTIVE_ACTION} silent>
          <button onClick={() => setCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-amber-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Action
          </button>
        </PermissionGate>
      </div>

      {/* Attention banner */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-300">{overdueCount} Overdue Corrective Action{overdueCount > 1 ? 's' : ''}</p>
            <p className="text-xs text-red-400/70 mt-0.5">Immediate attention required to avoid compliance breach.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Actions" value={openCount} color="amber"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Overdue" value={overdueCount} color="red"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Pending Approval" value={ACTIONS.filter(a => a.status === 'pending_approval').length} color="violet"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard label="Resolved" value={ACTIONS.filter(a => a.status === 'resolved').length} color="emerald"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Actions list */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Corrective Actions</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {ACTIONS.map(action => (
            <div key={action.id} className="px-5 py-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs text-slate-500">{action.id}</span>
                    <Badge label={action.priority} variant={priorityColors[action.priority]} />
                    <Badge label={statusLabels[action.status]} variant={statusColors[action.status]} />
                    {action.overdue && <Badge label="OVERDUE" variant="overdue" />}
                  </div>
                  <p className="text-sm font-medium text-white">{action.title}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                    <span>⛏ {action.mine}</span>
                    <span>👤 {action.assignee}</span>
                    <span className={action.overdue ? 'text-red-400' : ''}>📅 Due {action.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setSelectedAction(action)} className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    Details
                  </button>
                  {canApprove && action.status === 'pending_approval' && (
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors">
                      Approve
                    </button>
                  )}
                  {!canApprove && action.status === 'pending_approval' && (
                    <PermissionGate permission={PERMISSIONS.APPROVE_CORRECTIVE_ACTION}>
                      <button>Approve</button>
                    </PermissionGate>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create action modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="New Corrective Action" size="md"
        footer={
          <>
            <button onClick={() => setCreateModal(false)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors">Create Action</button>
          </>
        }
      >
        <div className="space-y-4">
          {['Title', 'Assigned To', 'Related Violation ID'].map(label => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
              <input className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all" placeholder={`Enter ${label.toLowerCase()}...`} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Priority</label>
              <select className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500/60 transition-all">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Deadline</label>
              <input type="date" className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500/60 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Management Comments</label>
            <textarea rows={3} className="w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none transition-all" placeholder="Add instructions or context for the assignee..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
