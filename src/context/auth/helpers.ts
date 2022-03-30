import type { CognitoUser, Profile, AuthState } from './types'
import cognitoToProfile from './cognitoToProfile'

import { RoleName } from '@app/types'

// Roles allowed in switcher
export const ActiveRoles = new Set([
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.ORG_ADMIN,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
])

export async function fetchUserProfile(
  user: CognitoUser
): Promise<Required<AuthState> | void> {
  try {
    const { profile, claims, token = '' } = await cognitoToProfile(user)

    if (!profile) {
      throw Error(`No profile for ${claims?.['x-hasura-user-id'] ?? 'unknown'}`)
    }

    const defaultRole = RoleName.USER
    const claimsRoles = claims?.['x-hasura-allowed-roles'] ?? []
    const allowedRoles = new Set(claimsRoles.filter(r => ActiveRoles.has(r)))
    const lsActiveRole = lsActiveRoleClient(profile)
    const lsRole = lsActiveRole.get() ?? defaultRole
    const activeRole = allowedRoles.has(lsRole) ? lsRole : defaultRole
    lsActiveRole.set(activeRole)

    const orgIdsPgLiteral = claims?.['x-hasura-tt-organizations'] ?? '{}'

    return {
      token,
      profile,
      organizationIds: JSON.parse(`[${orgIdsPgLiteral.slice(1, -1)}]`),
      defaultRole,
      allowedRoles,
      activeRole,
    }
  } catch (err) {
    console.error(err)
  }
}

export function lsActiveRoleClient({ id }: Profile) {
  const key = `auth-active-role-${id}`
  return {
    get: () => (localStorage.getItem(key) ?? undefined) as RoleName | undefined,
    set: (role: RoleName) => localStorage.setItem(key, role),
  }
}
