import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../../components/ui/Table.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StepWizard from '../../components/ui/StepWizard.jsx'
import { MOCK_MINES, MOCK_SUBSIDIARIES } from '../../utils/mockData.js'

const STEPS = ['Mine Information', 'Assign Subsidiary']
const FIELD_CLASSES = 'w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all'
const LABEL_CLASSES = 'block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'

const MINE_TYPES = ['Underground', 'Open Cast', 'Mixed']
const STATES = ['Jharkhand', 'Odisha', 'Chhattisgarh', 'Madhya Pradesh', 'West Bengal', 'Telangana']

export function MineManagement() {
  const [showCreate, setShowCreate] = useState(false)
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '', mineId: '', type: '', state: '', district: '', lat: '', lng: '',
    subsidiaryId: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const subName = (id) => MOCK_SUBSIDIARIES.find(s => s.id === id)?.name || ''

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setShowCreate(false)
    setStep(0)
  }

  const riskColor = (score) =>
    score >= 75 ? 'text-red-400' : score >= 50 ? 'text-amber-400' : 'text-emerald-400'

  const columns = [
    {
      key: 'name', label: 'Mine', sortable: true,
      render: (v, row) => (
        <div>
          <p className="text-sm font-semibold text-white">{v}</p>
          <p className="text-xs text-slate-500">{row.mineId}</p>
        </div>
      ),
    },
    { key: 'type', label: 'Type', sortable: true, render: v => <Badge label={v} variant="default" /> },
    { key: 'state', label: 'State', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    {
      key: 'subsidiaryId', label: 'Subsidiary',
      render: (v) => <span className="text-xs text-slate-400">{subName(v)}</span>,
    },
    {
      key: 'riskScore', label: 'Risk Score', sortable: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className={`h-full rounded-full ${v >= 75 ? 'bg-red-500' : v >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v}%` }} />
          </div>
          <span className={`text-xs font-semibold ${riskColor(v)}`}>{v}/100</span>
        </div>
      ),
    },
    {
      key: 'complianceRate', label: 'Compliance', sortable: true,
      render: v => <span className={`text-sm font-semibold ${v >= 80 ? 'text-emerald-400' : v >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{v}%</span>,
    },
    {
      key: 'status', label: 'Status',
      render: v => <Badge label={v === 'active' ? 'Active' : 'Maintenance'} variant={v === 'active' ? 'active' : 'maintenance'} dot />,
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <Link to={`/mines/${row.id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </Link>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mine Management</h1>
          <p className="text-slate-400 text-sm mt-1">{MOCK_MINES.length} mines across {MOCK_SUBSIDIARIES.length} subsidiaries.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-amber-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Create Mine
        </button>
      </div>

      <Table columns={columns} data={MOCK_MINES} />

      {/* Create Mine Modal */}
      <Modal open={showCreate} onClose={() => { setShowCreate(false); setStep(0) }} title="Create New Mine" size="md">
        <StepWizard
          steps={STEPS}
          current={step}
          onNext={() => setStep(1)}
          onBack={() => setStep(0)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Mine Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={LABEL_CLASSES}>Mine Name *</label>
                  <input className={FIELD_CLASSES} placeholder="e.g. Jharia Block A" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLASSES}>Mine ID *</label>
                  <input className={FIELD_CLASSES} placeholder="JBA-001" value={form.mineId} onChange={e => set('mineId', e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLASSES}>Mine Type</label>
                  <select className={FIELD_CLASSES} value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="">Select type...</option>
                    {MINE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASSES}>State</label>
                  <select className={FIELD_CLASSES} value={form.state} onChange={e => set('state', e.target.value)}>
                    <option value="">Select state...</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASSES}>District</label>
                  <input className={FIELD_CLASSES} placeholder="e.g. Dhanbad" value={form.district} onChange={e => set('district', e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLASSES}>Latitude</label>
                  <input className={FIELD_CLASSES} placeholder="23.7681" value={form.lat} onChange={e => set('lat', e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLASSES}>Longitude</label>
                  <input className={FIELD_CLASSES} placeholder="86.4264" value={form.lng} onChange={e => set('lng', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-white">Assign to Subsidiary</h3>
              <div className="space-y-2">
                {MOCK_SUBSIDIARIES.map(sub => (
                  <button key={sub.id} onClick={() => set('subsidiaryId', sub.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition-all
                      ${form.subsidiaryId === sub.id
                        ? 'bg-amber-500/15 border-amber-500/40'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${form.subsidiaryId === sub.id ? 'border-amber-400 bg-amber-400' : 'border-slate-600'}`} />
                    <div>
                      <p className={`text-sm font-semibold ${form.subsidiaryId === sub.id ? 'text-amber-300' : 'text-white'}`}>{sub.name}</p>
                      <p className="text-xs text-slate-400">{sub.code} · {sub.state} · {sub.mineCount} mines existing</p>
                    </div>
                  </button>
                ))}
              </div>

              {form.subsidiaryId && (
                <div className="rounded-xl bg-slate-800/40 border border-amber-500/20 p-4">
                  <p className="text-xs text-amber-400 font-semibold mb-1">Hierarchy Preview</p>
                  <p className="text-sm text-slate-300 font-mono">
                    Coal Corporation → {subName(form.subsidiaryId)} → {form.name || 'New Mine'}
                  </p>
                </div>
              )}
            </div>
          )}
        </StepWizard>
      </Modal>
    </div>
  )
}
