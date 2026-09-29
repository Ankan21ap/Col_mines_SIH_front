import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { RBACProvider } from './context/RBACContext.jsx'
import MainLayout from './components/layout/MainLayout.jsx'
import RoleGuard from './components/rbac/RoleGuard.jsx'

// Pages
import Landing                  from './pages/landing.jsx'
import { Login }                from './pages/Login.jsx'
import { Dashboard }            from './pages/Dashboard.jsx'
import { Mines, MineDetails }   from './pages/Mines.jsx'
import { Inspections, InspectionDetails } from './pages/Inspections.jsx'
import { Violations, ViolationDetails }   from './pages/Violations.jsx'
import { Actions, ActionDetails }         from './pages/Actions.jsx'
import { Notifications }        from './pages/Notifications.jsx'
import { AuditLogs }            from './pages/AuditLogs.jsx'

// Admin pages
import AdminDashboard           from './pages/admin/AdminDashboard.jsx'
import { UserManagement }       from './pages/admin/UserManagement.jsx'
import { CreateUser }           from './pages/admin/CreateUser.jsx'
import { RolesPermissions }     from './pages/admin/RolesPermissions.jsx'
import { Subsidiaries }         from './pages/admin/Subsidiaries.jsx'
import { MineManagement }       from './pages/admin/MineManagement.jsx'

// Inspector pages
import { InspectionFlow }       from './pages/inspector/InspectionFlow.jsx'

// New pages
import GIS                      from './pages/GIS.jsx'
import Risk                     from './pages/Risk.jsx'

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ─── Main Routes ──────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected — all within MainLayout */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Shared pages */}
        <Route path="/mines"           element={<Mines />} />
        <Route path="/mines/:id"       element={<MineDetails />} />
        <Route path="/inspections"     element={<Inspections />} />
        <Route path="/inspections/:id" element={<InspectionDetails />} />
        <Route path="/violations"      element={<Violations />} />
        <Route path="/violations/:id"  element={<ViolationDetails />} />
        <Route path="/actions"         element={<Actions />} />
        <Route path="/actions/:id"     element={<ActionDetails />} />
        <Route path="/notifications"   element={<Notifications />} />
        <Route path="/audit-logs"      element={<AuditLogs />} />

        {/* GIS & Risk Intelligence */}
        <Route path="/gis"  element={<GIS />} />
        <Route path="/risk" element={<Risk />} />

        {/* Admin-only routes */}
        <Route path="/admin/users" element={
          <RoleGuard roles={['system_admin']}><UserManagement /></RoleGuard>
        } />
        <Route path="/admin/users/create" element={
          <RoleGuard roles={['system_admin']}><CreateUser /></RoleGuard>
        } />
        <Route path="/admin/roles" element={
          <RoleGuard roles={['system_admin']}><RolesPermissions /></RoleGuard>
        } />
        <Route path="/admin/subsidiaries" element={
          <RoleGuard roles={['system_admin']}><Subsidiaries /></RoleGuard>
        } />
        <Route path="/admin/mines" element={
          <RoleGuard roles={['system_admin']}><MineManagement /></RoleGuard>
        } />
        <Route path="/admin/compliance-templates" element={
          <RoleGuard roles={['system_admin']}>
            <div className="flex items-center justify-center h-64 text-slate-500">Compliance Templates — coming soon</div>
          </RoleGuard>
        } />

        {/* Inspector workflow */}
        <Route path="/inspector/my-mines" element={<Mines />} />
        <Route path="/inspector/inspection/:id" element={
          <RoleGuard roles={['system_admin', 'field_inspector', 'safety_officer']}>
            <InspectionFlow />
          </RoleGuard>
        } />
        <Route path="/inspections/new" element={
          <RoleGuard roles={['system_admin', 'field_inspector', 'safety_officer', 'corporate_regulatory_officer']}>
            <InspectionFlow />
          </RoleGuard>
        } />

        {/* Placeholder routes */}
        {['observations', 'evidence', 'documents', 'reports', 'contractors', 'compliance'].map(path => (
          <Route key={path} path={`/${path}`} element={
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-white font-semibold capitalize">{path}</p>
              <p className="text-slate-500 text-sm">This section is coming soon.</p>
            </div>
          } />
        ))}

      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <RBACProvider>
          <AppRoutes />
        </RBACProvider>
      </AuthProvider>
    </Router>
  )
}


export default App
