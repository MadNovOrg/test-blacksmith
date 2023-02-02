import { MarkOptional } from 'ts-essentials'

import { CourseType, RoleName } from '@app/types'

import type { ACL, AuthContextType } from './types'

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const allowedRoles = auth.allowedRoles ?? new Set()

  const acl: ACL = Object.freeze({
    isAdmin: () => acl.isTTOps() || acl.isTTAdmin() || acl.isLD(),

    isTTOps: () => allowedRoles.has(RoleName.TT_OPS),

    isTTAdmin: () => allowedRoles.has(RoleName.TT_ADMIN),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    isLD: () => allowedRoles.has(RoleName.LD),

    isOrgAdmin: () => auth.isOrgAdmin,

    canViewMyOrganization: () => {
      const roles = [RoleName.USER]
      return roles.some(r => r === auth.activeRole)
    },

    canApproveCourseExceptions: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.LD]
      return roles.some(r => r === auth.activeRole)
    },

    canViewMembership: () => {
      const roles = [RoleName.USER, RoleName.TRAINER]
      return roles.some(r => r === auth.activeRole)
    },

    canViewAdmin: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewContacts: () => {
      const roles = [
        RoleName.TRAINER,
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewCertifications: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewOrders: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewProfiles: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewEmailContacts: (courseType: CourseType) => {
      const can =
        auth.activeRole !== RoleName.TRAINER ||
        courseType === CourseType.INDIRECT

      return can
    },

    canInviteAttendees: (courseType: CourseType) => {
      const can =
        auth.activeRole !== RoleName.TRAINER ||
        courseType === CourseType.INDIRECT

      return can
    },

    canViewAllOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canCreateCourses: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.TRAINER,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canCreateCourse: (type: CourseType) => {
      switch (auth.activeRole) {
        case RoleName.TT_ADMIN:
          return true
        case RoleName.LD:
        case RoleName.TT_OPS:
          return [CourseType.OPEN, CourseType.CLOSED].includes(type)
        case RoleName.SALES_ADMIN: {
          return [CourseType.CLOSED].includes(type)
        }
        case RoleName.TRAINER:
          return [CourseType.INDIRECT].includes(type)
      }

      return false
    },

    canAssignLeadTrainer: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.LD,
      ]
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
    canCreateOrgs: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canCancelCourses: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canManageOrgCourses: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canSeeWaitingLists: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === auth.activeRole)
    },
    canRescheduleWithoutWarning: () => {
      if (auth.activeRole) {
        return [RoleName.TT_ADMIN, RoleName.TT_OPS].includes(auth.activeRole)
      }

      return false
    },

    canEditWithoutRestrictions: (courseType: CourseType) => {
      if (!auth.activeRole) {
        return false
      }

      if (auth.activeRole === RoleName.TT_ADMIN) {
        return true
      }

      switch (courseType) {
        case CourseType.INDIRECT: {
          return false
        }

        case CourseType.CLOSED: {
          return [RoleName.TT_OPS].includes(auth.activeRole)
        }
      }

      return false
    },
    canViewResources: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.USER, RoleName.TRAINER]
      return roles.some(r => r === auth.activeRole)
    },
    canViewCourseHistory: () => {
      return RoleName.TT_ADMIN === auth.activeRole
    },

    canParticipateInCourses: () => {
      const roles = [RoleName.USER, RoleName.TRAINER]
      return roles.some(r => r === auth.activeRole)
    },
  })

  return { ...auth, acl }
}
