import React, { useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { MOCK_SUBSIDIARIES, MOCK_MINES } from '../../utils/mockData.js'

export function Subsidiaries() {
  const [addModal, setAddModal] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)

  const getMinesForSub = (subId) => MOCK_MINES.filter(m => m.subsidiaryId === subId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Subsidiaries</h1>
          <p className="text-slate-400 text-sm mt-1">Organisation hierarchy — Coal Corporation structure.</p>
        </div>
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-amber-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Subsidiary
        </button>
      </div>

      {/* Org tree visual */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-white">Coal Corporation</p>
            <p className="text-xs text-slate-400">Parent organization · {MOCK_SUBSIDIARIES.length} subsidiaries · {MOCK_MINES.length} mines</p>
          </div>
        </div>

        <div className="pl-4 border-l-2 border-slate-700 space-y-6">
          {MOCK_SUBSIDIARIES.map((sub, si) => {
            const mines = getMinesForSub(sub.id)
            const isLast = si === MOCK_SUBSIDIARIES.length - 1
            return (
              <div key={sub.id} className="relative">
                <div className="absolute -left-[21px] top-4 w-4 h-0.5 bg-slate-700" />

                <div className={`rounded-2xl border p-4 transition-all cursor-pointer
                  ${selectedSub?.id === sub.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-700/60 hover:border-slate-600 bg-slate-800/40'}`}
                  onClick={() => setSelectedSub(selectedSub?.id === sub.id ? null : sub)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{sub.name}</p>
                        <p className="text-xs text-slate-400">{sub.code} · {sub.state} · {mines.length} mines</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge label={sub.status === 'active' ? 'Active' : 'Inactive'} variant={sub.status === 'active' ? 'active' : 'inactive'} dot />
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mines nested */}
                  {(selectedSub?.id === sub.id) && (
                    <div className="mt-4 pl-4 border-l-2 border-slate-700 space-y-2">
                      {mines.map(mine => (
                        <div key={mine.id} className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                          <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-slate-700" />
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{mine.name}</p>
                              <p className="text-xs text-slate-500">{mine.mineId} · {mine.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`text-xs font-semibold ${mine.riskScore >= 75 ? 'text-red-400' : mine.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              Risk {mine.riskScore}/100
                            </div>
                            <Badge label={mine.status === 'active' ? 'Active' : 'Maintenance'} variant={mine.status === 'active' ? 'active' : 'maintenance'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Subsidiary" size="sm"
        footer={
          <>
            <button onClick={() => setAddModal(false)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors">Create Subsidiary</button>
          </>
        }
      >
        <div className="space-y-4">
          {['Subsidiary Name', 'Code', 'State', 'District'].map(label => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
              <input className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all" placeholder={`Enter ${label.toLowerCase()}...`} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
