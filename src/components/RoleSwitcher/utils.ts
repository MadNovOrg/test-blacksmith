import { cond, constant, matches, stubTrue } from 'lodash-es'

import { RoleName } from '@app/types'

export type RegularUserRolesInfo = {
  activeRole?: RoleName
  only?: boolean
  isOrgAdmin?: boolean
}

export const mapRegularUserRoleIntoDisplayed = cond([
  [
    matches({
      activeRole: RoleName.BOOKING_CONTACT,
      only: true,
      isOrgAdmin: false,
    }),
    constant('components.role-switcher.user'),
  ],
  [
    matches({
      activeRole: RoleName.ORGANIZATION_KEY_CONTACT,
      only: true,
      isOrgAdmin: false,
    }),
    constant('components.role-switcher.user'),
  ],
  [
    matches({ activeRole: RoleName.USER, only: true, isOrgAdmin: true }),
    constant('components.role-switcher.user'),
  ],
  [
    matches({ activeRole: RoleName.USER, only: false, isOrgAdmin: true }),
    constant('components.role-switcher.organization-admin'),
  ],
  [stubTrue, constant(undefined)],
])
