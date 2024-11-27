import axios from 'axios'
import { isPast } from 'date-fns'
import Cookies from 'js-cookie'

import { HubspotApiFormData, RoleName } from '@app/types'
import { expiryDateWithGracePeriod } from '@app/util'

import cognitoToProfile from './cognitoToProfile'
import { insertHubspotAudit } from './hooks/useHubspotAudit'
import { AuthMode, AuthState, CognitoUser, Profile } from './types'

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

export const userToHubspotContact = (
  profile: Partial<Profile>,
): HubspotApiFormData => {
  return {
    submittedAt: new Date().getTime(),
    fields: [
      {
        objectTypeId: '0-1',
        name: 'email',
        value: profile.email,
      },
      profile.id && {
        objectTypeId: '0-1',
        name: 'hub_id',
        value: profile.id,
      },
      profile.givenName && {
        objectTypeId: '0-1',
        name: 'firstname',
        value: profile.givenName,
      },
      profile.familyName && {
        objectTypeId: '0-1',
        name: 'lastname',
        value: profile.familyName,
      },
      profile.jobTitle && {
        objectTypeId: '0-1',
        name: 'jobtitle',
        value: profile.jobTitle,
      },
      profile.phone && {
        objectTypeId: '0-1',
        name: 'phone',
        value: profile.phone,
      },
      profile.dob && {
        objectTypeId: '0-1',
        name: 'date_of_birth',
        value: profile.dob,
      },
    ].filter(Boolean) as HubspotApiFormData['fields'],
    context: {
      hutk: Cookies.get('hubspotutk') || '',
      pageUri: location.origin,
      pageName: document.title,
    },
  }
}

export const handleHubspotFormSubmit = async ({
  profile,
  userJWT,
  authMode,
}: {
  profile: Partial<Profile>
  userJWT: string
  authMode: AuthMode
}) => {
  const hubspotEndpoint: Record<AuthMode, string> = {
    [AuthMode.LOGIN]: import.meta.env.VITE_HUBSPOT_LOGIN_FORM,
    [AuthMode.REGISTER]: import.meta.env.VITE_HUBSPOT_REGISTER_FORM,
  }

  try {
    axios.post<HubspotApiFormData>(hubspotEndpoint[authMode], {
      ...userToHubspotContact(profile),
    }),
      await insertHubspotAudit(
        {
          profile_id: profile.id ?? null,
          hubspot_cookie: Cookies.get('hubspotutk'),
          authentication_mode: authMode,
          status: 'SUCCESS',
          page_details: {
            pageUri: location.origin,
            pageName: document.title,
          },
        },
        userJWT,
      )
  } catch (err) {
    await insertHubspotAudit(
      {
        profile_id: profile.id,
        error: JSON.stringify(err),
        hubspot_cookie: Cookies.get('hubspotutk'),
        authentication_mode: authMode,
        status: 'FAILED',
        page_details: {
          pageUri: location.origin,
          pageName: document.title,
        },
      },
      userJWT,
    )
  }
}
