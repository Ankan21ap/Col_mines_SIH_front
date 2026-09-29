import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRBAC } from '../../context/RBACContext.jsx'

/**
 * RoleGuard — Route-level permission guard.
 * Redirects to /dashboard if role or permission check fails.
 *
 * @param {string|string[]} roles        — allowed roles (optional)
 * @param {string}          permission   — required permission (optional)
 * @param {string}          redirectTo   — where to redirect on failure
 */
export default function RoleGuard({ children, roles, permission, redirectTo = '/dashboard' }) {
  const { user, loading } = useAuth()
  const { hasRole, can } = useRBAC()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !hasRole(roles)) return <Navigate to={redirectTo} replace />

  if (permission && !can(permission)) return <Navigate to={redirectTo} replace />

  return children
}
