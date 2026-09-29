import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

export default function MainLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-amber-500/30 selection:text-amber-200">
      {/* ─── Left Side Navigation Bar (All Page Options) ─── */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* ─── Main Content Viewport ─── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* National Tricolour Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shrink-0" />

        {/* Top Header Bar with Context & Controls */}
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950/70">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>

          {/* Official Portal Footer */}
          <footer className="mt-8 border-t border-slate-900 bg-slate-950/90 text-slate-500 text-xs py-4 px-6">
            <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-400 font-medium text-[11px]">
                  National Coal Mine Governance & Intelligence Platform • Ministry of Coal (MoC), Government of India
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>DGMS Dhanbad Certified</span>
                <span>•</span>
                <span>Mines Act 1952 Portal</span>
                <span>•</span>
                <span>v2.4.0 (National Telemetry Node)</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
