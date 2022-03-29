import { MarkOptional } from 'ts-essentials'

import type { AuthContextType } from './types'

import { RoleName } from '@app/types'

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const allowedRoles = auth.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => allowedRoles.has(RoleName.ADMIN),

    isTTAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTTOps: () => allowedRoles.has(RoleName.TT_OPS),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    canViewMyTraining: () => {
      const roles = [RoleName.USER]
      return roles.some(r => allowedRoles.has(r))
    },

    canViewTrainerBase: () => {
      const roles = [RoleName.TRAINER]
      return roles.some(r => allowedRoles.has(r))
    },

    canViewMyOrganization: () => {
      const roles = [RoleName.USER, RoleName.ORG_ADMIN]
      return roles.some(r => allowedRoles.has(r))
    },

    canViewMembership: () => {
      const roles = [RoleName.USER, RoleName.TRAINER]
      return roles.some(r => allowedRoles.has(r))
    },

    canViewAdmin: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN, RoleName.ADMIN]
      return roles.some(r => allowedRoles.has(r))
    },
  })

  return { ...auth, acl }
}
