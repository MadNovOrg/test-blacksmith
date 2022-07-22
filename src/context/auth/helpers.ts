import { RoleName } from '@app/types'

import cognitoToProfile from './cognitoToProfile'
import type { AuthState, CognitoUser } from './types'

// Roles allowed in switcher
export const ActiveRoles = new Set([
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
])

function getRequestedRole() {
  const params = new URLSearchParams(window.location.search)
  const requestedRole = params.get('role') as RoleName | null

  return requestedRole
}

export async function fetchUserProfile(
  user: CognitoUser
): Promise<Required<AuthState> | void> {
  try {
    const { profile, isOrgAdmin, claims, emailVerified } =
      await cognitoToProfile(user)

    if (!profile) {
      throw Error(`No profile for ${claims?.['x-hasura-user-id'] ?? 'unknown'}`)
    }

    const defaultRole = claims?.['x-hasura-default-role'] || RoleName.USER
    const claimsRoles = claims?.['x-hasura-allowed-roles'] ?? []
    const allowedRoles = new Set(claimsRoles.filter(r => ActiveRoles.has(r)))
    const lsActiveRole = lsActiveRoleClient(profile)
    const desiredRole = getRequestedRole() ?? lsActiveRole.get() ?? defaultRole
    const activeRole = allowedRoles.has(desiredRole) ? desiredRole : defaultRole
    lsActiveRole.set(activeRole)

    const orgIdsPgLiteral = claims?.['x-hasura-tt-organizations'] ?? '{}'

    return {
      profile,
      isOrgAdmin: isOrgAdmin ?? false,
      organizationIds: JSON.parse(`[${orgIdsPgLiteral.slice(1, -1)}]`),
      defaultRole,
      allowedRoles,
      activeRole,
      verified: emailVerified ?? false,
    }
  } catch (err) {
    console.error(err)
  }
}

export function lsActiveRoleClient({ id }: { id: string }) {
  const key = `auth-active-role-${id ?? ''}`
  return {
    key,
    get: () => (localStorage.getItem(key) ?? undefined) as RoleName | undefined,
    set: (role: RoleName) => localStorage.setItem(key, role),
  }
}
