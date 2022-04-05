import { MarkOptional } from 'ts-essentials'

import { RoleName } from '@app/types'

import type { AuthContextType } from './types'

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const allowedRoles = auth.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTTAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTTOps: () => allowedRoles.has(RoleName.TT_OPS),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    canViewMyTraining: () => {
      const roles = [RoleName.USER]
      return roles.some(r => r === auth.activeRole)
    },

    canViewTrainerBase: () => {
      const roles = [RoleName.TRAINER]
      return roles.some(r => r === auth.activeRole)
    },

    canViewMyOrganization: () => {
      const roles = [RoleName.USER, RoleName.ORG_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewMembership: () => {
      const roles = [RoleName.USER, RoleName.TRAINER]
      return roles.some(r => r === auth.activeRole)
    },

    canViewAdmin: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },
  })

  return { ...auth, acl }
}
