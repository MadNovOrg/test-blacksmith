import { MarkOptional } from 'ts-essentials'

import { CourseType, RoleName } from '@app/types'

import type { AuthContextType } from './types'

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const allowedRoles = auth.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => acl.isTTOps() || acl.isTTAdmin(),

    isTTOps: () => allowedRoles.has(RoleName.TT_OPS),

    isTTAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    isOrgAdmin: () => auth.isOrgAdmin,

    canViewMyOrganization: () => {
      const roles = [RoleName.USER]
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

    canViewCertifications: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewOrders: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewAllOrganizations: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewOrganizations: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canCreateCourse: (type: CourseType) => {
      switch (auth.activeRole) {
        case RoleName.TT_ADMIN:
          return true
        case RoleName.TT_OPS:
          return [CourseType.OPEN, CourseType.CLOSED].includes(type)
        case RoleName.TRAINER:
          return [CourseType.INDIRECT].includes(type)
      }

      return false
    },

    canAssignLeadTrainer: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canOverrideGrades: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },
    canViewXeroConnect: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },
  })

  return { ...auth, acl }
}
