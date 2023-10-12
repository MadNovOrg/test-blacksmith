import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import {
  CourseLevel,
  Resource_Resourcepermissions,
} from '@app/generated/graphql'
import {
  courseCategoryUserAttends,
  onGoingTrainerCourseLevelsUserAttends,
  trainerCourseProgress,
  hasGotPassForTrainerCourse,
  ICourseCategoryUserAttends,
  TrainerCoursesEnum,
} from '@app/pages/Resources/utils'
import { TrainerRoleTypeName } from '@app/types'

export function useResourcePermission() {
  const { activeCertificates, trainerRoles, acl, profile } = useAuth()

  const currentUserCertificates = activeCertificates
  const attendedCourse = courseCategoryUserAttends(
    profile?.courses as ICourseCategoryUserAttends[]
  )
  const onGoingCoursesUserAttends = onGoingTrainerCourseLevelsUserAttends(
    profile?.courses as ICourseCategoryUserAttends[]
  )
  const courseProgress = trainerCourseProgress(
    profile?.courses as ICourseCategoryUserAttends[]
  )
  const hasPassed = hasGotPassForTrainerCourse(
    profile?.courses as ICourseCategoryUserAttends[]
  )

  const canAccessResource = useCallback(
    (
      resourcePermissions: Pick<
        Resource_Resourcepermissions,
        'certificateLevels' | 'principalTrainer'
      >
    ) => {
      // all internal users have access by default to 'Resources' area on the app
      if (acl.isInternalUser()) {
        return true
      }

      /**
       * @summary first stage of verification deciding if user has permission
       *          this stage grants access to 'Resources' if user attended a course
       *          from 'Non-Trainer' category and got a PASS certificate for that course
       *          list of matching certificates that user must have is "resourcePermissions.certificateLevels"
       */
      const listOfCertificatesNeededForAccess =
        resourcePermissions.certificateLevels

      const hasPermissionByCourseCertificateLevel =
        listOfCertificatesNeededForAccess?.some(certificate =>
          currentUserCertificates?.includes(certificate as CourseLevel)
        )
      const hasPermissionByPrincipalTrainer =
        resourcePermissions.principalTrainer &&
        trainerRoles?.includes(TrainerRoleTypeName.PRINCIPAL)

      if (
        hasPermissionByCourseCertificateLevel ||
        hasPermissionByPrincipalTrainer
      ) {
        return true
      }

      /**
       * @summary second stage of verification deciding if user has permission;
       *          this stage grants access to 'Resources' if user currently attends
       *          a course from 'Trainer' courses category (course must be on-going);
       *          in addition, the access to each 'Resources' section is granted if
       *          the course that user currently attends, matches the CERTIFICATE LEVEL
       *          needed for the respective 'Resource' section -->
       *                   -->  (see 'listOfCertificatesNeededForAccess' Array for this)
       *          Access will be revoked after course has ended but it will be granted
       *          again if user gets a PASS or ASSIST PASS certificate for that course
       */
      const attendedTrainerCourse =
        attendedCourse && attendedCourse.attendsTrainer
      const trainerCourseEnded = courseProgress?.ended
      const hasPassedTrainerCourse = hasPassed

      if (attendedTrainerCourse) {
        const hasAccessBasedOnCertificates = onGoingCoursesUserAttends?.some(
          course =>
            listOfCertificatesNeededForAccess?.includes(
              course as TrainerCoursesEnum
            )
        )

        if (hasAccessBasedOnCertificates) {
          return true
        }

        if (trainerCourseEnded) {
          if (hasPassedTrainerCourse) {
            return true
          }

          return false
        }
      }

      return false
    },
    [
      acl,
      attendedCourse,
      onGoingCoursesUserAttends,
      courseProgress?.ended,
      currentUserCertificates,
      hasPassed,
      trainerRoles,
    ]
  )

  return canAccessResource
}
