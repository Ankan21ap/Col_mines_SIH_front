import React from 'react'
import { useRBAC } from '../../context/RBACContext.jsx'
import DisabledAction from './DisabledAction.jsx'

/**
 * PermissionGate
 * Conditionally renders children based on a permission check.
 * If denied, renders a DisabledAction message — never silently hides unless silent=true.
 *
 * @param {string}  permission  — e.g. 'create:inspection'
 * @param {string}  reason      — custom reason text (optional)
 * @param {boolean} silent      — if true, renders nothing when denied (use sparingly)
 * @param {node}    fallback    — custom fallback component
 */
export default function PermissionGate({ permission, children, reason, silent = false, fallback }) {
  const { can, user } = useRBAC()

  const allowed = permission ? can(permission) : true

  if (allowed) return children

  if (silent) return null

  if (fallback) return fallback

  const defaultReason = reason || `Your role does not have permission to perform this action.`

  return <DisabledAction reason={defaultReason} />
}
