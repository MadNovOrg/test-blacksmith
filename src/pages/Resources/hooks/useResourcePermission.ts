import { isFuture, parseISO } from 'date-fns'
import { useCallback } from 'react'

import { isCertificateOutsideGracePeriod } from '@app/components/CourseCertification/utils'
import { useAuth } from '@app/context/auth'
import {
  Course_Level_Enum,
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
  const { certificates, trainerRoles, acl, profile } = useAuth()

  // remove all expired certificates user has
  const currentUserCertificates = certificates
    ?.filter(certificate => {
      const expirationDate = parseISO(certificate.expiryDate)
      return acl.isTrainer()
        ? !isCertificateOutsideGracePeriod(
            certificate.expiryDate,
            certificate.courseLevel
          )
        : isFuture(expirationDate)
    })
    .map(certificate => certificate.courseLevel)

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
      if (!resourcePermissions) {
        return false
      }
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
          currentUserCertificates?.includes(certificate as Course_Level_Enum)
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
          // check if user got a PASS or ASSIST PASS for the recently attended Trainer Course
          // but at the same time, he needs to have at least one valid certificate
          if (hasPassedTrainerCourse && hasPermissionByCourseCertificateLevel) {
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
