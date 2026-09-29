import React, { useState, useEffect } from 'react'
import { useRBAC } from '../context/RBACContext.jsx'
import { riskApi } from '../api/riskApi.js'
import { mineApi } from '../api/mineApi.js'
import { MOCK_MINES } from '../utils/mockData.js'
import RiskScoreCard from '../components/risk/RiskScoreCard.jsx'
import RiskBreakdown from '../components/risk/RiskBreakdown.jsx'
import MinistryHeroBanner from '../components/shared/MinistryHeroBanner.jsx'
import Badge from '../components/ui/Badge.jsx'

export function Risk() {
  const { user, can } = useRBAC()
  const [mines, setMines]     = useState([])
  const [selected, setSelected] = useState(null)
  const [riskData, setRiskData] = useState({}) // mineId → risk object
  const [loading, setLoading]   = useState(true)
  const [computing, setComputing] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load mines
      const minesRes = await mineApi.getAll().catch(() => ({ data: { data: [] } }))
      const mineList = minesRes.data.data?.length ? minesRes.data.data : MOCK_MINES

      // Load risk scores
      const riskRes = await riskApi.getAll().catch(() => ({ data: { data: [] } }))
      const riskMap = {}
      ;(riskRes.data.data || []).forEach(r => {
        const id = r.mine?._id || r.mine
        if (id) riskMap[id] = r
      })

      setMines(mineList)
      setRiskData(riskMap)

      // Auto-select highest risk mine
      if (mineList.length) {
        const sorted = [...mineList].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
        setSelected(sorted[0])
      }
    } catch (err) {
      setError('Failed to load risk data.')
    } finally {
      setLoading(false)
    }
  }

  const computeRisk = async (mineId) => {
    setComputing(true)
    try {
      const { data } = await riskApi.compute(mineId)
      setRiskData(prev => ({ ...prev, [mineId]: { breakdown: data.data?.breakdown, aiExplanation: data.data?.aiExplanation, score: data.data?.score, level: data.data?.level } }))
      // Update mine score in list
      setMines(prev => prev.map(m => (m._id || m.id) === mineId ? { ...m, riskScore: data.data?.score } : m))
    } catch (err) {
      console.error('Risk compute failed:', err.message)
    } finally {
      setComputing(false)
    }
  }

  const selectedId = selected?._id || selected?.id
  const selectedRisk = riskData[selectedId]
  const score = selectedRisk?.score ?? selected?.riskScore ?? 0
  const level = selectedRisk?.level ?? (score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low')

  const canCompute = can('view:ai_risk') && ['system_admin', 'safety_officer'].includes(user?.role)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading risk intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MinistryHeroBanner
        title="AI Risk Intelligence"
        subtitle="Explainable mine risk scoring — deterministic weighted analysis with Groq AI explanations. Human verification always required before action."
        badgeText="Risk Engine v1"
        stats={[
          { label: '🔴 High Risk',   value: `${mines.filter(m => (m.riskScore||0) >= 75).length} mines` },
          { label: '🟡 Medium Risk', value: `${mines.filter(m => (m.riskScore||0) >= 50 && (m.riskScore||0) < 75).length} mines` },
          { label: '🟢 Low Risk',    value: `${mines.filter(m => (m.riskScore||0) < 50).length} mines` },
        ]}
        backgroundImage="/assets/coal_mine_hero.jpg"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mine ranking */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Mine Risk Ranking</h3>
            {canCompute && (
              <button
                onClick={async () => {
                  setComputing(true)
                  for (const m of mines) { await riskApi.compute(m._id || m.id).catch(() => {}) }
                  await loadData()
                  setComputing(false)
                }}
                disabled={computing}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 transition-all disabled:opacity-50 font-bold"
              >
                {computing ? 'Computing...' : '↻ Recompute All'}
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {[...mines]
              .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
              .map((mine, idx) => {
                const id      = mine._id || mine.id
                const score   = riskData[id]?.score ?? mine.riskScore ?? 0
                const isHigh  = score >= 75
                const isMed   = score >= 50
                const isSel   = selectedId === id

                return (
                  <div
                    key={id}
                    onClick={() => setSelected(mine)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSel
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-mono text-slate-500 w-5 shrink-0">#{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{mine.name}</p>
                      <p className="text-[10px] text-slate-400">{mine.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-black font-mono ${isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {score}
                      </p>
                      <p className="text-[9px] text-slate-500">/100</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Right: Detail */}
        {selected ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Mine header */}
            <div className="flex items-start justify-between gap-3 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-black text-white">{selected.name}</h2>
                  <Badge
                    label={selected.status}
                    variant={selected.status === 'active' ? 'active' : 'maintenance'}
                    dot
                  />
                </div>
                <p className="text-xs text-slate-400">{selected.mineId} · {selected.type} · {selected.district}, {selected.state}</p>
              </div>
              {canCompute && (
                <button
                  onClick={() => computeRisk(selectedId)}
                  disabled={computing}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-500/25 transition-all disabled:opacity-50 shrink-0"
                >
                  {computing ? (
                    <><div className="w-3 h-3 border border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />Computing...</>
                  ) : (
                    <><span>🔄</span> Compute Risk</>
                  )}
                </button>
              )}
            </div>

            {/* Score card */}
            <RiskScoreCard score={score} level={level} />

            {/* Breakdown */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4">Risk Factor Breakdown</h3>
              <RiskBreakdown
                breakdown={selectedRisk?.breakdown}
                aiExplanation={selectedRisk?.aiExplanation}
                loading={computing}
              />
              {!selectedRisk && (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-slate-400">No risk data computed yet for this mine.</p>
                  {canCompute && (
                    <button
                      onClick={() => computeRisk(selectedId)}
                      className="px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-500/25 transition-all"
                    >
                      Compute Risk Score Now
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Compliance bar */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">DGMS Compliance Index</h3>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Compliance Rate</span>
                  <span className={`font-mono font-bold ${
                    (selected.complianceRate||0) >= 80 ? 'text-emerald-400'
                    : (selected.complianceRate||0) >= 65 ? 'text-amber-400'
                    : 'text-red-400'
                  }`}>{selected.complianceRate || 0}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      (selected.complianceRate||0) >= 80 ? 'bg-emerald-500'
                      : (selected.complianceRate||0) >= 65 ? 'bg-amber-500'
                      : 'bg-red-500'
                    }`}
                    style={{ width: `${selected.complianceRate || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center h-64 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-slate-500 text-sm">Select a mine to view risk details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Risk
