import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import {
  CourseLevel,
  Resource_Resourcepermissions,
} from '@app/generated/graphql'
import {
  courseCategoryUserAttends,
  trainerCourseProgress,
  hasGotPassForTrainerCourse,
} from '@app/pages/Resources/utils'
import { TrainerRoleTypeName } from '@app/types'

export function useResourcePermission() {
  const { activeCertificates, trainerRoles, acl, profile } = useAuth()

  const attendedCourse = courseCategoryUserAttends(profile?.courses)
  const courseProgress = trainerCourseProgress(profile?.courses)
  const hasPassed = hasGotPassForTrainerCourse(profile?.courses)

  const canAccessResource = useCallback(
    (
      resourcePermissions: Pick<
        Resource_Resourcepermissions,
        'certificateLevels' | 'principalTrainer'
      >
    ) => {
      if (acl.isInternalUser()) {
        return true
      }

      /**
       * @summary first level of verification deciding if user has permission
       *          this level grants access to 'Resources' if user attended a course
       *          from 'Non-Trainer' category and got a PASS certificate for that course
       *          list of matching certificates that user must have is "resourcePermissions.certificateLevels"
       */
      const certificatesLevelsPermissionList =
        resourcePermissions.certificateLevels

      const hasPermissionByCourseCertificateLevel =
        certificatesLevelsPermissionList?.some(certificate =>
          activeCertificates?.includes(certificate as CourseLevel)
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
       * @summary second level of verification deciding if user has permission
       *          this level grants access to 'Resources' if user attends a course
       *          from 'Trainer' category and the course is currently on-going;
       *          access will be revoked after course has ended and will be granted
       *          again if user gets a PASS or ASSIST PASS certificate for that course
       */
      const attendedTrainerCourse =
        attendedCourse && attendedCourse.attendsTrainer
      const trainerCourseIsOngoing =
        courseProgress?.started && !courseProgress.ended
      const trainerCourseEnded = courseProgress?.ended
      const hasPassedTrainerCourse = hasPassed

      if (attendedTrainerCourse) {
        if (trainerCourseIsOngoing) {
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
      activeCertificates,
      attendedCourse,
      courseProgress,
      hasPassed,
      trainerRoles,
    ]
  )

  return canAccessResource
}
