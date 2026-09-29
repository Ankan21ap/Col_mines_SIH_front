import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DEMO_USERS } from '../utils/mockData.js'
import Emblem from '../components/shared/Emblem.jsx'
import MoCoalLogo from '../components/shared/MoCoalLogo.jsx'

export function Login() {
  const { login, isDemoMode, user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  // ── If already logged in, skip login page → go straight to dashboard
  if (user) return <Navigate to="/dashboard" replace />

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    const result = await login({ email: form.email, password: form.password })
    setLoading(false)
    if (result?.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result?.message || 'Invalid credentials. Please try again.')
    }
  }

  // Demo quick-login
  const handleDemoLogin = async (demoBtn) => {
    setForm({ email: demoBtn.email, password: demoBtn.password })
    setError('')
    setLoading(true)
    const result = await login({ email: demoBtn.email, password: demoBtn.password, role: demoBtn.role })
    setLoading(false)
    if (result?.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result?.message || 'Invalid credentials. Please try again.')
    }
  }

  const DEMO_BUTTONS = [
    { role: 'system_admin',                  label: '⚙️ Admin',     email: 'admin@coalcorp.in',         password: 'Admin@1234' },
    { role: 'field_inspector',               label: '🔍 Inspector', email: 'inspector@coalcorp.in',     password: 'Inspector@1234' },
    { role: 'safety_officer',                label: '🛡️ Safety',    email: 'safety@coalcorp.in',        password: 'Safety@1234' },
    { role: 'mine_manager',                  label: '⛏️ Manager',   email: 'manager@coalcorp.in',       password: 'Manager@1234' },
    { role: 'corporate_regulatory_officer',  label: '🏛️ Corporate', email: 'corporate.reg@coalcorp.in', password: 'Corporate@1234' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* National Tricolour Stripe */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-40" />

      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 select-none">
            {/* Back to Home */}
            <Link
              to="/"
              id="login-back-home-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
            <span className="w-px h-5 bg-slate-800" />
            {/* Official Ministry of Coal Logo */}
            <MoCoalLogo size="sm" variant="light" showText={true} />
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DGMS Telemetry: <strong className="text-emerald-400">ONLINE</strong></span>
            </span>
            <span>Mines Act 1952 Compliant</span>
          </div>
        </div>
      </header>

      {/* Hero + Login form */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden py-12 px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url('/assets/coal_mine_hero.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50 backdrop-blur-[1px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — Branding */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/75 backdrop-blur-xl border border-amber-400/30 text-amber-300 text-xs font-bold shadow-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              National Mine Governance & Compliance Intelligence Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Empowering Sustainable Mining &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                National Coal Intelligence
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
              Official unified platform for real-time safety surveillance, RBAC-driven statutory compliance, and DGMS risk monitoring across all Coal India subsidiaries.
            </p>

            {/* Stats pill */}
            <div className="flex flex-wrap items-center gap-8 py-4 px-6 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/10 max-w-md mx-auto lg:mx-0">
              {[
                { v: '754+', u: 'MT', l: 'Coal Monitored' },
                { v: '94.8%', u: '', l: 'DGMS Score', c: 'text-emerald-400' },
                { v: '318', u: '', l: 'Active Mines', c: 'text-amber-400' },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-2xl font-black font-mono ${s.c || 'text-white'}`}>{s.v}</span>
                    {s.u && <span className="text-xs font-bold text-amber-400">{s.u}</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-black/50 p-8 space-y-6">
              {/* Form header */}
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">Officer Sign In</h2>
                <p className="text-xs text-slate-400">Access is restricted to authorised personnel only</p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="email">
                    Official Email ID
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="officer@coalcorp.in"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword
                        ? <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        : <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /><span>Verifying Clearance...</span></>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg><span>Enter CoalGov Portal</span><span>→</span></>
                  )}
                </button>
              </form>

              {/* Demo quick-access */}
              <div className="border-t border-slate-800 pt-5 space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                  Quick Demo Access — Role Preview
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {DEMO_BUTTONS.map(b => (
                    <button
                      key={b.role}
                      type="button"
                      disabled={loading}
                      onClick={() => handleDemoLogin(b)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-semibold transition-all hover:text-amber-300 hover:border-amber-500/40 cursor-pointer"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <p className="text-[10px] text-slate-500 text-center">
                🛡️ Protected under Mines Act 1952 & IT Act 2000 · 256-bit encrypted
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-4 px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-slate-400 font-medium">
            Ministry of Coal (MoC), Government of India · National Coal Mine Governance & Intelligence Platform
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>DGMS Dhanbad Certified</span><span>•</span><span>Mines Act 1952</span><span>•</span><span>v2.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
