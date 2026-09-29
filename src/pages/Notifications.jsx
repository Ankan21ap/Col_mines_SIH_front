import React, { useState, useEffect } from 'react'
import { useRBAC } from '../context/RBACContext.jsx'
import axiosClient from '../api/axiosClient.js'

const MOCK_NOTIFS = [
  { _id: '1', title: 'New violation reported', message: 'V-019 — PPE missing at Dhanbad East workstation 7 (CRITICAL)', createdAt: new Date(Date.now() - 5*60000).toISOString(), read: false, type: 'violation_reported', severity: 'critical' },
  { _id: '2', title: 'Corrective action overdue', message: 'CA-002 — Ventilation duct clearance past deadline', createdAt: new Date(Date.now() - 3600000).toISOString(), read: false, type: 'action_overdue', severity: 'warning' },
  { _id: '3', title: 'Inspection verified', message: 'INS-003 — Talcher Central verified by Priya Nair', createdAt: new Date(Date.now() - 7200000).toISOString(), read: true, type: 'action_approved', severity: 'info' },
  { _id: '4', title: 'Inspection submitted', message: 'INS-002 — Bokaro North submitted by Rahul Sharma', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true, type: 'general', severity: 'info' },
]

const TYPE_STYLE = {
  violation_reported: { bg: 'bg-red-500/8 border-red-500/20',      dot: 'bg-red-400',     icon: '🔴' },
  action_overdue:     { bg: 'bg-orange-500/8 border-orange-500/20', dot: 'bg-orange-400',  icon: '⏰' },
  action_approved:    { bg: 'bg-emerald-500/8 border-emerald-500/20', dot: 'bg-emerald-400', icon: '✅' },
  risk_escalation:    { bg: 'bg-red-500/8 border-red-500/20',       dot: 'bg-red-400',     icon: '⚠️' },
  system_alert:       { bg: 'bg-violet-500/8 border-violet-500/20', dot: 'bg-violet-400',  icon: '🔔' },
  general:            { bg: 'bg-slate-800 border-slate-700',        dot: 'bg-slate-400',   icon: '📌' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000)       return 'Just now'
  if (diff < 3600000)     return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000)    return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export function Notifications() {
  const { user } = useRBAC()
  const [notifs, setNotifs]   = useState(MOCK_NOTIFS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/notifications')
      .then(({ data }) => { if (data.data?.length) setNotifs(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const unread = notifs.filter(n => !n.read)

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    axiosClient.patch(`/notifications/${id}/read`).catch(() => {})
  }

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    axiosClient.patch('/notifications/read-all').catch(() => {})
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-0.5">{unread.length} unread</p>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllRead} className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold">
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map(n => {
            const style = TYPE_STYLE[n.type] || TYPE_STYLE.general
            return (
              <div
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${style.bg} ${!n.read ? 'shadow-md' : 'opacity-60'}`}
              >
                <div className="relative mt-0.5">
                  <span className="text-xl">{style.icon}</span>
                  {!n.read && <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${style.dot} ring-2 ring-slate-950`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            )
          })}
          {notifs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🔔</p>
              <p className="text-white font-semibold">All caught up!</p>
              <p className="text-slate-500 text-sm mt-1">No notifications at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
