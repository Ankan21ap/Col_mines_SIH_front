/**
 * Role Navigation Configuration
 * Defines which nav items each role can access.
 * Used by Sidebar.jsx and useRoleNav.js
 */

import { ROLES } from './permissions.js'

// ─── Nav Item Definitions ─────────────────────────────────────────────────────

const NAV_ITEMS = {
  OVERVIEW: {
    id: 'overview',
    label: 'Overview',
    path: '/dashboard',
    icon: 'dashboard',
  },
  USERS: {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: 'users',
  },
  ROLES_PERMISSIONS: {
    id: 'roles',
    label: 'Roles & Permissions',
    path: '/admin/roles',
    icon: 'shield',
  },
  SUBSIDIARIES: {
    id: 'subsidiaries',
    label: 'Subsidiaries',
    path: '/admin/subsidiaries',
    icon: 'building',
  },
  MINES_ADMIN: {
    id: 'mines-admin',
    label: 'Mines',
    path: '/admin/mines',
    icon: 'mine',
  },
  COMPLIANCE_TEMPLATES: {
    id: 'compliance-templates',
    label: 'Compliance Templates',
    path: '/admin/compliance-templates',
    icon: 'clipboard',
  },
  MY_MINES: {
    id: 'my-mines',
    label: 'My Mines',
    path: '/inspector/my-mines',
    icon: 'mine',
  },
  MINES: {
    id: 'mines',
    label: 'Mines',
    path: '/mines',
    icon: 'mine',
  },
  COMPLIANCE: {
    id: 'compliance',
    label: 'Compliance',
    path: '/compliance',
    icon: 'clipboard',
  },
  INSPECTIONS: {
    id: 'inspections',
    label: 'Inspections',
    path: '/inspections',
    icon: 'search',
  },
  OBSERVATIONS: {
    id: 'observations',
    label: 'Observations',
    path: '/observations',
    icon: 'eye',
  },
  VIOLATIONS: {
    id: 'violations',
    label: 'Violations',
    path: '/violations',
    icon: 'alert',
  },
  CORRECTIVE_ACTIONS: {
    id: 'actions',
    label: 'Corrective Actions',
    path: '/actions',
    icon: 'check-circle',
  },
  EVIDENCE: {
    id: 'evidence',
    label: 'Evidence',
    path: '/evidence',
    icon: 'camera',
  },
  DOCUMENTS: {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: 'file',
  },
  CONTRACTORS: {
    id: 'contractors',
    label: 'Contractors',
    path: '/contractors',
    icon: 'briefcase',
  },
  RISK_INTELLIGENCE: {
    id: 'risk',
    label: 'Risk Intelligence',
    path: '/risk',
    icon: 'brain',
  },
  GIS: {
    id: 'gis',
    label: 'GIS Map',
    path: '/gis',
    icon: 'map',
  },
  REPORTS: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'chart',
  },
  AUDIT_LOGS: {
    id: 'audit',
    label: 'Audit Logs',
    path: '/audit-logs',
    icon: 'list',
  },
  NOTIFICATIONS: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'bell',
  },
}

// ─── Role → Nav Items Mapping ─────────────────────────────────────────────────

export const ROLE_NAV_CONFIG = {
  [ROLES.SYSTEM_ADMIN]: [
    NAV_ITEMS.OVERVIEW,
    NAV_ITEMS.USERS,
    NAV_ITEMS.ROLES_PERMISSIONS,
    NAV_ITEMS.SUBSIDIARIES,
    NAV_ITEMS.MINES_ADMIN,
    NAV_ITEMS.COMPLIANCE_TEMPLATES,
    NAV_ITEMS.AUDIT_LOGS,
    NAV_ITEMS.NOTIFICATIONS,
  ],

  [ROLES.FIELD_INSPECTOR]: [
    NAV_ITEMS.OVERVIEW,
    NAV_ITEMS.MY_MINES,
    NAV_ITEMS.INSPECTIONS,
    NAV_ITEMS.OBSERVATIONS,
    NAV_ITEMS.VIOLATIONS,
    NAV_ITEMS.EVIDENCE,
    NAV_ITEMS.NOTIFICATIONS,
  ],

  [ROLES.SAFETY_OFFICER]: [
    NAV_ITEMS.OVERVIEW,
    NAV_ITEMS.MINES,
    NAV_ITEMS.COMPLIANCE,
    NAV_ITEMS.INSPECTIONS,
    NAV_ITEMS.OBSERVATIONS,
    NAV_ITEMS.VIOLATIONS,
    NAV_ITEMS.CORRECTIVE_ACTIONS,
    NAV_ITEMS.DOCUMENTS,
    NAV_ITEMS.CONTRACTORS,
    NAV_ITEMS.RISK_INTELLIGENCE,
    NAV_ITEMS.GIS,
    NAV_ITEMS.REPORTS,
    NAV_ITEMS.NOTIFICATIONS,
  ],

  [ROLES.MINE_MANAGER]: [
    NAV_ITEMS.OVERVIEW,
    NAV_ITEMS.MINES,
    NAV_ITEMS.COMPLIANCE,
    NAV_ITEMS.INSPECTIONS,
    NAV_ITEMS.VIOLATIONS,
    NAV_ITEMS.CORRECTIVE_ACTIONS,
    NAV_ITEMS.CONTRACTORS,
    NAV_ITEMS.DOCUMENTS,
    NAV_ITEMS.RISK_INTELLIGENCE,
    NAV_ITEMS.GIS,
    NAV_ITEMS.REPORTS,
    NAV_ITEMS.NOTIFICATIONS,
  ],

  [ROLES.CORPORATE_REGULATORY_OFFICER]: [
    NAV_ITEMS.OVERVIEW,
    NAV_ITEMS.MINES,
    NAV_ITEMS.COMPLIANCE,
    NAV_ITEMS.INSPECTIONS,
    NAV_ITEMS.VIOLATIONS,
    NAV_ITEMS.CORRECTIVE_ACTIONS,
    NAV_ITEMS.CONTRACTORS,
    NAV_ITEMS.DOCUMENTS,
    NAV_ITEMS.RISK_INTELLIGENCE,
    NAV_ITEMS.GIS,
    NAV_ITEMS.REPORTS,
    NAV_ITEMS.AUDIT_LOGS,
    NAV_ITEMS.NOTIFICATIONS,
  ],
}

export { NAV_ITEMS }
