import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import MoCoalLogo from '../components/shared/MoCoalLogo.jsx'

/* ─── Animated Counter ─── */
function Counter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return <>{count}{suffix}</>
}

export default function Landing() {
  const { user } = useAuth()
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [demoSimulating, setDemoSimulating] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [sensorValues, setSensorValues] = useState({
    ch4: 0.42, co: 14, ventilation: 1850, temp: 27.4, risk: 18,
  })

  // ── Already logged in? Skip landing → go straight to dashboard
  if (user) return <Navigate to="/dashboard" replace />

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const runSafetyDemo = () => {
    setDemoSimulating(true)
    setTimeout(() => {
      setSensorValues({ ch4: 0.68, co: 22, ventilation: 2100, temp: 28.1, risk: 28 })
      setDemoSimulating(false)
    }, 900)
  }

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Statutory Compliance',
      desc: 'DGMS standard checklists, regulatory notice dispatches, and violation rectifications tracked with non-repudiation audit trails.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Gas & Telemetry IoT',
      desc: 'Live underground methane (CH4), carbon monoxide (CO), velocity and ventilation air quantity feeds with automated siren triggers.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'GIS Geospatial Grid',
      desc: 'Interactive satellite mapping of Jharia, Bokaro, Talcher and Ib Valley blocks with geofencing and inspector breadcrumbs.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'AI Risk Scoring Engine',
      desc: 'Weighted multi-factor ML algorithm predicting rockbursts, gas pockets, and ventilation anomalies before incidents occur.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#070D18] text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <div className="relative w-full min-h-screen flex flex-col">

        {/* Background coal mine image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/coal_mine_hero.jpg')` }}
        >
          {/* Layered dark overlays matching the screenshot */}
          <div className="absolute inset-0 bg-[#070D18]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070D18]/60 via-transparent to-[#070D18]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/50 via-transparent to-[#070D18]/50" />
        </div>

        {/* ── NAVBAR ────────────────────────────────────────────────── */}
        <header
          className={`relative z-30 w-full transition-all duration-300 ${
            navScrolled
              ? 'bg-[#070D18]/95 backdrop-blur-xl border-b border-slate-800/60 shadow-xl shadow-black/40'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">

            {/* Left — Logo (Official Ministry of Coal) */}
            <Link to="/" className="flex items-center gap-3 group select-none">
              {/* Official Ministry of Coal Logo */}
              <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
                <MoCoalLogo size="sm" variant="light" showText={false} />
              </div>

              {/* Brand text */}
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-[22px] font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    Coal<span className="text-amber-400">Gov</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 leading-tight">
                    v2.4
                  </span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                  Ministry of Coal · Govt. of India
                </span>
              </div>
            </Link>

            {/* Right — Nav actions */}
            <div className="flex items-center gap-3">
              {/* Ministry badge — hidden on mobile */}
              <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold text-slate-400 mr-2">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Ministry of Coal
                </span>
                <span className="w-px h-4 bg-slate-700" />
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  AI-Powered Risk Intelligence
                </span>
              </div>

              {/* Sign In / Login CTA */}
              <Link
                to="/login"
                id="nav-login-btn"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/30"
              >
                <span>Sign In / Login</span>
                <span className="text-base">→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ── HERO CONTENT ──────────────────────────────────────────── */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-10 pt-8 pb-20 max-w-5xl mx-auto w-full">

          {/* Badge pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-xs font-semibold text-slate-300">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Ministry of Coal
            </span>
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-xs font-semibold text-slate-300">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AI-Powered Risk Intelligence
            </span>
          </div>

          {/* Main headline — matching screenshot exactly */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.08] max-w-4xl drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)]">
            <span className="text-white">Unified Coal Mine </span>
            <span className="text-amber-400">Governance,</span>
            <br />
            <span className="text-amber-400">Compliance</span>
            <span className="text-white"> &amp; Hazard</span>
            <br />
            <span className="text-white">Intelligence</span>
          </h1>

          {/* Sub-description */}
          <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-200/90 font-normal leading-relaxed max-w-2xl drop-shadow-md">
            Statutory compliance tracking, field inspections, violation management, and
            transparent AI risk scoring across India's multi-tiered colliery subsidiaries.
          </p>

          {/* CTA Buttons — matching screenshot */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
            {/* Primary: Access Governance Portal */}
            <Link
              to="/login"
              id="hero-access-portal-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/30"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Access Governance Portal</span>
              <span className="text-lg font-black">→</span>
            </Link>

            {/* Secondary: Secure RBAC Login */}
            <Link
              to="/login"
              id="hero-rbac-login-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-950/70 hover:bg-slate-900/80 border border-slate-600/60 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 font-bold text-sm sm:text-base hover:scale-[1.03] active:scale-[0.98] transition-all backdrop-blur-md shadow-xl shadow-black/60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Secure RBAC Login</span>
            </Link>
          </div>

          {/* ── Stats cards ── */}
          <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {[
              { icon: '🏭', value: 318, suffix: '+', label: 'Active Mines' },
              { icon: '🔍', value: 1240, suffix: '+', label: 'Field Inspections' },
              { icon: '📊', value: 97, suffix: '%', label: 'Risk Accuracy' },
              { icon: '✅', value: 94, suffix: '%', label: 'Statutory Compliance' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-slate-800/70 hover:border-amber-500/40 transition-all p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/70 group"
              >
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="relative z-20 pb-6 text-center">
          <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold flex items-center justify-center gap-1.5">
            Explore platform capabilities
            <span className="animate-bounce inline-block">↓</span>
          </span>
        </div>
      </div>

      {/* ─── FEATURES SECTION ─────────────────────────────────────── */}
      <section className="relative z-20 py-24 px-6 sm:px-10 bg-[#070D18] border-t border-slate-900/80">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DGMS Statutory Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Enterprise Governance &amp; Mine Safety Pillars
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Engineered under the Mines Act 1952 and Coal Mines Regulations (CMR) 2017 to bring
              transparent surveillance and AI-driven hazard prevention to India's mining sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 space-y-4 group hover:bg-slate-900/80"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBSIDIARIES STRIP ───────────────────────────────────── */}
      <section className="relative z-20 py-14 px-6 sm:px-10 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
              National Coal Intelligence Network
            </span>
            <h4 className="text-xl font-black text-white">
              Covering All Major Coal Basins &amp; Subsidiaries
            </h4>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: 'Eastern Coal Subsidiary (Jharkhand)', mines: 'Jharia · Bokaro North · Dhanbad East' },
              { name: 'Northern Coal Subsidiary (Odisha)', mines: 'Talcher Central · Ib Valley South' },
              { name: 'Central Coal Subsidiary (Chhattisgarh)', mines: 'Korba Block B · Surguja Deep' },
            ].map((sub) => (
              <div
                key={sub.name}
                className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition-all flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{sub.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sub.mines}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────── */}
      <section className="relative z-20 py-20 px-6 sm:px-10 bg-gradient-to-br from-slate-900 via-[#0a1120] to-[#070D18] border-t border-slate-800/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Access the <span className="text-amber-400">CoalGov Portal</span>?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Authorised officers of the Ministry of Coal can sign in using their official credentials to access the full governance, compliance, and risk intelligence suite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              id="cta-enter-portal-btn"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/25"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Enter CoalGov Portal
            </Link>
            <button
              id="cta-demo-btn"
              onClick={() => setShowDemoModal(true)}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 font-bold text-sm transition-all"
            >
              <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Instant Safety Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-slate-800 bg-slate-950 text-slate-400 py-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
              MoC
            </div>
            <div>
              <p className="text-sm font-bold text-white">Ministry of Coal (MoC) · Government of India</p>
              <p className="text-xs text-slate-500 mt-0.5">
                National Coal Mine Governance &amp; Statutory Intelligence Platform · DGMS Certified
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium">
            <Link to="/login" className="hover:text-amber-400 transition-colors">Officer Portal</Link>
            <span className="text-slate-700">•</span>
            <button onClick={() => setShowDemoModal(true)} className="hover:text-amber-400 transition-colors cursor-pointer">
              Telemetry Demo
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">Mines Act 1952</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">CMR 2017</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">v2.4.0</span>
          </div>
        </div>
      </footer>

      {/* ─── SAFETY DEMO MODAL ────────────────────────────────────── */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 animate-fade-in">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-700"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Underground Safety Telemetry Demo</h3>
                <p className="text-xs text-slate-400">Simulated live sensor feed — Jharia Block A (Seam #4 Underground Shaft)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Methane (CH4)', value: `${sensorValues.ch4}%`, status: 'Safe (< 1.25% DGMS)', color: 'text-amber-400' },
                { label: 'Carbon Monoxide', value: `${sensorValues.co} PPM`, status: 'Normal Range', color: 'text-white' },
                { label: 'Air Velocity', value: `${sensorValues.ventilation} CFM`, status: 'Optimal Airflow', color: 'text-white' },
                { label: 'Seam Temp', value: `${sensorValues.temp}°C`, status: 'Within Standard', color: 'text-white' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</span>
                  <p className={`text-2xl font-black font-mono mt-1 ${s.color}`}>{s.value}</p>
                  <span className="text-[10px] text-emerald-400">{s.status}</span>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">AI Predictive Risk Index</span>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-black text-emerald-400 font-mono">{sensorValues.risk} / 100</p>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Low Statutory Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <button
                onClick={runSafetyDemo}
                disabled={demoSimulating}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {demoSimulating ? (
                  <><div className="w-3.5 h-3.5 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" /><span>Injecting Sensor Telemetry...</span></>
                ) : (
                  <span>🔄 Trigger Real-time Gas Simulation</span>
                )}
              </button>

              <Link
                to="/login"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer text-center"
              >
                Enter Portal Login →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
