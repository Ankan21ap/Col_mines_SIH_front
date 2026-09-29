import { useRBAC } from '../context/RBACContext.jsx'

/**
 * usePermission — Check a single permission with reason string
 * @param {string} permission
 * @returns {{ allowed: boolean, reason: string }}
 */
export function usePermission(permission) {
  const { can, user } = useRBAC()

  if (!user) return { allowed: false, reason: 'Not authenticated.' }

  const allowed = can(permission)
  const reason = allowed ? '' : `Your role (${user.role.replace(/_/g, ' ')}) does not have permission to perform this action.`

  return { allowed, reason }
}

/**
 * usePermissions — Check multiple permissions at once
 * @param {string[]} permissions
 * @returns {{ [key: string]: boolean }}
 */
export function usePermissions(permissions) {
  const { can } = useRBAC()
  return Object.fromEntries(permissions.map(p => [p, can(p)]))
}
