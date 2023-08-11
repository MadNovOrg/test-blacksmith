import { MarkOptional } from 'ts-essentials'

import { Accreditors_Enum } from '@app/generated/graphql'
import {
  CourseInput,
  CourseLevel,
  CourseTrainerType,
  CourseType,
  RoleName,
} from '@app/types'
import { REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL } from '@app/util'

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

    isSalesAdmin: () => activeRole === RoleName.SALES_ADMIN,

    isSalesRepresentative: () => activeRole === RoleName.SALES_REPRESENTATIVE,

    isFinance: () => activeRole === RoleName.FINANCE,

    isTrainer: () => activeRole === RoleName.TRAINER,

    isUser: () => activeRole === RoleName.USER,

    isLD: () => activeRole === RoleName.LD,

    isOrgAdmin: (orgId?: string) =>
      auth.isOrgAdmin && (orgId ? managedOrgIds.includes(orgId) : true),

    isBookingContact: () => allowedRoles?.has(RoleName.BOOKING_CONTACT),

    isInternalUser: () =>
      [
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isFinance,
        acl.isLD,
      ].some(f => f()),

    canViewRevokedCert: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === activeRole)
    },

    canSeeActionableCourseTable: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.LD]
      return roles.some(r => r === activeRole)
    },

    canViewMyOrganization: () => {
      const roles = [RoleName.USER]
      return roles.some(r => r === activeRole)
    },

    canApproveCourseExceptions: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.LD]
      return roles.some(r => r === activeRole)
    },

    canViewAdmin: () => acl.isInternalUser(),

    canViewAdminDiscount: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.FINANCE,
      ]

      return roles.some(r => r === activeRole)
    },

    canViewAdminPricing: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.FINANCE]
      return roles.some(r => r === activeRole)
    },

    canApproveDiscount: () => {
      const roles = [RoleName.FINANCE, RoleName.TT_ADMIN]
      return roles.some(r => r === activeRole)
    },

    canViewAdminCancellationsTransfersReplacements: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.FINANCE,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === activeRole)
    },

    canViewContacts: () => {
      const roles = [
        RoleName.TRAINER,
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.LD,
        RoleName.SALES_ADMIN,
      ]
      return roles.some(r => r === activeRole)
    },

    canViewCertifications: () => acl.isInternalUser(),

    canViewOrders: () => acl.isInternalUser(),

    canViewCourseOrder: () =>
      [
        acl.isInternalUser,
        acl.isOrgAdmin,
        acl.isTrainer,
        acl.isBookingContact,
      ].some(f => f()),

    canViewProfiles: () =>
      [acl.isInternalUser, acl.isTrainer, acl.isOrgAdmin].some(f => f()),

    canEditProfiles: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN, RoleName.SALES_ADMIN]
      return roles.some(r => r === activeRole)
    },

    canViewEmailContacts: (courseType: CourseType) => {
      const can =
        activeRole !== RoleName.TRAINER || courseType === CourseType.INDIRECT

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
          return roles.some(r => r === activeRole) || acl.isOrgAdmin()
        }
        case CourseType.CLOSED: {
          const roles = [
            RoleName.TT_ADMIN,
            RoleName.SALES_REPRESENTATIVE,
            RoleName.SALES_ADMIN,
            RoleName.TT_OPS,
          ]
          return roles.some(r => r === activeRole) || acl.isOrgAdmin()
        }
        case CourseType.INDIRECT: {
          const roles = [
            RoleName.TT_ADMIN,
            RoleName.SALES_ADMIN,
            RoleName.TT_OPS,
            RoleName.TRAINER,
          ]
          return roles.some(r => r === activeRole) || acl.isOrgAdmin()
        }
      }
    },

    canViewUsers: () => acl.isInternalUser(),

    canViewAllOrganizations: () => acl.isInternalUser(),

    canInviteToOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return auth.isOrgAdmin || roles.some(r => r === activeRole)
    },

    canViewOrganizations: () => {
      return auth.isOrgAdmin || acl.isInternalUser()
    },

    canEditOrAddOrganizations: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return auth.isOrgAdmin || roles.some(r => r === activeRole)
    },

    canSetOrgAdminRole: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === activeRole)
    },

    canCreateCourses: () => {
      const roles = [
        RoleName.TT_OPS,
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.TRAINER,
      ]
      return roles.some(r => r === activeRole)
    },

    canCreateCourse: (type: CourseType) => {
      switch (activeRole) {
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

      return levels.filter(courseLevel => {
        const allowedCertificates =
          REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL[courseLevel]
        return allowedCertificates.some(allowed =>
          activeCertificates.some(active => active === allowed)
        )
      })
    },

    canEditCourses: (type: CourseType, isLeader: boolean) => {
      switch (activeRole) {
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
      return roles.some(r => r === activeRole)
    },

    canRevokeCert: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === activeRole)
    },

    canHoldCert: () => {
      const roles = [RoleName.TT_OPS, RoleName.TT_ADMIN]
      return roles.some(r => r === activeRole)
    },

    canOverrideGrades: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === activeRole)
    },
    canViewXeroConnect: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === activeRole)
    },
    canViewArloConnect: () => {
      const roles = [RoleName.TT_ADMIN]
      return roles.some(r => r === activeRole)
    },
    canCreateOrgs: () => {
      const roles = [
        RoleName.TT_ADMIN,
        RoleName.SALES_ADMIN,
        RoleName.TT_OPS,
        RoleName.SALES_REPRESENTATIVE,
      ]
      return roles.some(r => r === activeRole)
    },
    canEditOrgUser: (userOrgIds?: string[]) => {
      const roles = [RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS]
      return (
        roles.some(r => r === activeRole) ||
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
      return auth.isOrgAdmin || roles.some(r => r === activeRole)
    },

    canCancelCourses: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === activeRole)
    },

    canManageOrgCourses: () =>
      [acl.isInternalUser, acl.isOrgAdmin].some(f => f()),

    canSeeWaitingLists: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN]
      return roles.some(r => r === activeRole)
    },
    canRescheduleWithoutWarning: () => {
      if (activeRole) {
        return [RoleName.TT_ADMIN, RoleName.TT_OPS].includes(activeRole)
      }

      return false
    },

    canEditWithoutRestrictions: (courseType: CourseType) => {
      if (!activeRole) {
        return false
      }

      if (activeRole === RoleName.TT_ADMIN) {
        return true
      }

      switch (courseType) {
        case CourseType.INDIRECT: {
          return false
        }

        case CourseType.CLOSED: {
          return [RoleName.TT_OPS].includes(activeRole)
        }

        case CourseType.OPEN: {
          return [RoleName.SALES_ADMIN, RoleName.TT_OPS].includes(activeRole)
        }
      }

      return false
    },
    canViewResources: () => {
      if (
        activeRole &&
        [RoleName.USER, RoleName.TRAINER].includes(activeRole)
      ) {
        return Boolean(auth.activeCertificates?.length)
      }

      return acl.isInternalUser()
    },
    canViewCourseHistory: () => {
      return RoleName.TT_ADMIN === activeRole
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
      return roles.some(r => r === activeRole)
    },
    canTransferParticipant: (participantOrgIds: string[]) => {
      return (
        [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].some(
          r => r === activeRole
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
        ].some(r => r === activeRole) ||
        (accreditedBy === Accreditors_Enum.Icm &&
          acl.isOrgAdminOf(participantOrgIds))
      )
    },
    canRemoveParticipant: (participantOrgIds: string[]) => {
      return (
        [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].some(
          r => r === activeRole
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
      return roles.some(r => r === activeRole)
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
        activeRole === RoleName.TRAINER &&
        trainers.find(
          t =>
            t.profile.id === auth.profile?.id &&
            t.type !== CourseTrainerType.Moderator
        )
      ) {
        return true
      }

      return [RoleName.TT_ADMIN, RoleName.TT_OPS].some(
        role => role === activeRole
      )
    },
    canBuildCourse: () => {
      return RoleName.TRAINER === activeRole
    },

    canManageBlendedLicenses: () => {
      const roles = [
        RoleName.TT_ADMIN,
        RoleName.FINANCE,
        RoleName.SALES_ADMIN,
        RoleName.TT_OPS,
      ]
      return roles.some(r => r === activeRole)
    },

    canSeeProfileRoles: () => {
      const hubVisibilityDeniedRoles = [RoleName.TRAINER, RoleName.USER]
      return activeRole && !hubVisibilityDeniedRoles.includes(activeRole)
    },
    canMergeProfiles: () => {
      const roles = [RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS]
      return roles.some(r => r === activeRole)
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
      return roles.some(r => r === activeRole)
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
      return roles.some(r => r === activeRole)
    },

    canViewArchivedUsersCertificates: () => {
      return acl.isAdmin()
    },
    canViewCourseBuilderOnEditPage: (
      course: Pick<CourseInput, 'accreditedBy' | 'type'> | undefined | null
    ) => {
      const roles = [
        RoleName.TRAINER,
        RoleName.TT_OPS,
        RoleName.LD,
        RoleName.TT_ADMIN,
      ]
      return (
        roles.some(role => role === activeRole) &&
        course?.accreditedBy === Accreditors_Enum.Icm &&
        (course?.type === CourseType.CLOSED ||
          course?.type === CourseType.INDIRECT)
      )
    },
  })

  return acl
}

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  return { ...auth, acl: getACL(auth) }
}
