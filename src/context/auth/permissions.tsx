import { anyPass } from 'lodash/fp'
import { MarkOptional } from 'ts-essentials'

import { getLevels } from '@app/components/CourseForm/helpers'
import {
  Course_Level_Enum,
  Accreditors_Enum,
  Course_Status_Enum as CourseStatus,
} from '@app/generated/graphql'
import {
  courseCategoryUserAttends,
  hasGotPassForTrainerCourse,
  ICourseCategoryUserAttends,
  trainerCourseProgress,
} from '@app/pages/Resources/utils'
import {
  Course,
  CourseInput,
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
  const individualAllowedRoles = auth.individualAllowedRoles
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

    isIndividual: () =>
      anyPass([
        () => activeRole === RoleName.BOOKING_CONTACT,
        () => activeRole === RoleName.ORGANIZATION_KEY_CONTACT,
        () => activeRole === RoleName.USER,
      ])(),

    isLD: () => activeRole === RoleName.LD,

    isAdmin: () => acl.isTTAdmin() || acl.isTTOps() || acl.isLD(),

    hasOrgAdmin: (orgId?: string) =>
      Boolean(
        auth.isOrgAdmin && (orgId ? managedOrgIds.includes(orgId) : true)
      ),

    isOrgAdmin: (orgId?: string) =>
      acl.hasOrgAdmin(orgId) && activeRole === RoleName.USER,

    isBookingContact: () =>
      Boolean(allowedRoles?.has(RoleName.BOOKING_CONTACT)) &&
      activeRole === RoleName.BOOKING_CONTACT,

    isOrgKeyContact: () =>
      Boolean(allowedRoles?.has(RoleName.ORGANIZATION_KEY_CONTACT)) &&
      activeRole === RoleName.ORGANIZATION_KEY_CONTACT,

    isUserAndHaveUpToOneSubRole: () =>
      (individualAllowedRoles?.size ?? 0) + +acl.hasOrgAdmin() <= 1,

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

    canSeeExportProgressBtnOnBLCourse: (course: Course) =>
      anyPass([
        acl.isInternalUser,
        acl.isTrainer,
        acl.isOrgAdmin,
        acl.isBookingContact,
        () => acl.isOrganizationKeyContactOfCourse(course),
      ])(),

    isCourseLeader: (course: Pick<Course, 'trainers'>) =>
      getCourseLeadTrainer(course.trainers)?.profile.id === profile?.id &&
      activeRole === RoleName.TRAINER,

    canSeeActionableCourseTable: () => anyPass([acl.isTTAdmin, acl.isLD])(),

    canApproveCourseExceptions: () => anyPass([acl.isTTAdmin, acl.isLD])(),

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
        acl.isOrgKeyContact,
      ])(),

    canViewProfiles: () =>
      anyPass([
        acl.isBookingContact,
        acl.isInternalUser,
        acl.isOrgAdmin,
        acl.isOrgKeyContact,
        acl.isTrainer,
      ])(),

    canEditProfiles: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canViewEmailContacts: (courseType: CourseType) => {
      const can =
        activeRole !== RoleName.TRAINER || courseType === CourseType.INDIRECT

      return can
    },

    canBookingContactCancelResendInvite: (
      courseType: CourseType,
      courseStatus: CourseStatus
    ) => {
      return [
        courseType === CourseType.CLOSED,
        acl.isBookingContact(),
        [
          CourseStatus.EvaluationMissing,
          CourseStatus.ExceptionsApprovalPending,
          CourseStatus.GradeMissing,
          CourseStatus.Scheduled,
          CourseStatus.TrainerDeclined,
          CourseStatus.TrainerMissing,
          CourseStatus.TrainerPending,
        ].includes(courseStatus),
      ].every(val => Boolean(val))
    },

    canInviteAttendees: (
      courseType: CourseType,
      courseStatus?: CourseStatus
    ) => {
      switch (courseType) {
        case CourseType.OPEN:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isSalesRepresentative,
            acl.isOrgAdmin,
          ])()
        case CourseType.CLOSED:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isSalesRepresentative,
            acl.isOrgAdmin,
            () =>
              courseStatus
                ? acl.canBookingContactCancelResendInvite(
                    courseType,
                    courseStatus
                  )
                : false,
          ])()
        case CourseType.INDIRECT:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isTrainer,
            acl.isOrgAdmin,
            acl.isOrgKeyContact,
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

    canSetOrgAdminRole: (orgId?: string): boolean =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        () => (orgId ? acl.isOrgAdminOf([orgId]) : false),
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
    allowedCourseLevels: (levels: Course_Level_Enum[]) => {
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
      const attendedCourse = courseCategoryUserAttends(
        auth.profile?.courses as ICourseCategoryUserAttends[]
      )
      const courseProgress = trainerCourseProgress(
        auth.profile?.courses as ICourseCategoryUserAttends[]
      )
      const hasPassed = hasGotPassForTrainerCourse(
        auth.profile?.courses as ICourseCategoryUserAttends[]
      )

      const attendedTrainerCourse =
        attendedCourse && attendedCourse.attendsTrainer
      const trainerCourseIsOngoing =
        courseProgress?.started && !courseProgress.ended
      const hasPassedTrainerCourse = hasPassed

      if (
        anyPass(
          [
            acl.isBookingContact,
            acl.isOrgKeyContact,
            acl.isTrainer,
            acl.isUser,
          ] || attendedTrainerCourse
        )()
      ) {
        return Boolean(
          auth.activeCertificates?.length ||
            trainerCourseIsOngoing ||
            hasPassedTrainerCourse
        )
      }

      return acl.isInternalUser()
    },

    canViewCourseHistory: () => anyPass([acl.isTTAdmin])(),

    canViewCourseAsAttendeeHistory: () => anyPass([acl.isInternalUser])(),

    isOrgAdminOf: (orgIds: string[]) => {
      return (
        acl.isOrgAdmin() &&
        orgIds.some(participantOrgId =>
          managedOrgIds.some(managedOrgId => managedOrgId === participantOrgId)
        )
      )
    },

    isOrganizationKeyContactOfCourse: (_course: Course) =>
      Boolean(
        acl.isOrgKeyContact() &&
          _course.organizationKeyContact?.id === auth.profile?.id
      ),

    isBookingContactOfCourse: (_course: Course) =>
      Boolean(
        acl.isBookingContact() &&
          _course.bookingContact?.id === auth.profile?.id
      ),

    canParticipateInCourses: () =>
      anyPass([
        acl.isBookingContact,
        acl.isOrgKeyContact,
        acl.isTrainer,
        acl.isUser,
      ])(),

    canTransferParticipant: (participantOrgIds: string[], _course: Course) => {
      return anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        () => acl.isOrgAdminOf(participantOrgIds),
      ])()
    },

    canReplaceParticipant: (participantOrgIds: string[], course: Course) => {
      return anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        () =>
          course.accreditedBy === Accreditors_Enum.Icm &&
          acl.isOrgAdminOf(participantOrgIds),
      ])()
    },

    canCancelParticipant: (participantOrgIds: string[], _course: Course) => {
      return (
        anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])() ||
        acl.isOrgAdminOf(participantOrgIds)
      )
    },

    canCancelParticipantINDIRECT: (
      participantOrgIds: string[],
      course: Course
    ) => {
      return anyPass([
        () => acl.isCourseLeader(course),
        () => acl.isOrgAdminOf(participantOrgIds),
        () => acl.isOrganizationKeyContactOfCourse(course),
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isTTAdmin,
        acl.isTTOps,
      ])()
    },

    canCancelParticipantCLOSED: (
      participantOrgIds: string[],
      course: Course
    ) => {
      return anyPass([
        () => acl.isCourseLeader(course),
        () => acl.isOrgAdminOf(participantOrgIds),
        acl.isBookingContact,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isTTAdmin,
        acl.isTTOps,
      ])()
    },

    canSendCourseInformation: (_participantOrgIds: string[], _course: Course) =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        acl.isTrainer,
      ])() || acl.isOrgAdminOf(_participantOrgIds),

    canSendCourseInformationINDIRECT: (
      participantOrgIds: string[],
      course: Course
    ) => {
      return anyPass([
        () => acl.isCourseLeader(course),
        () => acl.isOrgAdminOf(participantOrgIds),
        () => acl.isOrganizationKeyContactOfCourse(course),
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isTTAdmin,
        acl.isTTOps,
      ])()
    },

    canSendCourseInformationCLOSED: (
      participantOrgIds: string[],
      course: Course
    ) => {
      return anyPass([
        () => acl.isCourseLeader(course),
        () => acl.isOrgAdminOf(participantOrgIds),
        acl.isBookingContact,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isTTAdmin,
        acl.isTTOps,
      ])()
    },

    canManageParticipantAttendance: (
      participantOrgIds: string[],
      course: Course
    ) =>
      (course.type === CourseType.CLOSED
        ? [
            acl.canCancelParticipantCLOSED(participantOrgIds, course),
            acl.canSendCourseInformationCLOSED(participantOrgIds, course),
          ]
        : course.type === CourseType.INDIRECT
        ? [
            acl.canCancelParticipantINDIRECT(participantOrgIds, course),
            acl.canSendCourseInformationINDIRECT(participantOrgIds, course),
          ]
        : [
            acl.canTransferParticipant(participantOrgIds, course),
            acl.canReplaceParticipant(participantOrgIds, course),
            acl.canCancelParticipant(participantOrgIds, course),
            acl.canSendCourseInformation(participantOrgIds, course),
          ]
      ).some(Boolean),

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
              Course_Level_Enum.BildIntermediateTrainer,
              Course_Level_Enum.BildAdvancedTrainer,
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
        return activeCertificates.includes(
          Course_Level_Enum.BildAdvancedTrainer
        )
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
    canViewDietaryAndDisabiltitiesDetails: (course: Course) => {
      const isCourseTrainer = course?.trainers?.some(
        trainer => trainer.profile.id === auth.profile?.id
      )
      return (
        acl.isInternalUser() ||
        isCourseTrainer ||
        acl.isBookingContactOfCourse(course) ||
        acl.isOrganizationKeyContactOfCourse(course)
      )
    },
    canViewTrainerDietaryAndDisabilities: () =>
      anyPass([acl.isOrgAdmin, acl.isBookingContact, acl.isOrgKeyContact])(),
    canAddModuleNotes: (leadTrainerIds: string[]) => {
      return (
        acl.isTTAdmin() ||
        (auth.profile?.id &&
          leadTrainerIds.includes(auth.profile.id) &&
          activeRole === RoleName.TRAINER)
      )
    },
  })
  return acl
}

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  return { ...auth, acl: getACL(auth) }
}
