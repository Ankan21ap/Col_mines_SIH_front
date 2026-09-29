import React, { useState, useEffect } from 'react'
import MineMap from '../components/map/MineMap.jsx'
import { useRBAC } from '../context/RBACContext.jsx'
import { mineApi } from '../api/mineApi.js'
import MinistryHeroBanner from '../components/shared/MinistryHeroBanner.jsx'
import Badge from '../components/ui/Badge.jsx'

export function GIS() {
  const { accessibleMines, user } = useRBAC()
  const [mines, setMines]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [selectedMine, setSelectedMine] = useState(null)
  const [filter, setFilter]       = useState('all') // all | high | medium | low

  useEffect(() => {
    const fetchMines = async () => {
      try {
        const { data } = await mineApi.getAll()
        setMines(data.data || [])
      } catch {
        // Fallback to RBAC accessible mines (from mock data)
        setMines(accessibleMines || [])
      } finally {
        setLoading(false)
      }
    }
    fetchMines()
  }, [])

  const filteredMines = mines.filter(m => {
    if (filter === 'high')   return (m.riskScore || 0) >= 75
    if (filter === 'medium') return (m.riskScore || 0) >= 50 && (m.riskScore || 0) < 75
    if (filter === 'low')    return (m.riskScore || 0) < 50
    return true
  })

  const highCount   = mines.filter(m => (m.riskScore || 0) >= 75).length
  const medCount    = mines.filter(m => (m.riskScore || 0) >= 50 && (m.riskScore || 0) < 75).length
  const lowCount    = mines.filter(m => (m.riskScore || 0) < 50).length

  return (
    <div className="space-y-6">
      <MinistryHeroBanner
        title="GIS Risk Intelligence Map"
        subtitle="Real-time geospatial mine risk surveillance across all Coal India subsidiaries. Markers color-coded by AI risk score."
        badgeText={`${filteredMines.length} Collieries`}
        stats={[
          { label: '🔴 High Risk',    value: `${highCount} Mines` },
          { label: '🟡 Medium Risk',  value: `${medCount} Mines` },
          { label: '🟢 Low Risk',     value: `${lowCount} Mines` },
        ]}
        backgroundImage="/assets/coal_mine_hero.jpg"
      />

      {/* Risk filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 font-semibold">Filter by risk:</span>
        {['all', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              filter === f
                ? f === 'high'   ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : f === 'medium' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : f === 'low'    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                :                  'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {f === 'all' ? 'All Mines' : `${f.charAt(0).toUpperCase() + f.slice(1)} Risk`}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto">{filteredMines.length} shown</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Map */}
        <div className="xl:col-span-2">
          {loading ? (
            <div className="h-[500px] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
                <p className="text-sm text-slate-400">Loading mine locations...</p>
              </div>
            </div>
          ) : (
            <MineMap
              mines={filteredMines}
              height="500px"
              onMineClick={setSelectedMine}
            />
          )}
        </div>

        {/* Sidebar: Mine list */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Mine Registry</h3>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredMines.map(mine => {
              const score   = mine.riskScore || 0
              const isHigh  = score >= 75
              const isMed   = score >= 50
              const isSelected = selectedMine && (selectedMine._id || selectedMine.id) === (mine._id || mine.id)

              return (
                <div
                  key={mine._id || mine.id}
                  onClick={() => setSelectedMine(mine)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{mine.name}</p>
                      <p className="text-[10px] text-slate-400">{mine.district}, {mine.state}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-black font-mono ${isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {score}
                      </p>
                      <p className="text-[9px] text-slate-500">risk</p>
                    </div>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GIS
