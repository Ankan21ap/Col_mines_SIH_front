import React, { createContext, useContext, useState, useEffect } from 'react'
import { ROLE_PERMISSIONS, ROLES } from '../utils/permissions.js'
import { DEMO_USERS, MOCK_MINES } from '../utils/mockData.js'
import { authApi } from '../api/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      // 1. Check local storage or session storage for saved user
      const savedUserStr = localStorage.getItem('coalgov_user') || sessionStorage.getItem('coal_demo_user')
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr)
          const enriched = enrichUserWithMines(parsed)
          setUser(enriched)
          setPermissions(ROLE_PERMISSIONS[parsed.role] || [])
          setLoading(false)
          return
        } catch (e) {
          console.error('Failed to restore user from storage', e)
        }
      }

      // 2. Real API mode — restore from localStorage token if real backend exists
      const token = localStorage.getItem('coalgov_token')
      if (!token || token.startsWith('demo_token')) {
        setLoading(false)
        return
      }

      try {
        const { data } = await authApi.getMe()
        const { user: u, permissions: perms } = data.data
        const enriched = enrichUserWithMines(u)
        setUser(enriched)
        setPermissions(perms || ROLE_PERMISSIONS[u.role] || [])
      } catch {
        localStorage.removeItem('coalgov_token')
        localStorage.removeItem('coalgov_user')
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  /**
   * login — supports both Demo credentials and Real backend API
   */
  const login = async (credentialsOrDemoUser) => {
    setLoading(true)
    try {
      // Find matching demo user by email or role
      let matchingDemoUser = null
      if (credentialsOrDemoUser?.role) {
        matchingDemoUser = DEMO_USERS.find(u => u.role === credentialsOrDemoUser.role)
      }

      if (!matchingDemoUser && credentialsOrDemoUser?.email) {
        const emailLower = credentialsOrDemoUser.email.toLowerCase().trim()
        matchingDemoUser = DEMO_USERS.find(u => u.email.toLowerCase().trim() === emailLower)
      }

      // If credentials match a demo user account, log them in directly
      if (matchingDemoUser) {
        const enriched = enrichUserWithMines(matchingDemoUser)
        setUser(enriched)
        const perms = ROLE_PERMISSIONS[matchingDemoUser.role] || []
        setPermissions(perms)

        localStorage.setItem('coalgov_token', `demo_token_${matchingDemoUser.role}`)
        localStorage.setItem('coalgov_user', JSON.stringify(enriched))
        sessionStorage.setItem('coal_demo_user', JSON.stringify(enriched))
        return { success: true, user: enriched }
      }

      // Otherwise attempt real backend API
      try {
        const { data } = await authApi.login(credentialsOrDemoUser)
        const { token, user: u, permissions: perms } = data.data

        localStorage.setItem('coalgov_token', token)
        localStorage.setItem('coalgov_user', JSON.stringify(u))

        const enriched = enrichUserWithMines(u)
        setUser(enriched)
        setPermissions(perms || ROLE_PERMISSIONS[u.role] || [])
        return { success: true, user: enriched }
      } catch (backendErr) {
        const message = backendErr.response?.data?.message || 'Invalid officer credentials. Please check your email and password.'
        return { success: false, message }
      }
    } catch (err) {
      return { success: false, message: 'Authentication failed. Please try again.' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setPermissions([])
    localStorage.removeItem('coalgov_token')
    localStorage.removeItem('coalgov_user')
    sessionStorage.removeItem('coal_demo_user')
  }

  /**
   * switchRole — Switch between demo roles
   */
  const switchRole = (role) => {
    const demoUser = DEMO_USERS.find(u => u.role === role)
    if (demoUser) {
      const enriched = enrichUserWithMines(demoUser)
      setUser(enriched)
      setPermissions(ROLE_PERMISSIONS[demoUser.role] || [])
      localStorage.setItem('coalgov_token', `demo_token_${demoUser.role}`)
      localStorage.setItem('coalgov_user', JSON.stringify(enriched))
      sessionStorage.setItem('coal_demo_user', JSON.stringify(enriched))
    }
  }

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout, switchRole, isDemoMode: true }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// ── Helper: enrich user with accessible mines ─────────────────────────────────
function enrichUserWithMines(user) {
  const GLOBAL_ROLES = [ROLES.SYSTEM_ADMIN, ROLES.CORPORATE_REGULATORY_OFFICER, ROLES.SAFETY_OFFICER]

  if (GLOBAL_ROLES.includes(user.role)) {
    return { ...user, accessibleMines: user.assignedMines?.length ? user.assignedMines : MOCK_MINES }
  }

  if (user.assignedMines?.length && typeof user.assignedMines[0] === 'object') {
    return { ...user, accessibleMines: user.assignedMines }
  }

  const accessibleMines = user.assignedMines?.length
    ? MOCK_MINES.filter(m => user.assignedMines.includes(m.id))
    : MOCK_MINES
  return { ...user, accessibleMines }
}
