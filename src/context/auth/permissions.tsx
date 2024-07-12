import { isFuture, parseISO } from 'date-fns'
import { anyPass } from 'lodash/fp'
import { MarkOptional } from 'ts-essentials'

import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Status_Enum as CourseStatus,
  Course_Type_Enum,
  Course_Trainer_Type_Enum,
  CourseTrainerType,
  Course as GeneratedCourseType,
} from '@app/generated/graphql'
import { getLevels } from '@app/modules/course/components/CourseForm/helpers'
import { isCertificateOutsideGracePeriod } from '@app/modules/course_details/course_certification_tab/pages/CourseCertification/utils'
import {
  courseCategoryUserAttends,
  hasGotPassForTrainerCourse,
  ICourseCategoryUserAttends,
  hasCourseInProgress,
} from '@app/pages/Resources/utils'
import { Course, CourseInput, RoleName } from '@app/types'
import {
  getCourseAssistants,
  getCourseLeadTrainer,
  getCourseModerator,
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
        auth.isOrgAdmin && (orgId ? managedOrgIds.includes(orgId) : true),
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

    canDeleteCourse: (
      course: Pick<
        Course,
        | 'courseParticipants'
        | 'go1Integration'
        | 'participantSubmittedEvaluationCount'
        | 'trainers'
        | 'type'
      >,
    ) => {
      // Only Indirect NON Blended Learning courses without any evaluation submitted or graded participant
      if (
        course.go1Integration ||
        [Course_Type_Enum.Closed, Course_Type_Enum.Open].includes(
          course.type,
        ) ||
        !course.courseParticipants ||
        (course.participantSubmittedEvaluationCount?.aggregate.count ?? 0) >
          0 ||
        course.courseParticipants.some(participant =>
          Boolean(participant.grade),
        )
      ) {
        return false
      }

      return anyPass([
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isTTAdmin,
        acl.isTTOps,
        () => acl.isCourseLeader({ trainers: course.trainers }),
      ])()
    },

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

    isCourseLeader: (
      course: Pick<Course, 'trainers'> | Pick<GeneratedCourseType, 'trainers'>,
    ) =>
      getCourseLeadTrainer(course.trainers)?.profile.id === profile?.id &&
      activeRole === RoleName.TRAINER,

    isCourseAssistantTrainer: (course: Pick<Course, 'trainers'>) =>
      activeRole === RoleName.TRAINER &&
      getCourseAssistants(course.trainers)?.some(
        trainer => trainer.profile.id === profile?.id,
      ),

    isCourseModerator: (course: Pick<Course, 'trainers'>) =>
      activeRole === RoleName.TRAINER &&
      getCourseModerator(course.trainers)?.profile.id === profile?.id,

    /**either Lead, Assistant or Moderator for the course */
    isCourseAnyTrainer: (course: Pick<Course, 'trainers'>) =>
      (activeRole === RoleName.TRAINER &&
        course.trainers?.some(trainer => trainer.profile.id === profile?.id)) ??
      false,

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

    canViewEmailContacts: (courseType: Course_Type_Enum) => {
      const can =
        activeRole !== RoleName.TRAINER ||
        courseType === Course_Type_Enum.Indirect

      return can
    },

    canBookingContactCancelResendInvite: (
      courseType: Course_Type_Enum,
      courseStatus: CourseStatus,
    ) => {
      return [
        courseType === Course_Type_Enum.Closed,
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
      courseType: Course_Type_Enum,
      courseStatus?: CourseStatus,
      course?: Pick<Course, 'trainers'>,
    ) => {
      switch (courseType) {
        case Course_Type_Enum.Open:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isSalesRepresentative,
            acl.isOrgAdmin,
          ])()
        case Course_Type_Enum.Closed:
          return anyPass([
            acl.isTTAdmin,
            acl.isTTOps,
            acl.isSalesAdmin,
            acl.isSalesRepresentative,
            acl.isOrgAdmin,
            () => (course ? acl.isCourseLeader(course) : false),
            () => (course ? acl.isCourseAssistantTrainer(course) : false),
            () =>
              courseStatus
                ? acl.canBookingContactCancelResendInvite(
                    courseType,
                    courseStatus,
                  )
                : false,
          ])()
        case Course_Type_Enum.Indirect:
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

    canInviteAttendeesAfterCourseEnded: (courseType: Course_Type_Enum) => {
      if (
        [Course_Type_Enum.Closed, Course_Type_Enum.Indirect].includes(
          courseType,
        )
      ) {
        return anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])()
      }
      return false
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

    canCreateCourse: (type: Course_Type_Enum) => {
      switch (activeRole) {
        case RoleName.TT_ADMIN:
        case RoleName.TT_OPS:
          return true
        case RoleName.SALES_ADMIN: {
          return [Course_Type_Enum.Closed, Course_Type_Enum.Open].includes(type)
        }
        case RoleName.TRAINER:
          return (
            [Course_Type_Enum.Indirect].includes(type) &&
            acl.canCreateSomeCourseLevel()
          )
      }

      return false
    },

    allowedCourseLevels: (
      courseType: Course_Type_Enum,
      levels: Course_Level_Enum[],
    ) => {
      if (!activeRole) {
        return []
      }

      if (anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])()) {
        return levels
      }

      return levels.filter(courseLevel => {
        const allowedCertificates =
          REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL[courseType][courseLevel]
        return allowedCertificates.some(allowed =>
          activeCertificates.some(active => active === allowed),
        )
      })
    },

    canCreateSomeCourseLevel: () => {
      const allowedICMLevels =
        acl.allowedCourseLevels(
          Course_Type_Enum.Indirect,
          getLevels(Course_Type_Enum.Indirect, Accreditors_Enum.Icm),
        ).length > 0
      const allowedBILDLevels =
        acl.allowedCourseLevels(
          Course_Type_Enum.Indirect,
          getLevels(Course_Type_Enum.Indirect, Accreditors_Enum.Bild),
        ).length > 0

      return allowedBILDLevels || allowedICMLevels
    },

    canEditCourses: (
      course:
        | Pick<Course, 'type' | 'trainers'>
        | Pick<GeneratedCourseType, 'type' | 'trainers'>,
    ) => {
      switch (activeRole) {
        case RoleName.TT_ADMIN:
        case RoleName.TT_OPS:
          return true
        case RoleName.SALES_ADMIN: {
          return [Course_Type_Enum.Closed, Course_Type_Enum.Open].includes(
            course.type,
          )
        }
        case RoleName.TRAINER:
          return (
            [Course_Type_Enum.Indirect].includes(course.type) &&
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

    canDeleteOrgs: () =>
      anyPass([acl.isSalesAdmin, acl.isTTAdmin, acl.isTTOps])(),

    canCancelCourses: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canManageOrgCourses: () => anyPass([acl.isInternalUser, acl.isOrgAdmin])(),

    canSeeWaitingLists: () =>
      anyPass([acl.isTTAdmin, acl.isTTOps, acl.isSalesAdmin])(),

    canRescheduleWithoutWarning: () => anyPass([acl.isTTAdmin, acl.isTTOps])(),

    canEditWithoutRestrictions: (courseType: Course_Type_Enum) => {
      if (!activeRole) {
        return false
      }

      if (activeRole === RoleName.TT_ADMIN) {
        return true
      }

      switch (courseType) {
        case Course_Type_Enum.Indirect: {
          return anyPass([acl.isTTOps])()
        }

        case Course_Type_Enum.Closed: {
          return anyPass([acl.isTTOps])()
        }

        case Course_Type_Enum.Open: {
          return anyPass([acl.isTTOps, acl.isSalesAdmin])()
        }
      }
    },

    canViewResources: () => {
      const attendedCourse = courseCategoryUserAttends(
        auth.profile?.courses as ICourseCategoryUserAttends[],
      )
      const hasPassed = hasGotPassForTrainerCourse(
        auth.profile?.courses as ICourseCategoryUserAttends[],
      )

      const attendedTrainerCourse = attendedCourse?.attendsTrainer
      const courseIsOngoing = hasCourseInProgress(
        auth.profile?.courses as ICourseCategoryUserAttends[],
      )
      const hasPassedTrainerCourse = hasPassed

      const currentUserCertificates = auth.certificates
        ?.filter(certificate => {
          const expirationDate = parseISO(certificate.expiryDate)
          return acl.isTrainer()
            ? !isCertificateOutsideGracePeriod(
                certificate.expiryDate,
                certificate.courseLevel,
              )
            : isFuture(expirationDate)
        })
        .map(certificate => certificate.courseLevel)

      if (
        anyPass(
          [
            acl.isBookingContact,
            acl.isOrgKeyContact,
            acl.isTrainer,
            acl.isUser,
          ] || attendedTrainerCourse,
        )()
      ) {
        return Boolean(
          currentUserCertificates?.length ||
            courseIsOngoing ||
            hasPassedTrainerCourse,
        )
      }

      return acl.isInternalUser()
    },

    canViewCourseHistory: () =>
      anyPass([acl.isTTAdmin, acl.isSalesAdmin, acl.isSalesRepresentative])(),

    canViewCourseAsAttendeeHistory: () => anyPass([acl.isInternalUser])(),

    isOrgAdminOf: (orgIds: string[]) => {
      return (
        acl.isOrgAdmin() &&
        orgIds.some(participantOrgId =>
          managedOrgIds.some(managedOrgId => managedOrgId === participantOrgId),
        )
      )
    },

    isOrganizationKeyContactOfCourse: (_course: Course) =>
      Boolean(
        acl.isOrgKeyContact() &&
          _course.organizationKeyContact?.id === auth.profile?.id,
      ),

    isBookingContactOfCourse: (_course: Course) =>
      Boolean(
        acl.isBookingContact() &&
          _course.bookingContact?.id === auth.profile?.id,
      ),

    isOneOfBookingContactsOfTheOpenCourse: (course: Course) =>
      Boolean(
        acl.isBookingContact() &&
          course.type === Course_Type_Enum.Open &&
          profile?.id &&
          course.courseParticipants?.some(
            p => p.order?.bookingContactProfileId === profile?.id,
          ),
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
        () => acl.isOneOfBookingContactsOfTheOpenCourse(_course),
      ])()
    },

    canReplaceParticipant: (participantOrgIds: string[], course: Course) => {
      return anyPass([
        acl.isBookingContact,
        acl.isSalesAdmin,
        acl.isSalesRepresentative,
        acl.isTTAdmin,
        acl.isTTOps,
        () =>
          course.accreditedBy === Accreditors_Enum.Icm &&
          acl.isOrgAdminOf(participantOrgIds),
      ])()
    },

    canReplaceParticipantAfterCourseEnded: () => {
      return anyPass([acl.isSalesAdmin, acl.isTTAdmin, acl.isTTOps])()
    },

    canCancelParticipant: (participantOrgIds: string[], _course: Course) => {
      return (
        anyPass([
          acl.isBookingContact,
          acl.isSalesAdmin,
          acl.isTTAdmin,
          acl.isTTOps,
        ])() || acl.isOrgAdminOf(participantOrgIds)
      )
    },

    canCancelParticipantINDIRECT: (
      participantOrgIds: string[],
      course: Course,
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
      course: Course,
    ) => {
      return anyPass([
        () => acl.isCourseLeader(course),
        () => acl.isCourseAssistantTrainer(course),
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
      course: Course,
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
      course: Course,
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
      course: Course,
    ) =>
      (course.type === Course_Type_Enum.Closed
        ? [
            acl.canCancelParticipantCLOSED(participantOrgIds, course),
            acl.canSendCourseInformationCLOSED(participantOrgIds, course),
          ]
        : course.type === Course_Type_Enum.Indirect
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
      course: Course,
    ) => {
      return (
        !acl.canTransferParticipant(participantOrgIds, course) &&
        !acl.canReplaceParticipant(participantOrgIds, course) &&
        !acl.canCancelParticipant(participantOrgIds, course) &&
        acl.canSendCourseInformation(participantOrgIds, course)
      )
    },

    canGradeParticipants: (
      trainers: {
        profile: { id: string }
        type: Course_Trainer_Type_Enum | CourseTrainerType
      }[],
    ) => {
      if (
        activeRole === RoleName.TRAINER &&
        trainers.find(
          t =>
            t.profile.id === auth.profile?.id &&
            t.type !== Course_Trainer_Type_Enum.Moderator,
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

    canCreateBildCourse: (type: Course_Type_Enum) => {
      if (!activeRole) {
        return false
      }

      switch (type) {
        case Course_Type_Enum.Indirect: {
          if (activeRole === RoleName.TRAINER) {
            return [
              Course_Level_Enum.BildIntermediateTrainer,
              Course_Level_Enum.BildAdvancedTrainer,
            ].some(level => activeCertificates.includes(level))
          }

          return [RoleName.TT_OPS, RoleName.TT_ADMIN].includes(activeRole)
        }
        case Course_Type_Enum.Open:
        case Course_Type_Enum.Closed: {
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
          Course_Level_Enum.BildAdvancedTrainer,
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
      course:
        | Pick<CourseInput, 'accreditedBy' | 'gradingConfirmed' | 'type'>
        | undefined
        | null,
      trainers: {
        profile: { id: string }
        type: Course_Trainer_Type_Enum | CourseTrainerType
      }[],
    ) => {
      if (
        !(
          course?.accreditedBy === Accreditors_Enum.Icm &&
          (course?.type === Course_Type_Enum.Closed ||
            course?.type === Course_Type_Enum.Indirect) &&
          !course.gradingConfirmed
        )
      ) {
        return false
      }

      if (
        acl.isTrainer() &&
        trainers.find(
          t =>
            t.profile.id === auth.profile?.id &&
            t.type === Course_Trainer_Type_Enum.Leader,
        )
      ) {
        return true
      }

      return anyPass([acl.isTTAdmin, acl.isTTOps, acl.isLD])()
    },
    canViewDietaryAndDisabilitiesDetails: (course: Course) => {
      const isCourseTrainer = course?.trainers?.some(
        trainer => trainer.profile.id === auth.profile?.id,
      )

      return (
        acl.isBookingContactOfCourse(course) ||
        acl.isInternalUser() ||
        acl.isOrganizationKeyContactOfCourse(course) ||
        isCourseTrainer
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
    canImportUsers: () => {
      return activeRole
        ? [RoleName.TT_ADMIN, RoleName.TT_OPS].includes(activeRole)
        : false
    },
    canViewIndirectCourseEvaluationSubmitted: () =>
      anyPass([
        acl.isTrainer,
        acl.isOrgAdmin,
        acl.isOrgKeyContact,
        acl.isInternalUser,
      ])(),
    canViewClosedCourseEvaluationSubmitted: () =>
      anyPass([
        acl.isTrainer,
        acl.isOrgAdmin,
        acl.isBookingContact,
        acl.isInternalUser,
      ])(),
    canViewOpenCourseEvaluationSubmitted: () => anyPass([acl.isInternalUser])(),
    canViewPreCourseMaterials: (course: Course) =>
      anyPass([
        acl.isTTAdmin,
        acl.isTTOps,
        acl.isSalesAdmin,
        () => acl.isCourseAnyTrainer(course),
      ])(),
  })
  return acl
}

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  return { ...auth, acl: getACL(auth) }
}
