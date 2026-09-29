import React, { useState } from 'react'
import StatCard from '../../components/shared/StatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Table from '../../components/ui/Table.jsx'
import DisabledAction from '../../components/rbac/DisabledAction.jsx'
import { useRBAC } from '../../context/RBACContext.jsx'
import { MOCK_SUBSIDIARIES, MOCK_MINES } from '../../utils/mockData.js'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area
} from 'recharts'

// Mock Analytics Data
const RISK_TREND = [
  { month: 'Apr', risk: 61, compliance: 79, incidents: 4 },
  { month: 'May', risk: 65, compliance: 76, incidents: 5 },
  { month: 'Jun', risk: 70, compliance: 72, incidents: 6 },
  { month: 'Jul', risk: 74, compliance: 70, incidents: 8 },
  { month: 'Aug', risk: 69, compliance: 74, incidents: 3 },
]

const MINE_COMPARISON = MOCK_MINES.map(m => ({
  name: m.name.replace(' Block', '').replace(' North', ' N.').replace(' East', ' E.').replace(' South', ' S.').replace(' Central', ' C.'),
  compliance: m.complianceRate,
  risk: m.riskScore,
  production: Math.floor(m.complianceRate * 12.5),
}))

// Mock Contractors
const MOCK_CONTRACTORS = [
  { id: 'CNT-01', name: 'Bharat Mining Infra Ltd', mine: 'Jharia Block A', scope: 'Overburden Excavation', workers: 320, safetyScore: 84, violations: 2, dgmsStatus: 'Certified', status: 'active' },
  { id: 'CNT-02', name: 'Eastern Earthmovers Pvt Ltd', mine: 'Bokaro North', scope: 'Heavy Earth Transport', workers: 195, safetyScore: 91, violations: 0, dgmsStatus: 'Certified', status: 'active' },
  { id: 'CNT-03', name: 'CoalTech Shaft Solutions', mine: 'Dhanbad East', scope: 'Underground Ventilation & Support', workers: 140, safetyScore: 68, violations: 4, dgmsStatus: 'Review Required', status: 'probation' },
  { id: 'CNT-04', name: 'Mahanadi Heavy Haulers', mine: 'Talcher Central', scope: 'Haulage Road Maintenance', workers: 210, safetyScore: 78, violations: 1, dgmsStatus: 'Certified', status: 'active' },
  { id: 'CNT-05', name: 'Central Pit Drilling Co', mine: 'Korba Block B', scope: 'Blasting & Core Drilling', workers: 85, safetyScore: 88, violations: 1, dgmsStatus: 'Certified', status: 'active' },
]

// Mock Reports for Approval / Verification
const INITIAL_REPORTS = [
  { id: 'REP-2026-Q3', title: 'DGMS Statutory Safety Audit & Compliance Report', type: 'Regulatory Filing', period: 'Q3 2026', author: 'Dr. Rohan Gupta (Regulatory Officer)', status: 'pending_approval', date: '2026-08-28', verified: false },
  { id: 'REP-ENV-08', title: 'National Environmental & Dust Suppression Assessment', type: 'Environmental', period: 'August 2026', author: 'Ananya Singh (Corporate Affairs)', status: 'verified', date: '2026-08-25', verified: true },
  { id: 'REP-CORP-01', title: 'Coal Corporation Consolidated Mine Risk Index', type: 'Executive Brief', period: 'FY 2026-27', author: 'Corporate Risk Committee', status: 'pending_approval', date: '2026-08-27', verified: false },
  { id: 'REP-VENT-14', title: 'Deep Underground Air Quality & Gas Monitoring Dossier', type: 'Safety Directive', period: 'Bi-Annual', author: 'Priya Nair (Safety Officer)', status: 'approved', date: '2026-08-20', verified: true },
]

// Mock Inspections Feed
const MOCK_INSPECTION_FEED = [
  { id: 'INS-001', mine: 'Jharia Block A', subsidiary: 'Eastern Coal Subsidiary', inspector: 'Rahul Sharma', date: '2026-08-27 10:42 AM', score: 68, status: 'Completed', findings: '1 Violation, 2 Observations', gps: '23.7681° N, 86.4264° E', locked: true },
  { id: 'INS-002', mine: 'Bokaro North', subsidiary: 'Eastern Coal Subsidiary', inspector: 'Rahul Sharma', date: '2026-08-24 02:15 PM', score: 84, status: 'Completed', findings: '1 Observation', gps: '23.6693° N, 85.9651° E', locked: true },
  { id: 'INS-003', mine: 'Talcher Central', subsidiary: 'Northern Coal Subsidiary', inspector: 'Priya Nair', date: '2026-08-22 11:30 AM', score: 79, status: 'Verified', findings: 'Clean Pass', gps: '20.9502° N, 85.2295° E', locked: true },
  { id: 'INS-004', mine: 'Dhanbad East', subsidiary: 'Eastern Coal Subsidiary', inspector: 'Rahul Sharma', date: '2026-08-20 09:15 AM', score: 52, status: 'Escalated', findings: '2 Critical Violations', gps: '23.8087° N, 86.4582° E', locked: true },
]

// Mock Escalations
const MOCK_ESCALATIONS = [
  { id: 'ESC-901', mine: 'Dhanbad East', level: 'CRITICAL', title: 'Recurring Gas Sensor Calibration Deficit', details: 'Sensor variance exceeded safety threshold (>3.2%). Immediate DGMS review recommended.', timestamp: '3 hours ago', requiresAction: 'Statutory Directive Required' },
  { id: 'ESC-902', mine: 'Surguja Deep', level: 'HIGH', title: 'Haul Road Slope Micro-fracture Anomaly', details: 'AI GIS satellite telemetry identified 4.2mm ground shift. Slope stability risk elevated.', timestamp: 'Yesterday', requiresAction: 'Corporate Decision Required' },
  { id: 'ESC-903', mine: 'Jharia Block A', level: 'MEDIUM', title: 'Contractor Safety Compliance Below Threshold', details: 'Bharat Mining Infra reported 2 missing PPE log entries during surprise drill.', timestamp: '2 days ago', requiresAction: 'Management Remark Added' },
]

// Mock Decisions and Comments
const INITIAL_DECISIONS = [
  { id: 'DEC-101', mine: 'Dhanbad East', type: 'Statutory Safety Order', title: 'Mandatory Gas Sensor Overhaul within 72 Hours', decisionBy: 'Dr. Rohan Gupta (Regulatory Officer)', timestamp: '2026-08-28 14:00', text: 'All operations at Section 4 suspended until dual-redundant catalytic sensors are deployed and verified by Safety Officer.' },
  { id: 'DEC-102', mine: 'Surguja Deep', type: 'Capital & Engineering Directive', title: 'Slope Reinforcement & Geotechnical Drone Audit', decisionBy: 'Ananya Singh (Corporate Management)', timestamp: '2026-08-27 16:30', text: 'Approved emergency allocation of ₹45L for automated radar slope monitoring and hydraulic rock bolting.' },
]

export default function CorporateDashboard() {
  const { user } = useRBAC()
  const [activeTab, setActiveTab] = useState('overview')
  const [drill, setDrill] = useState(null)
  const [selectedGisMine, setSelectedGisMine] = useState(MOCK_MINES[0])

  // Lists & State
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS)

  // Modals
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(null)
  const [showLockedWarningModal, setShowLockedWarningModal] = useState(null)
  const [viewInspectionModal, setViewInspectionModal] = useState(null)

  // Form inputs
  const [decisionForm, setDecisionForm] = useState({ title: '', mine: MOCK_MINES[0].name, type: 'Corporate Directive', text: '' })
  const [commentForm, setCommentForm] = useState({ target: 'Violation V-021 (Jharia Block A)', comment: '', escalate: true })
  const [observationForm, setObservationForm] = useState({ mine: MOCK_MINES[0].name, directiveType: 'DGMS Statutory Notice (Sec 22)', clause: 'Regulation 124(3) - Flameproof electrical enclosure maintenance', text: '' })
  const [successToast, setSuccessToast] = useState('')

  const triggerToast = (msg) => {
    setSuccessToast(msg)
    setTimeout(() => setSuccessToast(''), 4000)
  }

  // Handle Add Decision
  const handleAddDecision = (e) => {
    e.preventDefault()
    if (!decisionForm.title || !decisionForm.text) return
    const newDec = {
      id: `DEC-${100 + decisions.length + 1}`,
      mine: decisionForm.mine,
      type: decisionForm.type,
      title: decisionForm.title,
      decisionBy: user?.name ? `${user.name} (${user.role === 'regulatory_officer' ? 'Regulatory Officer' : 'Corporate Management'})` : 'Corporate Authority',
      timestamp: 'Just now',
      text: decisionForm.text,
    }
    setDecisions([newDec, ...decisions])
    setShowDecisionModal(false)
    setDecisionForm({ title: '', mine: MOCK_MINES[0].name, type: 'Corporate Directive', text: '' })
    triggerToast('✓ Corporate Management Decision logged and broadcasted to Mine Managers.')
  }

  // Handle Add Comment
  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentForm.comment) return
    setShowCommentModal(false)
    setCommentForm({ target: 'Violation V-021 (Jharia Block A)', comment: '', escalate: true })
    triggerToast('✓ Management Comment attached to record and recorded in immutable audit trail.')
  }

  // Handle Add Regulatory Observation
  const handleAddObservation = (e) => {
    e.preventDefault()
    if (!observationForm.text) return
    const newDec = {
      id: `REG-${200 + decisions.length + 1}`,
      mine: observationForm.mine,
      type: observationForm.directiveType,
      title: `${observationForm.directiveType} - ${observationForm.mine}`,
      decisionBy: user?.name ? `${user.name} (DGMS Regulatory Authority)` : 'Regulatory Officer',
      timestamp: 'Just now',
      text: `${observationForm.clause}: ${observationForm.text}`,
    }
    setDecisions([newDec, ...decisions])
    setShowObservationModal(false)
    setObservationForm({ mine: MOCK_MINES[0].name, directiveType: 'DGMS Statutory Notice (Sec 22)', clause: 'Regulation 124(3)', text: '' })
    triggerToast('✓ Regulatory Observation & Directive formally served to Subsidiary & Mine authorities.')
  }

  // Handle Approve / Verify Report
  const handleApproveReport = (reportId) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: 'approved', verified: true } : r))
    setShowApprovalModal(null)
    triggerToast(`✓ Report ${reportId} digitally approved and certified with Corporate / Regulatory Seal.`)
  }

  const avgCompliance = Math.round(MOCK_MINES.reduce((a, m) => a + m.complianceRate, 0) / MOCK_MINES.length)
  const highRiskMines = MOCK_MINES.filter(m => m.riskScore >= 70).length
  const totalWorkers = MOCK_CONTRACTORS.reduce((acc, c) => acc + c.workers, 0) + 1450

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold shadow-2xl animate-in">
          <svg className="w-5 h-5 text-slate-950 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{successToast}</span>
        </div>
      )}

      {/* ── Header & Action Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-cyan-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Corporate & Regulatory Management</h1>
                <Badge label="Unified Governance Hub" variant="corporate" />
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                <strong className="text-slate-200">Purpose:</strong> Monitor, review, and oversee compliance across multiple mines and subsidiaries.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDecisionModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Decision
          </button>
          <button
            onClick={() => setShowCommentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Add Comment
          </button>
          <button
            onClick={() => setShowObservationModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Regulatory Directive
          </button>
        </div>
      </div>

      {/* ── RBAC Rule & Boundary Matrix Banner ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Can VIEW */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Can View (Full Access)
            </p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>📊 All-mine dashboard & analytics</li>
              <li>🗺️ GIS risk map & AI risk scores</li>
              <li>📋 Compliance & inspection records</li>
              <li>⚠️ Violations & corrective actions</li>
              <li>⛏️ Production & contractor metrics</li>
              <li>📑 Regulatory & management reports</li>
              <li>📝 Audit trail & documents</li>
            </ul>
          </div>

          {/* Can ADD */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Can Add (Directives & Remarks)
            </p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✍️ Corporate management decisions</li>
              <li>💬 Management comments on actions</li>
              <li>⚖️ Regulatory observations & directives</li>
              <li>📌 Strategic escalation flags</li>
            </ul>
          </div>

          {/* Can APPROVE / VERIFY */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Can Approve / Verify
            </p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ Compliance status certification</li>
              <li>📜 Regulatory & statutory reports</li>
              <li>🛡️ Corrective action closures</li>
              <li>🔍 Evidence verification seals</li>
            </ul>
          </div>

          {/* CANNOT (Strict Security Boundaries) */}
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Strict Restrictions (Cannot)
            </p>
            <ul className="text-xs text-red-300 space-y-1">
              <li>❌ Modify original field records</li>
              <li>❌ Change/delete raw evidence / photos</li>
              <li>❌ Manage users or system config</li>
              <li>❌ Change AI risk calculations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: '📊 All-Mine Dashboard & Analytics' },
          { id: 'gis', label: '🗺️ GIS Risk Map & AI Scores' },
          { id: 'compliance', label: '📋 Compliance & Inspections' },
          { id: 'violations', label: '⚠️ Violations, Actions & Decisions' },
          { id: 'contractors', label: '⛏️ Production & Contractors' },
          { id: 'reports', label: '📑 Regulatory & Management Reports' },
          { id: 'escalations', label: '🔔 Escalations & Audit Trail' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
              ${activeTab === tab.id
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 1: 📊 ALL-MINE DASHBOARD & ANALYTICS
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Subsidiaries" value={MOCK_SUBSIDIARIES.length} color="blue" sub="All Operational" />
            <StatCard label="Monitored Mines" value={MOCK_MINES.length} color="amber" sub="7 Across 3 States" />
            <StatCard label="Avg Compliance" value={`${avgCompliance}%`} color="emerald" sub="+2% this month" />
            <StatCard label="High-Risk Mines" value={highRiskMines} color="red" sub="Require Directives" />
            <StatCard label="Total Workforce" value={totalWorkers.toLocaleString()} color="violet" sub="Contractor + Permanent" />
            <StatCard label="Pending Filings" value={reports.filter(r => !r.verified).length} color="rose" sub="Action Required" />
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">5-Month Risk & Compliance Trends</h3>
                  <p className="text-xs text-slate-400">Aggregated multi-subsidiary governance trajectory</p>
                </div>
                <Badge label="AI Monitored" variant="default" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={RISK_TREND}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="compliance" name="Compliance Index (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorCompliance)" strokeWidth={2} />
                  <Area type="monotone" dataKey="risk" name="AI Risk Score" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Mine Compliance vs Production Output</h3>
                  <p className="text-xs text-slate-400">Target metrics correlation across operational blocks</p>
                </div>
                <Badge label="Daily Sync" variant="active" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MINE_COMPARISON} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="compliance" name="Compliance %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="risk" name="Risk %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Organisation Drill-Down Hierarchy */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Hierarchical Drill-Down</h2>
                <p className="text-xs text-slate-400">Corporate Headquarter → Subsidiaries → Mining Blocks</p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Coal Corporation {drill ? `→ ${MOCK_SUBSIDIARIES.find(s => s.id === drill)?.name}` : '→ All Subsidiaries'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_SUBSIDIARIES.map(sub => {
                const subMines = MOCK_MINES.filter(m => m.subsidiaryId === sub.id)
                const subComp = Math.round(subMines.reduce((a, m) => a + m.complianceRate, 0) / subMines.length)
                const isSelected = drill === sub.id

                return (
                  <button
                    key={sub.id}
                    onClick={() => setDrill(isSelected ? null : sub.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-rose-500/50 bg-rose-500/10 ring-1 ring-rose-500/30'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400">{sub.code}</span>
                      <Badge label={sub.status} variant="active" size="xs" />
                    </div>
                    <p className="text-sm font-semibold text-white mt-1">{sub.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub.state} · {subMines.length} Operating Mines</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Compliance:</span>
                      <span className={`font-bold ${subComp >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{subComp}%</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Expanded Mine Table for Selected Subsidiary */}
            <div className="mt-4 rounded-xl bg-slate-950/60 border border-slate-800 p-4">
              <p className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                {drill ? `Mines under ${MOCK_SUBSIDIARIES.find(s => s.id === drill)?.name}` : 'All Operating Mines (Multi-Subsidiary Overview)'}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2 font-medium">Mine Block</th>
                      <th className="pb-2 font-medium">ID & Type</th>
                      <th className="pb-2 font-medium">Location</th>
                      <th className="pb-2 font-medium">Risk Score</th>
                      <th className="pb-2 font-medium">Compliance</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-right">Corporate Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(drill ? MOCK_MINES.filter(m => m.subsidiaryId === drill) : MOCK_MINES).map(mine => (
                      <tr key={mine.id} className="hover:bg-slate-800/30">
                        <td className="py-3 font-semibold text-white">{mine.name}</td>
                        <td className="py-3 text-slate-400">{mine.mineId} ({mine.type})</td>
                        <td className="py-3 text-slate-400">{mine.district}, {mine.state}</td>
                        <td className="py-3">
                          <span className={`font-bold px-2 py-0.5 rounded-full border text-[11px] ${
                            mine.riskScore >= 75 ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                            mine.riskScore >= 50 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                            'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          }`}>
                            {mine.riskScore}/100
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-slate-200">{mine.complianceRate}%</td>
                        <td className="py-3"><Badge label={mine.status} variant={mine.status === 'active' ? 'active' : 'maintenance'} size="xs" /></td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setDecisionForm({ ...decisionForm, mine: mine.name })
                              setShowDecisionModal(true)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-medium"
                          >
                            Issue Directive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 2: 🗺️ GIS RISK MAP & AI RISK SCORES
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'gis' && (
        <div className="space-y-6">
          {/* AI Risk Engine Lock Notice */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span><strong>AI Risk Intelligence Engine:</strong> Multi-sensor neural calculation (Read-Only Telemetry).</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-400">
              🔒 Calculation Locked Against Manual Tampering
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive GIS Simulated Map Visualizer */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Geospatial Satellite Telemetry Matrix</h3>
                  <p className="text-xs text-slate-400">Live coordinates & seismic heat overlay</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Live GPS Sync</span>
                  <Badge label="7 Active Nodes" variant="active" size="xs" />
                </div>
              </div>

              {/* Graphical radar / geospatial canvas simulation */}
              <div className="relative w-full h-80 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 border border-slate-800/40 rounded-xl pointer-events-none" />

                {/* Radar sweep animation circle */}
                <div className="absolute w-64 h-64 rounded-full border border-sky-500/20 animate-ping opacity-25" />
                <div className="absolute w-96 h-96 rounded-full border border-slate-800" />

                {/* Mine Pins */}
                {MOCK_MINES.map((mine, idx) => {
                  const isSelected = selectedGisMine.id === mine.id
                  // Normalized positioning
                  const top = 20 + (idx * 11) % 65
                  const left = 15 + (idx * 13) % 70

                  return (
                    <div
                      key={mine.id}
                      onClick={() => setSelectedGisMine(mine)}
                      style={{ top: `${top}%`, left: `${left}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20`}
                    >
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold shadow-lg transition-transform ${
                        isSelected
                          ? 'bg-rose-500 text-white border-white scale-110 ring-4 ring-rose-500/30'
                          : mine.riskScore >= 75
                          ? 'bg-red-950/90 border-red-500 text-red-300 hover:scale-105'
                          : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:scale-105'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${mine.riskScore >= 75 ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
                        <span>{mine.name.split(' ')[0]}</span>
                        <span className="opacity-75 text-[9px]">{mine.riskScore}</span>
                      </div>
                    </div>
                  )
                })}

                <div className="absolute bottom-3 left-3 text-[10px] text-slate-500 font-mono">
                  Coordinates Bound: 20.95°N - 23.81°N | 82.75°E - 86.46°E
                </div>
              </div>
            </div>

            {/* Selected Mine GIS & AI Risk Dossier */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{selectedGisMine.name}</h3>
                  <p className="text-xs text-slate-400">{selectedGisMine.mineId} · {selectedGisMine.type}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  selectedGisMine.riskScore >= 75 ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  Risk {selectedGisMine.riskScore}/100
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <p className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">AI Risk Factor Decomposition</p>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Methane Gas Variance</span>
                        <span className="font-bold text-red-400">High Risk (82/100)</span>
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Slope Stability & Strata</span>
                        <span className="font-bold text-amber-400">Moderate (58/100)</span>
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '58%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Ventilation Flow Density</span>
                        <span className="font-bold text-emerald-400">Optimal (24/100)</span>
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '24%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                  <p className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">Telemetry Coordinates</p>
                  <p className="text-slate-400 font-mono">Lat: {selectedGisMine.lat}° N · Long: {selectedGisMine.lng}° E</p>
                  <p className="text-slate-500 text-[11px]">District: {selectedGisMine.district}, {selectedGisMine.state}</p>
                </div>

                <button
                  onClick={() => {
                    setDecisionForm({ ...decisionForm, mine: selectedGisMine.name, title: `Hazard Mitigation for ${selectedGisMine.name}` })
                    setShowDecisionModal(true)
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold transition-all"
                >
                  Issue Directive for this Mine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 3: 📋 COMPLIANCE & INSPECTION RECORDS
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Central Compliance & Inspection Dossier</h2>
              <p className="text-xs text-slate-400">Comprehensive feed of all field inspections across all mines.</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              🔒 Field records are immutable and timestamp-stamped
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="divide-y divide-slate-800">
              {MOCK_INSPECTION_FEED.map(ins => (
                <div key={ins.id} className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-amber-400">{ins.id}</span>
                      <span className="text-sm font-semibold text-white">{ins.mine}</span>
                      <Badge label={ins.subsidiary} variant="default" size="xs" />
                      <Badge label={ins.status} variant={ins.status === 'Verified' ? 'verified' : ins.status === 'Escalated' ? 'critical' : 'active'} size="xs" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>👤 Inspector: {ins.inspector}</span>
                      <span>📅 {ins.date}</span>
                      <span className="font-mono">📍 {ins.gps}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Findings: <strong className="text-amber-300">{ins.findings}</strong> (Score: {ins.score}%)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setViewInspectionModal(ins)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      View Original Record
                    </button>
                    <button
                      onClick={() => setShowLockedWarningModal(ins)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/40 text-slate-500 border border-slate-800 hover:border-red-500/40 hover:text-red-400 transition-colors flex items-center gap-1"
                      title="Modification is prohibited by RBAC rules"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Edit Record
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 4: ⚠️ VIOLATIONS, ACTIONS & DECISIONS
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'violations' && (
        <div className="space-y-6">
          {/* Active Decisions & Directives */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Active Corporate Decisions & Regulatory Directives</h3>
                <p className="text-xs text-slate-400">Formal instructions issued by Corporate Management and Regulatory Officers</p>
              </div>
              <button
                onClick={() => setShowDecisionModal(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30"
              >
                + New Decision
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decisions.map(dec => (
                <div key={dec.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">{dec.id} · {dec.mine}</span>
                    <Badge label={dec.type} variant="corporate" size="xs" />
                  </div>
                  <p className="text-sm font-semibold text-white">{dec.title}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{dec.text}</p>
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Issued by: {dec.decisionBy}</span>
                    <span>{dec.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Corrective Action Approvals */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <h3 className="text-base font-semibold text-white">High-Level Action Verification Queue</h3>
            <div className="divide-y divide-slate-800">
              {[
                { id: 'CA-001', mine: 'Jharia Block A', title: 'Level 3 Fire Extinguisher Array Renewal', priority: 'CRITICAL', status: 'Pending Corporate Approval', deadline: '2026-09-01' },
                { id: 'CA-003', mine: 'Dhanbad East', title: 'Secondary Gas Detection Relay Calibration', priority: 'HIGH', status: 'Pending Regulatory Sign-off', deadline: '2026-08-30' },
              ].map(item => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400">{item.id}</span>
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      <Badge label={item.priority} variant={item.priority === 'CRITICAL' ? 'critical' : 'high'} size="xs" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Mine: {item.mine} · Deadline: {item.deadline} · {item.status}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowCommentModal(true)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Comment
                    </button>
                    <button
                      onClick={() => triggerToast(`✓ Corrective action ${item.id} verified and approved for closure.`)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                    >
                      Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 5: ⛏️ PRODUCTION & CONTRACTOR PERFORMANCE
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'contractors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Mining Contractors & Production Governance</h2>
              <p className="text-xs text-slate-400">Oversight on contracted equipment, safety indices, and workforce safety compliance.</p>
            </div>
            <Badge label={`${MOCK_CONTRACTORS.length} Active Vendors`} variant="default" />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-3.5 font-medium">Contractor</th>
                  <th className="p-3.5 font-medium">Assigned Mine & Scope</th>
                  <th className="p-3.5 font-medium">Workforce</th>
                  <th className="p-3.5 font-medium">Safety Score</th>
                  <th className="p-3.5 font-medium">Open Violations</th>
                  <th className="p-3.5 font-medium">DGMS Status</th>
                  <th className="p-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_CONTRACTORS.map(cnt => (
                  <tr key={cnt.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-semibold text-white">
                      {cnt.name}
                      <span className="block text-[10px] text-slate-500 font-mono">{cnt.id}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-200 font-medium">{cnt.mine}</span>
                      <span className="block text-slate-400 text-[11px]">{cnt.scope}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">{cnt.workers} Men</td>
                    <td className="p-3.5">
                      <span className={`font-bold px-2 py-0.5 rounded-full border text-[11px] ${
                        cnt.safetyScore >= 85 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                        cnt.safetyScore >= 70 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                        'bg-red-500/15 border-red-500/30 text-red-400'
                      }`}>
                        {cnt.safetyScore}%
                      </span>
                    </td>
                    <td className="p-3.5">
                      {cnt.violations > 0 ? (
                        <span className="font-bold text-amber-400">{cnt.violations} Infractions</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">0 Infractions</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge label={cnt.dgmsStatus} variant={cnt.dgmsStatus === 'Certified' ? 'active' : 'critical'} size="xs" />
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setCommentForm({ target: `Contractor ${cnt.name} (${cnt.mine})`, comment: '', escalate: true })
                          setShowCommentModal(true)
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium"
                      >
                        Audit Remark
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 6: 📑 REGULATORY & MANAGEMENT REPORTS
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Regulatory Filings & Management Reports</h2>
              <p className="text-xs text-slate-400">Review, verify, and approve official statutory compliance submissions.</p>
            </div>
            <button
              onClick={() => triggerToast('✓ Consolidated Multi-Mine Governance Dossier generated.')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold"
            >
              Generate Consolidated PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(rep => (
              <div key={rep.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">{rep.id}</span>
                    <Badge label={rep.status.replace('_', ' ')} variant={rep.verified ? 'verified' : 'pending'} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{rep.title}</h3>
                  <p className="text-xs text-slate-400">
                    Category: <strong className="text-slate-200">{rep.type}</strong> · Period: {rep.period}
                  </p>
                  <p className="text-xs text-slate-500">Author: {rep.author} · Submitted {rep.date}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {rep.verified ? '✅ Verified & Signed' : '⚠️ Pending Official Verification'}
                  </span>
                  <div className="flex gap-2">
                    {!rep.verified ? (
                      <button
                        onClick={() => setShowApprovalModal(rep)}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
                      >
                        Approve & Verify Report
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-medium border border-slate-700">
                        Sealed by Authority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 7: 🔔 ESCALATIONS & AUDIT TRAIL
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'escalations' && (
        <div className="space-y-6">
          {/* Active Escalations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <h3 className="text-base font-semibold text-white">Critical Mine Escalations</h3>
            <div className="space-y-3">
              {MOCK_ESCALATIONS.map(esc => (
                <div key={esc.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge label={esc.level} variant={esc.level === 'CRITICAL' ? 'critical' : 'high'} size="xs" />
                      <span className="text-sm font-semibold text-white">{esc.title}</span>
                      <span className="text-xs text-slate-400">({esc.mine})</span>
                    </div>
                    <p className="text-xs text-slate-300">{esc.details}</p>
                    <p className="text-[11px] text-slate-500">{esc.timestamp} · Status: <span className="text-amber-400">{esc.requiresAction}</span></p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setDecisionForm({ ...decisionForm, mine: esc.mine, title: `Escalation Order: ${esc.title}` })
                        setShowDecisionModal(true)
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30"
                    >
                      Issue Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tamper-Proof Audit Trail Reference */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Immutable Governance Audit Log</h3>
              <span className="text-xs text-slate-400">SHA-256 Hash Verified</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between items-center">
                <span>[2026-08-28 14:00] <strong>Dr. Rohan Gupta</strong> issued Statutory Notice DEC-101 for Dhanbad East</span>
                <span className="text-slate-500 font-mono">HASH: 7f8a92...</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between items-center">
                <span>[2026-08-27 16:30] <strong>Ananya Singh</strong> approved ₹45L Capital Directive DEC-102 for Surguja Deep</span>
                <span className="text-slate-500 font-mono">HASH: 3b1c44...</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between items-center">
                <span>[2026-08-25 09:12] <strong>Ananya Singh</strong> verified Environmental Assessment Report REP-ENV-08</span>
                <span className="text-slate-500 font-mono">HASH: 9c0e21...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MODALS & INTERACTIVE WORKFLOW DIALOGS
         ═══════════════════════════════════════════════════════════════════════ */}

      {/* Modal 1: Add Corporate Management Decision */}
      <Modal open={showDecisionModal} onClose={() => setShowDecisionModal(false)} title="Issue Corporate Management Decision" size="md">
        <form onSubmit={handleAddDecision} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Target Mining Block</label>
            <select
              value={decisionForm.mine}
              onChange={e => setDecisionForm({ ...decisionForm, mine: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-rose-500 focus:outline-none"
            >
              {MOCK_MINES.map(m => <option key={m.id} value={m.name}>{m.name} ({m.state})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Decision / Directive Category</label>
            <select
              value={decisionForm.type}
              onChange={e => setDecisionForm({ ...decisionForm, type: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-rose-500 focus:outline-none"
            >
              <option>Corporate Safety Directive</option>
              <option>Capital Allocation & Engineering Mandate</option>
              <option>Operational Work Stoppage Order</option>
              <option>Contractor Inquiry Directive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Decision Title</label>
            <input
              type="text"
              placeholder="e.g., Immediate Overhaul of Ventilation Fan Shaft"
              value={decisionForm.title}
              onChange={e => setDecisionForm({ ...decisionForm, title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Directive Instructions & Execution Clauses</label>
            <textarea
              rows={4}
              placeholder="State explicit instructions for the Mine Manager, safety officers, and contractors..."
              value={decisionForm.text}
              onChange={e => setDecisionForm({ ...decisionForm, text: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowDecisionModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 hover:brightness-110"
            >
              Broadcast Decision
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Management Comment */}
      <Modal open={showCommentModal} onClose={() => setShowCommentModal(false)} title="Add Management Comment" size="sm">
        <form onSubmit={handleAddComment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Target Item / Violation</label>
            <input
              type="text"
              value={commentForm.target}
              onChange={e => setCommentForm({ ...commentForm, target: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Executive Comment</label>
            <textarea
              rows={3}
              placeholder="Add official corporate perspective or guidance..."
              value={commentForm.comment}
              onChange={e => setCommentForm({ ...commentForm, comment: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={() => setShowCommentModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
              Save Comment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Add Regulatory Observation / Directive */}
      <Modal open={showObservationModal} onClose={() => setShowObservationModal(false)} title="Serve Statutory Regulatory Directive" size="md">
        <form onSubmit={handleAddObservation} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Target Mine</label>
            <select
              value={observationForm.mine}
              onChange={e => setObservationForm({ ...observationForm, mine: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            >
              {MOCK_MINES.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Statutory Notice Instrument</label>
            <select
              value={observationForm.directiveType}
              onChange={e => setObservationForm({ ...observationForm, directiveType: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>DGMS Statutory Notice (Section 22 Mines Act)</option>
              <option>Statutory Improvement Directive (Mines Rules 1955)</option>
              <option>Environmental Compliance Show-Cause Order</option>
              <option>Formal Regulatory Inquiry Mandate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Statute Reference / Regulation Clause</label>
            <input
              type="text"
              value={observationForm.clause}
              onChange={e => setObservationForm({ ...observationForm, clause: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Directive Clauses & Remediation Order</label>
            <textarea
              rows={4}
              placeholder="State precise legal and safety mandates required for compliance restoration..."
              value={observationForm.text}
              onChange={e => setObservationForm({ ...observationForm, text: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={() => setShowObservationModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110">
              Serve Regulatory Directive
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 4: Approve & Verify Report */}
      <Modal open={!!showApprovalModal} onClose={() => setShowApprovalModal(null)} title="Approve & Certify Regulatory Report" size="sm">
        {showApprovalModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <p className="text-sm font-semibold text-white">{showApprovalModal.title}</p>
              <p className="text-xs text-slate-400">Filing ID: {showApprovalModal.id} · Period: {showApprovalModal.period}</p>
              <p className="text-xs text-slate-500">Submitted by: {showApprovalModal.author}</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By confirming, you digitally certify that this report has been scrutinized against statutory mine safety benchmarks and authorized for institutional submission.
            </p>
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <button onClick={() => setShowApprovalModal(null)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
              <button
                onClick={() => handleApproveReport(showApprovalModal.id)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
              >
                Confirm & Seal Report
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 5: Warning for Attempting to Edit Field Record */}
      <Modal open={!!showLockedWarningModal} onClose={() => setShowLockedWarningModal(null)} title="Action Prohibited by RBAC Rules" size="sm">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Original Field Records Are Immutable</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Corporate Management and Regulatory Officers cannot modify original field inspection records, raw photos, or GPS metadata. You can issue directives, add management comments, or request re-inspection instead.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowLockedWarningModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal 6: View Original Inspection Record Modal */}
      <Modal open={!!viewInspectionModal} onClose={() => setViewInspectionModal(null)} title="Field Inspection Digital Log" size="md">
        {viewInspectionModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400">Inspection ID</p>
                <p className="font-bold text-amber-400">{viewInspectionModal.id}</p>
              </div>
              <div>
                <p className="text-slate-400">Mine & Subsidiary</p>
                <p className="font-bold text-white">{viewInspectionModal.mine}</p>
                <p className="text-slate-500 text-[10px]">{viewInspectionModal.subsidiary}</p>
              </div>
              <div>
                <p className="text-slate-400">Inspector Stamp</p>
                <p className="font-semibold text-slate-200">{viewInspectionModal.inspector} (Verified)</p>
              </div>
              <div>
                <p className="text-slate-400">GPS & Timestamp</p>
                <p className="font-mono text-slate-300">{viewInspectionModal.gps}</p>
                <p className="text-slate-500 text-[10px]">{viewInspectionModal.date}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Recorded Checklist Summary</p>
              <p className="text-slate-300">✓ Emergency escape shafts clear and illuminated</p>
              <p className="text-slate-300">✓ Fire suppression manifolds pressure tested</p>
              <p className="text-amber-400">⚠ Findings: {viewInspectionModal.findings}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 font-mono">Record State: Cryptographically Sealed</span>
              <button
                onClick={() => setViewInspectionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
