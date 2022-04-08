import { MarkOptional } from 'ts-essentials'

import { CourseType, RoleName } from '@app/types'

import type { AuthContextType } from './types'

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const allowedRoles = auth.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTTAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTTOps: () => allowedRoles.has(RoleName.TT_OPS),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

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

    canViewContacts: () => {
      const roles = [RoleName.TRAINER, RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canCreateCourse: (type: CourseType) => {
      if (auth.activeRole === RoleName.TT_ADMIN) {
        return true
      }

      if (
        auth.activeRole === RoleName.TT_OPS &&
        [CourseType.OPEN, CourseType.CLOSED].includes(type)
      ) {
        return true
      }

      if (
        auth.activeRole === RoleName.TRAINER &&
        type === CourseType.INDIRECT
      ) {
        return true
      }

      return false
    },
  })

  return { ...auth, acl }
}
