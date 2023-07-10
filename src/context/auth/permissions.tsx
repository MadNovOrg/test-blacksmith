import { MarkOptional } from 'ts-essentials'

import { Accreditors_Enum } from '@app/generated/graphql'
import {
  CourseLevel,
  CourseTrainerType,
  CourseType,
  RoleName,
} from '@app/types'

import type { AuthContextType } from './types'

export function getACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const activeRole = auth.activeRole
  const allowedRoles = auth.allowedRoles
  const activeCertificates = auth.activeCertificates ?? []
  const managedOrgIds = auth.managedOrgIds ?? []

  const acl = Object.freeze({
    isAdmin: () => acl.isTTOps() || acl.isTTAdmin() || acl.isLD(),

    isTTOps: () => activeRole === RoleName.TT_OPS,

    isTTAdmin: () => activeRole === RoleName.TT_ADMIN,

    isSalesRepresentative: () => activeRole === RoleName.SALES_REPRESENTATIVE,

    isFinance: () => activeRole === RoleName.FINANCE,

    isSalesAdmin: () => activeRole === RoleName.SALES_ADMIN,

    isTrainer: () => activeRole === RoleName.TRAINER,

    isUser: () => activeRole === RoleName.USER,

    isLD: () => activeRole === RoleName.LD,

    isOrgAdmin: () => auth.isOrgAdmin,

    isBookingContact: () => allowedRoles?.has(RoleName.BOOKING_CONTACT),

    canViewRevokedCert: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canSeeActionableCourseTable: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.LD]
      return roles.some(r => r === auth.activeRole)
    },

    canViewMyOrganization: () => {
      const roles = [RoleName.USER]
      return roles.some(r => r === auth.activeRole)
    },

    canApproveCourseExceptions: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.LD]
      return roles.some(r => r === auth.activeRole)
    },

    canViewMembership: () => {
      const roles = [
        RoleName.USER,
        RoleName.TRAINER,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return roles.some(r => r === auth.activeRole) || acl.isAdmin()
    },

    canViewAdmin: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.FINANCE,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewAdminDiscount: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.FINANCE,
      ]

      return roles.some(r => r === auth.activeRole)
    },

    canViewAdminPricing: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.FINANCE]
      return roles.some(r => r === auth.activeRole)
    },

    canApproveDiscount: () => {
      const roles = [RoleName.FINANCE, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewAdminCancellationsTransfersReplacements: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.FINANCE,
        RoleName.SALES_REPRESENTATIVE,
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
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewOrders: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewProfiles: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
        RoleName.LD,
      ]
      return (
        roles.some(r => r === auth.activeRole) ||
        acl.isTrainer() ||
        acl.isOrgAdmin()
      )
    },

    canEditProfiles: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN, RoleName.SALES_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canViewEmailContacts: (courseType: CourseType) => {
      const can =
        auth.activeRole !== RoleName.TRAINER ||
        courseType === CourseType.INDIRECT

      return can
    },

    canInviteAttendees: (courseType: CourseType) => {
      switch (courseType) {
        case CourseType.OPEN: {
          const roles = [
            RoleName.TT_ADMIN,
            RoleName.SALES_REPRESENTATIVE,
            RoleName.SALES_ADMIN,
            RoleName.TT_OPS,
          ]
          return roles.some(r => r === auth.activeRole) || acl.isOrgAdmin()
        }
        case CourseType.CLOSED: {
          const roles = [
            RoleName.TT_ADMIN,
            RoleName.SALES_REPRESENTATIVE,
            RoleName.SALES_ADMIN,
            RoleName.TT_OPS,
          ]
          return roles.some(r => r === auth.activeRole) || acl.isOrgAdmin()
        }
        case CourseType.INDIRECT: {
          const roles = [
            RoleName.TT_ADMIN,
            RoleName.SALES_ADMIN,
            RoleName.TT_OPS,
            RoleName.TRAINER,
          ]
          return roles.some(r => r === auth.activeRole) || acl.isOrgAdmin()
        }
      }
    },

    canViewUsers: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canViewAllOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canInviteToOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canViewOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canEditOrAddOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canSetOrgAdminRole: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canCreateCourses: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.TRAINER,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canCreateCourse: (type: CourseType) => {
      switch (auth.activeRole) {
        case RoleName.TT_ADMIN:
        case RoleName.TT_OPS:
          return true
        case RoleName.SALES_ADMIN: {
          return [CourseType.CLOSED, CourseType.OPEN].includes(type)
        }
        case RoleName.TRAINER:
          return [CourseType.INDIRECT].includes(type)
      }

      return false
    },

    allowedCourseLevels: (levels: CourseLevel[]) => {
      if (!activeRole) {
        return []
      }

      if (
        [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].includes(
          activeRole
        )
      ) {
        return levels
      }

      if (
        activeCertificates.some(
          c =>
            c === CourseLevel.AdvancedTrainer ||
            c === CourseLevel.BildAdvancedTrainer
        )
      ) {
        return levels
      }

      return levels.filter(l => l !== CourseLevel.Advanced)
    },

    canEditCourses: (type: CourseType, isLeader: boolean) => {
      switch (auth.activeRole) {
        case RoleName.TT_ADMIN:
        case RoleName.TT_OPS:
          return true
        case RoleName.SALES_ADMIN: {
          return [CourseType.CLOSED, CourseType.OPEN].includes(type)
        }
        case RoleName.TRAINER:
          return [CourseType.INDIRECT].includes(type) && isLeader
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

    canRevokeCert: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === auth.activeRole)
    },

    canHoldCert: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },

    canOverrideGrades: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === auth.activeRole)
    },
    canViewXeroConnect: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },
    canViewArloConnect: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === auth.activeRole)
    },
    canCreateOrgs: () => {
      const roles = [
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.TT_OPS,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === auth.activeRole)
    },
    canEditOrgUser: (userOrgIds?: string[]) => {
      const roles = [RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS]
      return (
        roles.some(r => r === auth.activeRole) ||
        (acl.isOrgAdmin() && acl.isOrgAdminOf(userOrgIds ?? []))
      )
    },
    canEditOrgs: () => {
      const roles = [
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.TT_OPS,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canCancelCourses: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === auth.activeRole)
    },

    canManageOrgCourses: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.FINANCE,
      ]
      return auth.isOrgAdmin || roles.some(r => r === auth.activeRole)
    },

    canSeeWaitingLists: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN]
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

        case CourseType.OPEN: {
          return [RoleName.SALES_ADMIN, RoleName.TT_OPS].includes(
            auth.activeRole
          )
        }
      }

      return false
    },
    canViewResources: (showResources: boolean) => {
      if (acl.isOrgAdmin()) {
        return true
      }

      if (auth.activeRole === RoleName.USER) {
        return showResources
      }

      const roles = [
        RoleName.TT_ADMIN,
        RoleName.TRAINER,
        RoleName.SALES_ADMIN,
        RoleName.FINANCE,
        RoleName.LD,
        RoleName.SALES_REPRESENTATIVE,
        RoleName.TT_OPS,
      ]
      return roles.some(r => r === auth.activeRole)
    },
    canViewCourseHistory: () => {
      return RoleName.TT_ADMIN === auth.activeRole
    },
    isOrgAdminOf: (participantOrgIds: string[]) => {
      return (
        auth.isOrgAdmin &&
        participantOrgIds.some(participantOrgId =>
          managedOrgIds.some(managedOrgId => managedOrgId === participantOrgId)
        )
      )
    },
    canParticipateInCourses: () => {
      const roles = [RoleName.USER, RoleName.TRAINER]
      return roles.some(r => r === auth.activeRole)
    },
    canTransferParticipant: (participantOrgIds: string[]) => {
      return (
        [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].some(
          r => r === auth.activeRole
        ) || acl.isOrgAdminOf(participantOrgIds)
      )
    },
    canReplaceParticipant: (
      participantOrgIds: string[],
      accreditedBy: Accreditors_Enum
    ) => {
      return (
        [
          RoleName.TT_ADMIN,
          RoleName.TT_OPS,
          RoleName.SALES_ADMIN,
          RoleName.SALES_REPRESENTATIVE,
        ].some(r => r === auth.activeRole) ||
        (accreditedBy === Accreditors_Enum.Icm &&
          acl.isOrgAdminOf(participantOrgIds))
      )
    },
    canRemoveParticipant: (participantOrgIds: string[]) => {
      return (
        [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].some(
          r => r === auth.activeRole
        ) || acl.isOrgAdminOf(participantOrgIds)
      )
    },
    canSendCourseInformation: () => {
      const roles = [
        RoleName.TRAINER,
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === auth.activeRole)
    },
    canManageParticipantAttendance: (
      participantOrgIds: string[],
      accreditedBy: Accreditors_Enum
    ) => {
      return (
        acl.canTransferParticipant(participantOrgIds) ||
        acl.canReplaceParticipant(participantOrgIds, accreditedBy) ||
        acl.canRemoveParticipant(participantOrgIds) ||
        acl.canSendCourseInformation()
      )
    },
    canOnlySendCourseInformation: (
      participantOrgIds: string[],
      accreditedBy: Accreditors_Enum
    ) => {
      return (
        !acl.canTransferParticipant(participantOrgIds) &&
        !acl.canReplaceParticipant(participantOrgIds, accreditedBy) &&
        !acl.canRemoveParticipant(participantOrgIds) &&
        acl.canSendCourseInformation()
      )
    },
    canGradeParticipants: (
      trainers: { profile: { id: string }; type: CourseTrainerType }[]
    ) => {
      if (
        auth.activeRole === RoleName.TRAINER &&
        trainers.find(
          t =>
            t.profile.id === auth.profile?.id &&
            t.type !== CourseTrainerType.Moderator
        )
      ) {
        return true
      }

      return [RoleName.TT_ADMIN, RoleName.TT_OPS].some(
        role => role === auth.activeRole
      )
    },
    canBuildCourse: () => {
      return RoleName.TRAINER === auth.activeRole
    },

    canManageBlendedLicenses: () => {
      const roles = [
        RoleName.TT_ADMIN,
        RoleName.FINANCE,
        RoleName.SALES_ADMIN,
        RoleName.TT_OPS,
      ]
      return roles.some(r => r === auth.activeRole)
    },

    canSeeProfileRoles: () => {
      const hubVisibilityDeniedRoles = [RoleName.TRAINER, RoleName.USER]
      return activeRole && !hubVisibilityDeniedRoles.includes(activeRole)
    },
    canMergeProfiles: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === auth.activeRole)
    },
    canArchiveProfile: () => {
      return acl.isTTOps() || acl.isTTAdmin()
    },
    canViewArchivedProfileData: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === auth.activeRole)
    },
    canManageCert: () => {
      return (
        acl.canOverrideGrades() ||
        acl.canHoldCert() ||
        acl.isTTAdmin() ||
        acl.canRevokeCert()
      )
    },
    canCreateBildCourse: (type: CourseType) => {
      if (!activeRole) {
        return false
      }

      switch (type) {
        case CourseType.INDIRECT: {
          if (activeRole === RoleName.TRAINER) {
            return [
              CourseLevel.BildIntermediateTrainer,
              CourseLevel.BildAdvancedTrainer,
            ].some(level => activeCertificates.includes(level))
          }

          return [RoleName.TT_OPS, RoleName.TT_ADMIN].includes(activeRole)
        }
        case CourseType.OPEN:
        case CourseType.CLOSED: {
          return [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN]
        }
      }
    },
    canDeliveryTertiaryAdvancedStrategy: () => {
      if (activeRole === RoleName.TRAINER) {
        return activeCertificates.includes(CourseLevel.BildAdvancedTrainer)
      }

      return true
    },

    canDisableDiscounts: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.FINANCE]
      return roles.some(r => r === auth.activeRole)
    },

    canViewArchivedUsersCertificates: () => {
      return acl.isAdmin()
    },
  })

  return acl
}

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  return { ...auth, acl: getACL(auth) }
}
