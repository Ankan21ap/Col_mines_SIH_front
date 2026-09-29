/**
 * RBAC Permission Definitions
 * Single source of truth for role-to-permission mapping.
 * Backend permissions always take precedence — these are defaults & display layer.
 */

export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  FIELD_INSPECTOR: 'field_inspector',
  SAFETY_OFFICER: 'safety_officer',
  MINE_MANAGER: 'mine_manager',
  CORPORATE_REGULATORY_OFFICER: 'corporate_regulatory_officer',
}

export const ROLE_LABELS = {
  [ROLES.SYSTEM_ADMIN]: 'System Admin',
  [ROLES.FIELD_INSPECTOR]: 'Field Inspector',
  [ROLES.SAFETY_OFFICER]: 'Safety Officer',
  [ROLES.MINE_MANAGER]: 'Mine Manager',
  [ROLES.CORPORATE_REGULATORY_OFFICER]: 'Corporate & Regulatory Management Officer',
}

export const ROLE_COLORS = {
  [ROLES.SYSTEM_ADMIN]: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/40' },
  [ROLES.FIELD_INSPECTOR]: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
  [ROLES.SAFETY_OFFICER]: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40' },
  [ROLES.MINE_MANAGER]: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  [ROLES.CORPORATE_REGULATORY_OFFICER]: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40' },
}

// ─── Permission Keys ─────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view:dashboard',

  // User Management
  MANAGE_USERS: 'manage:users',
  CREATE_USER: 'create:user',
  EDIT_USER: 'edit:user',
  DELETE_USER: 'delete:user',
  RESET_USER_ACCESS: 'reset:user_access',

  // Role Management
  MANAGE_ROLES: 'manage:roles',

  // Organization
  MANAGE_SUBSIDIARIES: 'manage:subsidiaries',
  MANAGE_MINES: 'manage:mines',
  VIEW_MINES: 'view:mines',
  VIEW_ASSIGNED_MINES_ONLY: 'view:assigned_mines_only',

  // Compliance
  MANAGE_COMPLIANCE_RULES: 'manage:compliance_rules',
  VIEW_COMPLIANCE: 'view:compliance',

  // Inspections
  CREATE_INSPECTION: 'create:inspection',
  VIEW_INSPECTIONS: 'view:inspections',
  EDIT_INSPECTION: 'edit:inspection',

  // Observations
  SUBMIT_OBSERVATION: 'submit:observation',
  VIEW_OBSERVATIONS: 'view:observations',
  VERIFY_OBSERVATION: 'verify:observation',

  // Violations
  CREATE_VIOLATION: 'create:violation',
  VIEW_VIOLATIONS: 'view:violations',
  EDIT_VIOLATION: 'edit:violation',
  CHANGE_VIOLATION_SEVERITY: 'change:violation_severity',

  // Corrective Actions
  CREATE_CORRECTIVE_ACTION: 'create:corrective_action',
  VIEW_CORRECTIVE_ACTIONS: 'view:corrective_actions',
  EDIT_CORRECTIVE_ACTION: 'edit:corrective_action',
  APPROVE_CORRECTIVE_ACTION: 'approve:corrective_action',

  // Evidence
  UPLOAD_EVIDENCE: 'upload:evidence',
  VERIFY_EVIDENCE: 'verify:evidence',
  CAPTURE_GPS: 'capture:gps',

  // Risk Intelligence
  VIEW_AI_RISK: 'view:ai_risk',
  VIEW_AI_RISK_ASSIGNED: 'view:ai_risk_assigned',
  VIEW_ANALYTICS: 'view:analytics',
  VIEW_GIS: 'view:gis',

  // Audit
  VIEW_AUDIT_TRAIL: 'view:audit_trail',
  VIEW_AUDIT_TRAIL_LIMITED: 'view:audit_trail_limited',
  DELETE_AUDIT_ENTRY: 'delete:audit_entry',

  // Documents
  VIEW_DOCUMENTS: 'view:documents',
  UPLOAD_DOCUMENT: 'upload:document',

  // Reports
  VIEW_REPORTS: 'view:reports',
  GENERATE_REPORT: 'generate:report',
  APPROVE_REPORT: 'approve:report',

  // Contractors
  VIEW_CONTRACTORS: 'view:contractors',
  MANAGE_CONTRACTORS: 'manage:contractors',

  // Remarks & Approvals
  ADD_MANAGEMENT_REMARKS: 'add:management_remarks',
  ADD_REGULATORY_REMARKS: 'add:regulatory_remarks',
  ESCALATE_ISSUE: 'escalate:issue',
}

// ─── Role Permission Sets ────────────────────────────────────────────────────

export const ROLE_PERMISSIONS = {
  [ROLES.SYSTEM_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.RESET_USER_ACCESS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_SUBSIDIARIES,
    PERMISSIONS.MANAGE_MINES,
    PERMISSIONS.VIEW_MINES,
    PERMISSIONS.MANAGE_COMPLIANCE_RULES,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.CREATE_INSPECTION,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.EDIT_INSPECTION,
    PERMISSIONS.SUBMIT_OBSERVATION,
    PERMISSIONS.VIEW_OBSERVATIONS,
    PERMISSIONS.VERIFY_OBSERVATION,
    PERMISSIONS.CREATE_VIOLATION,
    PERMISSIONS.VIEW_VIOLATIONS,
    PERMISSIONS.EDIT_VIOLATION,
    PERMISSIONS.CHANGE_VIOLATION_SEVERITY,
    PERMISSIONS.CREATE_CORRECTIVE_ACTION,
    PERMISSIONS.VIEW_CORRECTIVE_ACTIONS,
    PERMISSIONS.EDIT_CORRECTIVE_ACTION,
    PERMISSIONS.APPROVE_CORRECTIVE_ACTION,
    PERMISSIONS.UPLOAD_EVIDENCE,
    PERMISSIONS.VERIFY_EVIDENCE,
    PERMISSIONS.CAPTURE_GPS,
    PERMISSIONS.VIEW_AI_RISK,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_GIS,
    PERMISSIONS.VIEW_AUDIT_TRAIL,
    PERMISSIONS.DELETE_AUDIT_ENTRY,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.UPLOAD_DOCUMENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.APPROVE_REPORT,
    PERMISSIONS.VIEW_CONTRACTORS,
    PERMISSIONS.MANAGE_CONTRACTORS,
    PERMISSIONS.ADD_MANAGEMENT_REMARKS,
    PERMISSIONS.ADD_REGULATORY_REMARKS,
    PERMISSIONS.ESCALATE_ISSUE,
  ],

  [ROLES.FIELD_INSPECTOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_MINES_ONLY,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.CREATE_INSPECTION,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.SUBMIT_OBSERVATION,
    PERMISSIONS.VIEW_OBSERVATIONS,
    PERMISSIONS.CREATE_VIOLATION,
    PERMISSIONS.VIEW_VIOLATIONS,
    PERMISSIONS.UPLOAD_EVIDENCE,
    PERMISSIONS.CAPTURE_GPS,
    PERMISSIONS.VIEW_AI_RISK_ASSIGNED,
    PERMISSIONS.VIEW_AUDIT_TRAIL_LIMITED,
    PERMISSIONS.VIEW_CORRECTIVE_ACTIONS,
  ],

  [ROLES.SAFETY_OFFICER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MINES,
    PERMISSIONS.MANAGE_COMPLIANCE_RULES,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.CREATE_INSPECTION,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.EDIT_INSPECTION,
    PERMISSIONS.SUBMIT_OBSERVATION,
    PERMISSIONS.VIEW_OBSERVATIONS,
    PERMISSIONS.VERIFY_OBSERVATION,
    PERMISSIONS.CREATE_VIOLATION,
    PERMISSIONS.VIEW_VIOLATIONS,
    PERMISSIONS.EDIT_VIOLATION,
    PERMISSIONS.CHANGE_VIOLATION_SEVERITY,
    PERMISSIONS.CREATE_CORRECTIVE_ACTION,
    PERMISSIONS.VIEW_CORRECTIVE_ACTIONS,
    PERMISSIONS.EDIT_CORRECTIVE_ACTION,
    PERMISSIONS.UPLOAD_EVIDENCE,
    PERMISSIONS.VERIFY_EVIDENCE,
    PERMISSIONS.CAPTURE_GPS,
    PERMISSIONS.VIEW_AI_RISK,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_GIS,
    PERMISSIONS.VIEW_AUDIT_TRAIL,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.UPLOAD_DOCUMENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.VIEW_CONTRACTORS,
    PERMISSIONS.ESCALATE_ISSUE,
  ],

  [ROLES.MINE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MINES,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.VIEW_OBSERVATIONS,
    PERMISSIONS.VERIFY_OBSERVATION,
    PERMISSIONS.VIEW_VIOLATIONS,
    PERMISSIONS.CREATE_CORRECTIVE_ACTION,
    PERMISSIONS.VIEW_CORRECTIVE_ACTIONS,
    PERMISSIONS.EDIT_CORRECTIVE_ACTION,
    PERMISSIONS.APPROVE_CORRECTIVE_ACTION,
    PERMISSIONS.VERIFY_EVIDENCE,
    PERMISSIONS.VIEW_AI_RISK,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_GIS,
    PERMISSIONS.VIEW_AUDIT_TRAIL,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.UPLOAD_DOCUMENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.VIEW_CONTRACTORS,
    PERMISSIONS.MANAGE_CONTRACTORS,
    PERMISSIONS.ADD_MANAGEMENT_REMARKS,
  ],

  [ROLES.CORPORATE_REGULATORY_OFFICER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MINES,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.VIEW_INSPECTIONS,
    PERMISSIONS.VIEW_OBSERVATIONS,
    PERMISSIONS.VERIFY_OBSERVATION,
    PERMISSIONS.VIEW_VIOLATIONS,
    PERMISSIONS.VIEW_CORRECTIVE_ACTIONS,
    PERMISSIONS.APPROVE_CORRECTIVE_ACTION,
    PERMISSIONS.VERIFY_EVIDENCE,
    PERMISSIONS.VIEW_AI_RISK,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_GIS,
    PERMISSIONS.VIEW_AUDIT_TRAIL,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.APPROVE_REPORT,
    PERMISSIONS.VIEW_CONTRACTORS,
    PERMISSIONS.ADD_MANAGEMENT_REMARKS,
    PERMISSIONS.ADD_REGULATORY_REMARKS,
    PERMISSIONS.ESCALATE_ISSUE,
  ],
}

// ─── Permission Display Categories (for Permission Matrix) ───────────────────

export const PERMISSION_CATEGORIES = [
  {
    label: 'System',
    permissions: [
      { key: PERMISSIONS.MANAGE_USERS, label: 'Manage Users' },
      { key: PERMISSIONS.MANAGE_ROLES, label: 'Manage Roles' },
      { key: PERMISSIONS.MANAGE_SUBSIDIARIES, label: 'Manage Subsidiaries' },
      { key: PERMISSIONS.MANAGE_MINES, label: 'Manage Mines' },
    ],
  },
  {
    label: 'Compliance',
    permissions: [
      { key: PERMISSIONS.MANAGE_COMPLIANCE_RULES, label: 'Manage Compliance Rules' },
      { key: PERMISSIONS.CREATE_INSPECTION, label: 'Create Inspection' },
      { key: PERMISSIONS.CREATE_VIOLATION, label: 'Create Violation' },
      { key: PERMISSIONS.CREATE_CORRECTIVE_ACTION, label: 'Create Corrective Action' },
      { key: PERMISSIONS.APPROVE_CORRECTIVE_ACTION, label: 'Approve Corrective Action' },
      { key: PERMISSIONS.CHANGE_VIOLATION_SEVERITY, label: 'Change Violation Severity' },
    ],
  },
  {
    label: 'Verification',
    permissions: [
      { key: PERMISSIONS.VERIFY_EVIDENCE, label: 'Verify Evidence' },
      { key: PERMISSIONS.VERIFY_OBSERVATION, label: 'Verify Observation' },
    ],
  },
  {
    label: 'Intelligence',
    permissions: [
      { key: PERMISSIONS.VIEW_AI_RISK, label: 'View AI Risk' },
      { key: PERMISSIONS.VIEW_ANALYTICS, label: 'View Analytics' },
      { key: PERMISSIONS.VIEW_GIS, label: 'View GIS' },
    ],
  },
  {
    label: 'Audit & Reports',
    permissions: [
      { key: PERMISSIONS.VIEW_AUDIT_TRAIL, label: 'View Audit Trail' },
      { key: PERMISSIONS.GENERATE_REPORT, label: 'Generate Reports' },
      { key: PERMISSIONS.APPROVE_REPORT, label: 'Approve Reports' },
    ],
  },
]

// ─── Role Permission Preview (for Create User wizard) ────────────────────────

export const ROLE_PERMISSION_PREVIEW = {
  [ROLES.FIELD_INSPECTOR]: {
    allowed: [
      'Create inspections',
      'Submit observations',
      'Upload evidence',
      'Capture GPS coordinates',
      'View assigned mines',
      'Create violations',
    ],
    denied: [
      'Manage users',
      'Change compliance rules',
      'Approve corrective actions',
      'Verify evidence',
      'Access other mines',
      'Delete audit entries',
    ],
  },
  [ROLES.SAFETY_OFFICER]: {
    allowed: [
      'Create & edit inspections',
      'Create & verify violations',
      'Manage compliance rules',
      'Verify field observations',
      'Create corrective actions',
      'Change violation severity',
      'View all mines',
    ],
    denied: [
      'Manage users',
      'Delete audit entries',
      'Approve reports',
    ],
  },
  [ROLES.MINE_MANAGER]: {
    allowed: [
      'View mine compliance status',
      'Create & approve corrective actions',
      'Verify evidence',
      'View risk intelligence',
      'Manage contractors',
      'Add management remarks',
    ],
    denied: [
      'Manage users',
      'Create inspections',
      'Create violations',
      'Edit original inspection records',
    ],
  },
  [ROLES.CORPORATE_REGULATORY_OFFICER]: {
    allowed: [
      'View all-mine dashboard & analytics',
      'View GIS risk map & AI risk scores',
      'View compliance & inspection records',
      'View violations & corrective actions',
      'View production & contractor performance',
      'View escalations & notifications',
      'View regulatory & management reports',
      'View audit trail & supporting documents',
      'Add corporate management decisions',
      'Add management comments',
      'Add regulatory observations & directives',
      'Approve & verify compliance status',
      'Approve & certify regulatory reports',
    ],
    denied: [
      'Modify original field inspection records',
      'Change/delete original evidence or mine records',
      'Manage users or system configuration',
      'Change AI risk calculations',
    ],
  },
  [ROLES.SYSTEM_ADMIN]: {
    allowed: [
      'Full system access',
      'Manage all users & roles',
      'Manage subsidiaries & mines',
      'All compliance operations',
      'Audit trail management',
    ],
    denied: [],
  },
}
