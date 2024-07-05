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

export async function fetchUserProfile(
  user: CognitoUser,
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

    const individualAllowedRoles = new Set(
      claimsRoles.filter(r =>
        Boolean(
          [
            RoleName.BOOKING_CONTACT,
            RoleName.ORGANIZATION_KEY_CONTACT,
          ].includes(r),
        ),
      ),
    ) as Set<RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT>

    const defaultIndividualRole =
      individualAllowedRoles.size > 0 ? [...individualAllowedRoles][0] : null

    const lsActiveRole = lsActiveRoleClient(profile)
    let desiredRole = getRequestedRole() ?? lsActiveRole.get() ?? defaultRole

    /**
     * For the case when user has an individual sub role, no org admin and the user
     * role is saved in local storage. When an user has an individual user has a sub role and
     * isn't org admin the active role should not be RoleName.USER
     */

    if (desiredRole === RoleName.USER && !isOrgAdmin) {
      desiredRole = defaultIndividualRole ?? desiredRole
    }

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
      individualAllowedRoles,
      activeRole,
      queryRole: activeRole,
      verified: emailVerified ?? false,
      loggedOut: false,
      trainerRoles: profile.trainerRoles?.map(
        role => role.trainer_role_type.name,
      ),
      certificates,
      activeCertificates: certificates
        .filter(
          c =>
            !isPast(
              expiryDateWithGracePeriod(c.courseLevel, new Date(c.expiryDate)),
            ),
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
