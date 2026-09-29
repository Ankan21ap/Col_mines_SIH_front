import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../../components/ui/Table.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import PermissionGate from '../../components/rbac/PermissionGate.jsx'
import { PERMISSIONS, ROLES, ROLE_LABELS } from '../../utils/permissions.js'
import { DEMO_USERS, MOCK_MINES, MOCK_SUBSIDIARIES } from '../../utils/mockData.js'
import { useRBAC } from '../../context/RBACContext.jsx'

const ROLE_BADGE_VARIANT = {
  system_admin: 'admin',
  field_inspector: 'inspector',
  safety_officer: 'safety',
  mine_manager: 'manager',
  corporate_regulatory_officer: 'corporate_regulatory',
}

const ROLE_OPTIONS = [
  { value: ROLES.SYSTEM_ADMIN, label: ROLE_LABELS[ROLES.SYSTEM_ADMIN] },
  { value: ROLES.FIELD_INSPECTOR, label: ROLE_LABELS[ROLES.FIELD_INSPECTOR] },
  { value: ROLES.SAFETY_OFFICER, label: ROLE_LABELS[ROLES.SAFETY_OFFICER] },
  { value: ROLES.MINE_MANAGER, label: ROLE_LABELS[ROLES.MINE_MANAGER] },
  { value: ROLES.CORPORATE_REGULATORY_OFFICER, label: ROLE_LABELS[ROLES.CORPORATE_REGULATORY_OFFICER] },
]

function UserRow_Actions({ user, onView, onEdit, onDelete, onReset }) {
  const { can } = useRBAC()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onView(user)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        title="View Details"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      {can(PERMISSIONS.EDIT_USER) ? (
        <button
          onClick={() => onEdit(user)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          title="Edit User"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      ) : (
        <PermissionGate permission={PERMISSIONS.EDIT_USER} mode="tooltip">
          <button className="p-1.5 rounded-lg text-slate-600 cursor-not-allowed" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </PermissionGate>
      )}
      {can(PERMISSIONS.DELETE_USER) && (
        <button
          onClick={() => onDelete(user)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Delete User"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      {can(PERMISSIONS.RESET_USER_ACCESS) && (
        <button
          onClick={() => onReset(user)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
          title="Reset Access"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  )
}

export function UserManagement() {
  const { can } = useRBAC()
  const [users, setUsers] = useState(DEMO_USERS)
  const [viewUser, setViewUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  // Direct Add User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    role: ROLES.FIELD_INSPECTOR,
    subsidiary: 'sub-a',
    status: 'active',
  })

  const subName = (id) => MOCK_SUBSIDIARIES.find(s => s.id === id)?.name || 'Headquarters'
  const mineNames = (ids) => ids?.map(id => MOCK_MINES.find(m => m.id === id)?.name).filter(Boolean).join(', ') || 'All Mines'

  const showSuccessToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  // Direct Add User Submit Handler
  const handleDirectAddUser = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.employeeId) return

    const initials = formData.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'U'

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || '+91 9800000000',
      employeeId: formData.employeeId.trim().toUpperCase(),
      role: formData.role,
      subsidiary: formData.subsidiary || null,
      assignedMines: formData.subsidiary === 'sub-a' ? ['mine-a1'] : [],
      status: formData.status || 'active',
      lastLogin: new Date().toISOString(),
      avatar: initials,
      department: ROLE_LABELS[formData.role] || 'Operations',
    }

    setUsers([newUser, ...users])
    setShowAddModal(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      employeeId: '',
      role: ROLES.FIELD_INSPECTOR,
      subsidiary: 'sub-a',
      status: 'active',
    })
    showSuccessToast(`✓ User ${newUser.name} added successfully as ${ROLE_LABELS[newUser.role]}.`)
  }

  const handleDeleteUser = () => {
    if (!deleteConfirm) return
    setUsers(users.filter(u => u.id !== deleteConfirm.id))
    showSuccessToast(`✓ User ${deleteConfirm.name} deleted.`)
    setDeleteConfirm(null)
  }

  const handleResetAccess = (user) => {
    showSuccessToast(`✓ Access tokens & security credentials reset for ${user.name}.`)
  }

  const columns = [
    {
      key: 'name', label: 'User', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-slate-700 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-200">
            {row.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'phone', label: 'Phone', render: (v) => <span className="text-xs text-slate-300 font-mono">{v || '—'}</span> },
    {
      key: 'role', label: 'Role', sortable: true,
      render: (v) => <Badge label={ROLE_LABELS[v] || v} variant={ROLE_BADGE_VARIANT[v] || 'default'} />,
    },
    {
      key: 'subsidiary', label: 'Subsidiary',
      render: (v) => <span className="text-sm text-slate-400">{subName(v)}</span>,
    },
    {
      key: 'assignedMines', label: 'Assigned Mine(s)',
      render: (v) => (
        <span className="text-xs text-slate-400 max-w-[140px] truncate block" title={mineNames(v)}>
          {mineNames(v)}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (v) => <Badge label={v === 'active' ? 'Active' : 'Inactive'} variant={v === 'active' ? 'active' : 'inactive'} dot />,
    },
    {
      key: 'lastLogin', label: 'Last Login', sortable: true,
      render: (v) => <span className="text-xs text-slate-400">{v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <UserRow_Actions
          user={row}
          onView={setViewUser}
          onEdit={() => {}}
          onDelete={setDeleteConfirm}
          onReset={handleResetAccess}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-2xl animate-in">
          <svg className="w-5 h-5 text-slate-950 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} users registered in the system with active RBAC credentials.</p>
        </div>
        <PermissionGate permission={PERMISSIONS.CREATE_USER} silent>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            + Add User
          </button>
        </PermissionGate>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={users}
        emptyText="No users found."
      />

      {/* ── Direct Add User Modal (Name, Email, Phone, EmpId, Role Dropdown) ── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Direct Add User (System Admin)" size="md">
        <form onSubmit={handleDirectAddUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Email Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. ramesh@coalcorp.in"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Employee ID (EmpID) *
              </label>
              <input
                type="text"
                placeholder="e.g. EMP-105"
                value={formData.employeeId}
                onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Role Dropdown */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Assign Role (Dropdown) *
              </label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
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
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Assigned Subsidiary
              </label>
              <select
                value={formData.subsidiary}
                onChange={e => setFormData({ ...formData, subsidiary: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Headquarters / All Subsidiaries</option>
                {MOCK_SUBSIDIARIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code} - {s.state})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              Direct Add User
            </button>
          </div>
        </form>
      </Modal>

      {/* View User Modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Profile & RBAC Info" size="sm">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-amber-300">
                {viewUser.avatar}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{viewUser.name}</p>
                <p className="text-sm text-slate-400">{viewUser.email}</p>
                <Badge label={ROLE_LABELS[viewUser.role]} variant={ROLE_BADGE_VARIANT[viewUser.role]} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Employee ID', value: viewUser.employeeId },
                { label: 'Phone Number', value: viewUser.phone },
                { label: 'Department', value: viewUser.department },
                { label: 'Status', value: viewUser.status },
                { label: 'Subsidiary', value: subName(viewUser.subsidiary) },
                { label: 'Assigned Mines', value: viewUser.assignedMines?.length ? viewUser.assignedMines.length + ' mines' : 'All mines' },
              ].map(item => (
                <div key={item.label} className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete User" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
            <button onClick={handleDeleteUser} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-400 text-white transition-colors">Confirm Delete</button>
          </>
        }
      >
        <p className="text-slate-300">Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm?.name}</span>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
