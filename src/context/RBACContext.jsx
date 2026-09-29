import React, { createContext, useContext, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'
import { ROLES, ROLE_LABELS } from '../utils/permissions.js'

const RBACContext = createContext(null)

/**
 * RBACContext — The Permission Engine
 * 
 * Central point for all permission checks in the UI.
 * Never check permissions directly from useAuth() in components.
 * Always use can(), canAny(), canAll(), or the PermissionGate component.
 */
export function RBACProvider({ children }) {
  const { user, permissions } = useAuth()

  const rbac = useMemo(() => {
    const permSet = new Set(permissions)

    /**
     * can — Check if user has a specific permission
     * @param {string} permission — e.g. 'create:inspection'
     * @returns {boolean}
     */
    const can = (permission) => {
      if (!user) return false
      return permSet.has(permission)
    }

    /**
     * canAny — Check if user has at least one of the permissions
     * @param {string[]} permissionList
     * @returns {boolean}
     */
    const canAny = (permissionList) => {
      if (!user) return false
      return permissionList.some(p => permSet.has(p))
    }

    /**
     * canAll — Check if user has all of the permissions
     * @param {string[]} permissionList
     * @returns {boolean}
     */
    const canAll = (permissionList) => {
      if (!user) return false
      return permissionList.every(p => permSet.has(p))
    }

    /**
     * hasRole — Check if user has a specific role
     * @param {string|string[]} role
     * @returns {boolean}
     */
    const hasRole = (role) => {
      if (!user) return false
      if (Array.isArray(role)) return role.includes(user.role)
      return user.role === role
    }

    /**
     * canAccessMine — Check if user can access a specific mine
     * @param {string} mineId
     * @returns {boolean}
     */
    const canAccessMine = (mineId) => {
      if (!user) return false
      // Admins and corporate & regulatory management officers can access all mines
      if ([ROLES.SYSTEM_ADMIN, ROLES.CORPORATE_REGULATORY_OFFICER].includes(user.role)) {
        return true
      }
      // Others can only access their assigned mines
      return user.assignedMines?.includes(mineId) || false
    }

    /**
     * accessibleMines — Returns the list of mines the user can access
     */
    const accessibleMines = user?.accessibleMines || []

    /**
     * roleLabel — Human-readable role name
     */
    const roleLabel = user ? ROLE_LABELS[user.role] || user.role : ''

    return { can, canAny, canAll, hasRole, canAccessMine, accessibleMines, roleLabel, user }
  }, [user, permissions])

  return (
    <RBACContext.Provider value={rbac}>
      {children}
    </RBACContext.Provider>
  )
}

export function useRBAC() {
  const ctx = useContext(RBACContext)
  if (!ctx) throw new Error('useRBAC must be used within RBACProvider')
  return ctx
}
