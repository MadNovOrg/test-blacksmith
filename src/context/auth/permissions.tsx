import { anyPass } from 'lodash/fp'
import { MarkOptional } from 'ts-essentials'

import { getLevels } from '@app/components/CourseForm/helpers'
import { Accreditors_Enum } from '@app/generated/graphql'
import {
  courseCategoryUserAttends,
  hasGotPassForTrainerCourse,
  trainerCourseProgress,
} from '@app/pages/Resources/utils'
import {
  Course,
  CourseInput,
  CourseLevel,
  CourseTrainerType,
  CourseType,
  RoleName,
} from '@app/types'
import {
  getCourseLeadTrainer,
  REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL,
} from '@app/util'

import type { AuthContextType } from './types'

export function getACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const profile = auth.profile
  const activeRole = auth.activeRole
  const allowedRoles = auth.allowedRoles
  const activeCertificates = auth.activeCertificates ?? []
  const managedOrgIds = auth.managedOrgIds ?? []

  const acl = Object.freeze({
    isTTAdmin: () => activeRole === RoleName.TT_ADMIN,

    isTTOps: () => activeRole === RoleName.TT_OPS,

    isSalesAdmin: () => activeRole === RoleName.SALES_ADMIN,

    isSalesRepresentative: () => activeRole === RoleName.SALES_REPRESENTATIVE,

    isFinance: () => activeRole === RoleName.FINANCE,

    isTrainer: () => activeRole === RoleName.TRAINER,

    isUser: () => activeRole === RoleName.USER,

    isLD: () => activeRole === RoleName.LD,

    isAdmin: () => acl.isTTAdmin() || acl.isTTOps() || acl.isLD(),

    isOrgAdmin: (orgId?: string) =>
      Boolean(
        auth.isOrgAdmin && (orgId ? managedOrgIds.includes(orgId) : true)
      ),

    isBookingContact: () =>
      Boolean(allowedRoles?.has(RoleName.BOOKING_CONTACT)) && acl.isUser(),

    isInternalUser: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isLD,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isFinance,
      ])(),

    canViewRevokedCert: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isLD, acl.isSalesAdmin])(),

    isCourseLeader: (course: Pick<Course, 'trainers'>) =>
      getCourseLeadTrainer(course.trainers)?.profile.id === profile?.id,

    canSeeActionableCourseTable: () => anyPass([acl.isTTAdmin, acl.isLD])(),

    canApproveCourseExceptions: () => anyPass([acl.isAdmin, acl.isLD])(),

    /**
     * @deprecated Will be removed in the near future
     */
    canViewMembership: () => {
      if (activeRole === RoleName.USER) {
        return Boolean(auth.activeCertificates?.length)
      }

      return anyPass([
        acl.isUser,
        acl.isTrainer,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isFinance,
        acl.isAdmin,
      ])()
    },

    canViewAdmin: () => acl.isInternalUser(),

    canViewAdminDiscount: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin, acl.isFinance])(),

    canViewAdminPricing: () => anyPass([acl.isTTAdmin, acl.isFinance])(),

    canApproveDiscount: () => anyPass([acl.isTTAdmin, acl.isFinance])(),

    canViewAdminCancellationsTransfersReplacements: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isFinance,
        acl.isSalesRepresentative,
      ])(),

    canViewContacts: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isLD,
        acl.isTrainer,
        acl.isSalesAdmin,
      ])(),

    canViewCertifications: () => acl.isInternalUser(),

    canViewOrders: () => acl.isInternalUser(),

    canViewCourseOrder: () =>
      anyPass([
        acl.isInternalUser,
        acl.isTrainer,
        acl.isOrgAdmin,
        acl.isBookingContact,
      ])(),

    canViewProfiles: () =>
      anyPass([acl.isInternalUser, acl.isTrainer, acl.isOrgAdmin])(),

    canEditProfiles: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canViewEmailContacts: (courseType: CourseType) => {
      const can =
        activeRole !== RoleName.TRAINER || courseType === CourseType.INDIRECT

      return can
    },

    canInviteAttendees: (courseType: CourseType) => {
      switch (courseType) {
        case CourseType.OPEN:
        case CourseType.CLOSED:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isSalesRepresentative,
            acl.isOrgAdmin,
          ])()
        case CourseType.INDIRECT:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isTrainer,
            acl.isOrgAdmin,
          ])()
      }
    },

    canViewUsers: () => acl.isInternalUser(),

    canViewAllOrganizations: () => acl.isInternalUser(),

    canInviteToOrganizations: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isOrgAdmin,
      ])(),

    canViewOrganizations: () => anyPass([acl.isInternalUser, acl.isOrgAdmin])(),

    canEditOrAddOrganizations: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isOrgAdmin,
      ])(),

    canSetOrgAdminRole: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
      ])(),

    canCreateCourses: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin, acl.isTrainer])(),

    canCreateCourse: (type: CourseType) => {
      switch (activeRole) {
        case RoleName.TT_ADMIN:
        case RoleName.TT_OPS:
          return true
        case RoleName.SALES_ADMIN: {
          return [CourseType.CLOSED, CourseType.OPEN].includes(type)
        }
        case RoleName.TRAINER:
          return (
            [CourseType.INDIRECT].includes(type) &&
            acl.canCreateSomeCourseLevel()
          )
      }

      return false
    },

    // TODO RMX | Too chonky, revise this later
    allowedCourseLevels: (levels: CourseLevel[]) => {
      if (!activeRole) {
        return []
      }

      if (anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])()) {
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

    canCreateSomeCourseLevel: () => {
      const allowedICMLevels =
        acl.allowedCourseLevels(
          getLevels(CourseType.INDIRECT, Accreditors_Enum.Icm)
        ).length > 0
      const allowedBILDLevels =
        acl.allowedCourseLevels(
          getLevels(CourseType.INDIRECT, Accreditors_Enum.Bild)
        ).length > 0

      return allowedBILDLevels || allowedICMLevels
    },

    canEditCourses: (course: Pick<Course, 'type' | 'trainers'>) => {
      switch (activeRole) {
        case RoleName.TT_ADMIN:
        case RoleName.TT_OPS:
          return true
        case RoleName.SALES_ADMIN: {
          return [CourseType.CLOSED, CourseType.OPEN].includes(course.type)
        }
        case RoleName.TRAINER:
          return (
            [CourseType.INDIRECT].includes(course.type) &&
            acl.isCourseLeader(course)
          )
      }

      return false
    },

    canAssignLeadTrainer: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin, acl.isLD])(),

    canRevokeCert: () => anyPass([acl.isTTAdmin, acl.isTTOps])(),

    canHoldCert: () => anyPass([acl.isTTAdmin, acl.isTTOps])(),

    canOverrideGrades: () => anyPass([acl.isTTAdmin, acl.isTTOps])(),

    canViewXeroConnect: () => anyPass([acl.isTTAdmin])(),

    canViewArloConnect: () => anyPass([acl.isTTAdmin])(),

    canCreateOrgs: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
      ])(),

    canEditOrgUser: (userOrgIds?: string[]) => {
      return (
        anyPass([acl.isTTAdmin, acl.isSalesAdmin, acl.isTTOps])() ||
        acl.isOrgAdminOf(userOrgIds ?? [])
      )
    },

    canEditOrgs: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isOrgAdmin,
      ])(),

    canCancelCourses: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canManageOrgCourses: () => anyPass([acl.isInternalUser, acl.isOrgAdmin])(),

    canSeeWaitingLists: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canRescheduleWithoutWarning: () => anyPass([acl.isTTAdmin, acl.isTTOps])(),

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
          return anyPass([acl.isTTOps])()
        }

        case CourseType.OPEN: {
          return anyPass([acl.isTTOps, acl.isSalesAdmin])()
        }
      }
    },

    canViewResources: () => {
      const attendedCourse = courseCategoryUserAttends(auth.profile?.courses)
      const courseProgress = trainerCourseProgress(auth.profile?.courses)
      const hasPassed = hasGotPassForTrainerCourse(auth.profile?.courses)

      const attendedTrainerCourse =
        attendedCourse && attendedCourse.attendsTrainer
      const trainerCourseIsOngoing =
        courseProgress?.started && !courseProgress.ended
      const hasPassedTrainerCourse = hasPassed

      if (anyPass([acl.isUser, acl.isTrainer] || attendedTrainerCourse)()) {
        return Boolean(
          auth.activeCertificates?.length ||
            trainerCourseIsOngoing ||
            hasPassedTrainerCourse
        )
      }

      return acl.isInternalUser()
    },

    canViewCourseHistory: () => anyPass([acl.isTTAdmin])(),

    isOrgAdminOf: (participantOrgIds: string[]) => {
      return (
        acl.isOrgAdmin() &&
        participantOrgIds.some(participantOrgId =>
          managedOrgIds.some(managedOrgId => managedOrgId === participantOrgId)
        )
      )
    },

    canParticipateInCourses: () => anyPass([acl.isUser, acl.isTrainer])(),

    canTransferParticipant: (participantOrgIds: string[], _course: Course) => {
      return (
        anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])() ||
        (![CourseType.INDIRECT, CourseType.CLOSED].includes(_course.type) &&
          acl.isOrgAdminOf(participantOrgIds))
      )
    },

    canReplaceParticipant: (participantOrgIds: string[], course: Course) => {
      return (
        anyPass([
          acl.isTTAdmin,
          acl.isTTOps,
          acl.isSalesAdmin,
          acl.isSalesRepresentative,
        ])() ||
        (course.accreditedBy === Accreditors_Enum.Icm &&
          ![CourseType.INDIRECT, CourseType.CLOSED].includes(course.type) &&
          acl.isOrgAdminOf(participantOrgIds))
      )
    },

    canCancelParticipant: (participantOrgIds: string[], _course: Course) => {
      return (
        anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])() ||
        acl.isOrgAdminOf(participantOrgIds) ||
        ([CourseType.INDIRECT].includes(_course.type) &&
          acl.isCourseLeader(_course)) ||
        ([CourseType.CLOSED].includes(_course.type) && acl.isBookingContact())
      )
    },

    canSendCourseInformation: (_participantOrgIds: string[], _course: Course) =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isTrainer,
      ])() ||
      acl.isOrgAdminOf(_participantOrgIds) ||
      ([CourseType.CLOSED].includes(_course.type) && acl.isBookingContact()),

    canManageParticipantAttendance: (
      participantOrgIds: string[],
      course: Course
    ) =>
      [
        acl.canTransferParticipant(participantOrgIds, course),
        acl.canReplaceParticipant(participantOrgIds, course),
        acl.canCancelParticipant(participantOrgIds, course),
        acl.canSendCourseInformation(participantOrgIds, course),
      ].some(Boolean),

    canOnlySendCourseInformation: (
      participantOrgIds: string[],
      course: Course
    ) => {
      return (
        !acl.canTransferParticipant(participantOrgIds, course) &&
        !acl.canReplaceParticipant(participantOrgIds, course) &&
        !acl.canCancelParticipant(participantOrgIds, course) &&
        acl.canSendCourseInformation(participantOrgIds, course)
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

      return anyPass([acl.isTTAdmin, acl.isTTOps])()
    },

    canBuildCourse: () => acl.isTrainer(),

    canManageBlendedLicenses: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin, acl.isFinance])(),

    canSeeProfileRoles: () => {
      const hubVisibilityDeniedRoles = [RoleName.TRAINER, RoleName.USER]
      return activeRole && !hubVisibilityDeniedRoles.includes(activeRole)
    },
    canMergeProfiles: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canArchiveProfile: () => {
      return acl.isTTAdmin() || acl.isTTOps()
    },

    canViewArchivedProfileData: () =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isLD,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
      ])(),

    canManageCert: () =>
      anyPass([
        acl.isSalesAdmin,
        acl.canHoldCert,
        acl.canRevokeCert,
        acl.canOverrideGrades,
      ])(),

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
          /**
           * TODO: Patch this bug.
           * @see https://behaviourhub.atlassian.net/browse/TTHP-761
           */
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

    canDisableDiscounts: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isFinance])(),

    canViewArchivedUsersCertificates: () => {
      return acl.isAdmin()
    },
    canViewCourseBuilderOnEditPage: (
      course: Pick<CourseInput, 'accreditedBy' | 'type'> | undefined | null,
      trainers: { profile: { id: string }; type: CourseTrainerType }[]
    ) => {
      if (
        !(
          course?.accreditedBy === Accreditors_Enum.Icm &&
          (course?.type === CourseType.CLOSED ||
            course?.type === CourseType.INDIRECT)
        )
      ) {
        return false
      }

      if (
        acl.isTrainer() &&
        trainers.find(
          t =>
            t.profile.id === auth.profile?.id &&
            t.type === CourseTrainerType.Leader
        )
      ) {
        return true
      }

      return anyPass([acl.isTTAdmin, acl.isTTOps, acl.isLD])()
    },
  })

  return acl
}

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  return { ...auth, acl: getACL(auth) }
}
