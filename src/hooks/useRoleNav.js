import { useRBAC } from '../context/RBACContext.jsx'
import { ROLE_NAV_CONFIG } from '../utils/roleConfig.js'

/**
 * useRoleNav — Returns nav items filtered for the current user's role
 */
export function useRoleNav() {
  const { user } = useRBAC()
  if (!user) return []
  return ROLE_NAV_CONFIG[user.role] || []
}
