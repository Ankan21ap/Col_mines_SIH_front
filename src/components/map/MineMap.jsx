import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Fix Leaflet default icon path issue with bundlers ─────────────────────────
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Custom Risk-Coded SVG Markers ─────────────────────────────────────────────
function createRiskIcon(score) {
  const isHigh   = score >= 75
  const isMed    = score >= 50 && score < 75
  const color    = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981'
  const ring     = isHigh ? '#FCA5A5' : isMed ? '#FCD34D' : '#6EE7B7'
  const emoji    = isHigh ? '🔴' : isMed ? '🟡' : '🟢'

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <!-- Pin body -->
      <path d="M18 2C10.27 2 4 8.27 4 16c0 11 14 26 14 26s14-15 14-26C32 8.27 25.73 2 18 2z"
        fill="${color}" filter="url(#shadow)" />
      <!-- Inner ring -->
      <circle cx="18" cy="16" r="8" fill="white" opacity="0.9"/>
      <!-- Score text -->
      <text x="18" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="${color}" font-family="monospace">${score}</text>
    </svg>`

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  })
}

// ── Map auto-fit to bounds ─────────────────────────────────────────────────────
function FitBounds({ mines }) {
  const map = useMap()
  useEffect(() => {
    if (!mines?.length) return
    const bounds = mines.map(m => [m.lat || m.latitude, m.lng || m.longitude])
    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
  }, [mines, map])
  return null
}

/**
 * MineMap — Interactive Leaflet map with risk-coded markers
 *
 * Props:
 *   mines        — array of mine objects (from MOCK_MINES or real API)
 *   onMineClick  — optional callback when a mine marker is clicked
 *   height       — CSS height string (default '450px')
 *   compact      — if true, show smaller popup
 */
export default function MineMap({ mines = [], onMineClick, height = '450px', compact = false }) {
  const [selectedMine, setSelectedMine] = useState(null)

  // Center of India as default
  const DEFAULT_CENTER = [22.5, 82.5]

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl relative">
      {/* Legend */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/60 px-3 py-2.5 shadow-lg">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Risk Level</p>
        {[
          { color: 'bg-emerald-500', label: 'Low  (<50)' },
          { color: 'bg-amber-500',   label: 'Medium (50–74)' },
          { color: 'bg-red-500',     label: 'High  (≥75)' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${l.color} shrink-0`} />
            <span className="text-[10px] text-slate-300 whitespace-nowrap">{l.label}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={true}
      >
        {/* OpenStreetMap tiles — dark style */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        <FitBounds mines={mines} />

        {mines.map((mine) => {
          const lat  = mine.lat || mine.latitude
          const lng  = mine.lng || mine.longitude
          const id   = mine._id || mine.id
          if (!lat || !lng) return null

          const score       = mine.riskScore || 0
          const isHigh      = score >= 75
          const isMed       = score >= 50
          const riskLabel   = isHigh ? 'HIGH RISK' : isMed ? 'MEDIUM RISK' : 'LOW RISK'
          const riskColor   = isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
          const compliance  = mine.complianceRate ?? mine.compliance_rate ?? '—'
          const subsidiary  = mine.subsidiaryId?.name || mine.subsidiaryId || '—'

          return (
            <Marker
              key={id}
              position={[lat, lng]}
              icon={createRiskIcon(score)}
              eventHandlers={{
                click: () => {
                  setSelectedMine(mine)
                  if (onMineClick) onMineClick(mine)
                },
              }}
            >
              <Popup
                className="coalgov-popup"
                maxWidth={compact ? 220 : 280}
              >
                <div className="bg-slate-900 rounded-xl p-0 overflow-hidden" style={{ minWidth: compact ? 200 : 250 }}>
                  {/* Header */}
                  <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{mine.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {mine.mineId} · {mine.type}
                        </p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        isHigh ? 'bg-red-500/20 border-red-500/40 text-red-300'
                               : isMed ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                               : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      }`}>
                        {riskLabel}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3 space-y-2">
                    {/* AI Risk Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">AI Risk Score</span>
                      <span className={`font-black font-mono text-sm ${riskColor}`}>{score}/100</span>
                    </div>

                    {/* Compliance */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">DGMS Compliance</span>
                      <span className={`font-bold font-mono text-xs ${
                        compliance >= 80 ? 'text-emerald-400' : compliance >= 65 ? 'text-amber-400' : 'text-red-400'
                      }`}>{compliance}%</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Location</span>
                      <span className="text-[10px] text-slate-300">{mine.district}, {mine.state}</span>
                    </div>

                    {!compact && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Subsidiary</span>
                        <span className="text-[10px] text-slate-300">{subsidiary}</span>
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Status</span>
                      <span className={`text-[10px] font-bold capitalize ${
                        mine.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>{mine.status}</span>
                    </div>
                  </div>

                  {!compact && (
                    <div className="px-4 pb-3">
                      <a
                        href={`/mines/${mine._id || mine.id}`}
                        className="block text-center text-[11px] font-bold py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors"
                      >
                        View Mine Dossier →
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Popup dark theme override */}
      <style>{`
        .coalgov-popup .leaflet-popup-content-wrapper {
          background: #1e293b !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          padding: 0 !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
        }
        .coalgov-popup .leaflet-popup-tip {
          background: #1e293b !important;
        }
        .coalgov-popup .leaflet-popup-content {
          margin: 0 !important;
          min-width: 200px !important;
        }
        .leaflet-control-zoom a {
          background: #1e293b !important;
          color: #e2e8f0 !important;
          border-color: #334155 !important;
        }
        .leaflet-control-attribution {
          background: rgba(15,23,42,0.85) !important;
          color: #64748b !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #94a3b8 !important; }
      `}</style>
    </div>
  )
}
