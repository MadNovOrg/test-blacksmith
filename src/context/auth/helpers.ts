import { isPast } from 'date-fns'

import { RoleName } from '@app/types'
import { expiryDateWithGracePeriod } from '@app/util'

import cognitoToProfile from './cognitoToProfile'
import type { AuthState, CognitoUser } from './types'

// Roles allowed in switcher
export const ActiveRoles = new Set([
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
  RoleName.LD,
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.FINANCE,
  RoleName.BOOKING_CONTACT,
  RoleName.ORGANIZATION_KEY_CONTACT,
])

function getRequestedRole() {
  const params = new URLSearchParams(window.location.search)
  const requestedRole = params.get('role') as RoleName | null

  return requestedRole
}

export function getQueryRole(
  activeRole: RoleName,
  allowedRoles: Set<RoleName>
) {
  if (
    activeRole === RoleName.USER &&
    allowedRoles.has(RoleName.BOOKING_CONTACT)
  ) {
    return RoleName.BOOKING_CONTACT
  } else if (
    activeRole === RoleName.USER &&
    allowedRoles.has(RoleName.ORGANIZATION_KEY_CONTACT)
  ) {
    return RoleName.ORGANIZATION_KEY_CONTACT
  }
  return activeRole
}

export async function fetchUserProfile(
  user: CognitoUser
): Promise<Required<AuthState> | void> {
  try {
    const { profile, isOrgAdmin, managedOrgIds, claims, emailVerified } =
      await cognitoToProfile(user)

    if (!profile) {
      throw Error(`No profile for ${claims?.['x-hasura-user-id'] ?? 'unknown'}`)
    }

    const defaultRole = claims?.['x-hasura-default-role'] || RoleName.USER
    const claimsRoles = claims?.['x-hasura-allowed-roles'] ?? []
    const claimsRolesSet = new Set(claimsRoles)
    const allowedRoles = new Set(claimsRoles.filter(r => ActiveRoles.has(r)))
    const lsActiveRole = lsActiveRoleClient(profile)
    const desiredRole = getRequestedRole() ?? lsActiveRole.get() ?? defaultRole
    const activeRole = allowedRoles.has(desiredRole) ? desiredRole : defaultRole
    lsActiveRole.set(activeRole)

    const orgIdsPgLiteral = claims?.['x-hasura-tt-organizations'] ?? '{}'

    const certificates = profile.certificates ?? []

    return {
      profile,
      isOrgAdmin: isOrgAdmin ?? false,
      managedOrgIds: managedOrgIds ?? [],
      organizationIds: JSON.parse(`[${orgIdsPgLiteral.slice(1, -1)}]`),
      defaultRole,
      claimsRoles: claimsRolesSet,
      allowedRoles,
      activeRole,
      queryRole: getQueryRole(activeRole, claimsRolesSet),
      verified: emailVerified ?? false,
      loggedOut: false,
      trainerRoles: profile.trainerRoles?.map(
        role => role.trainer_role_type.name
      ),
      certificates,
      activeCertificates: certificates
        .filter(
          c =>
            !isPast(
              expiryDateWithGracePeriod(c.courseLevel, new Date(c.expiryDate))
            )
        )
        .map(certificate => certificate.courseLevel),
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
