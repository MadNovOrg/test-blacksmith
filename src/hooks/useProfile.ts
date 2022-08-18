import { isPast } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'

import {
  GetProfileDetailsQuery,
  GetProfileDetailsQueryVariables,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/profile/get-profile-details'
import { CourseLevel } from '@app/types'
import { getSWRLoadingStatus } from '@app/util'

const isValidCertificate = (certificate: { expiryDate: string }) =>
  !isPast(new Date(certificate.expiryDate))

const requiredCertificateLevel = {
  [CourseLevel.LEVEL_1]: [],
  [CourseLevel.LEVEL_2]: [],
  [CourseLevel.ADVANCED]: [CourseLevel.LEVEL_2],
  [CourseLevel.BILD_ACT]: [],
  [CourseLevel.INTERMEDIATE_TRAINER]: [
    CourseLevel.LEVEL_1,
    CourseLevel.LEVEL_2,
  ],
  [CourseLevel.ADVANCED_TRAINER]: [CourseLevel.INTERMEDIATE_TRAINER],
  [CourseLevel.BILD_ACT_TRAINER]: [CourseLevel.BILD_ACT],
}

export type MissingCertificateInfo = {
  courseId: number
  requiredCertificate: CourseLevel[] // ie. Level 1 or Level 2 required
}

export default function useProfile(profileId?: string, courseId?: string) {
  const { data, error, mutate } = useSWR<
    GetProfileDetailsQuery,
    Error,
    [string, GetProfileDetailsQueryVariables] | null
  >(profileId ? [QUERY, { profileId }] : null)

  const missingCertifications = useMemo(() => {
    if (data) {
      const activeCertifications = data.certificates.filter(isValidCertificate)
      let courses = data.upcomingCourses
      if (courseId) {
        courses = courses.filter(c => c.id === parseInt(courseId))
      }
      return courses
        .map(c => {
          const requiredCertificate =
            requiredCertificateLevel[c.level || CourseLevel.LEVEL_1]
          if (requiredCertificate.length === 0) {
            return false
          }
          return requiredCertificate.some(requiredLevel =>
            activeCertifications.some(
              activeCert => requiredLevel === activeCert.courseLevel
            )
          )
            ? false
            : {
                courseId: c.id,
                requiredCertificate,
              }
        })
        .filter(Boolean)
    }
    return false
  }, [data, courseId])

  return {
    profile: data?.profile,
    certifications: data?.certificates,
    missingCertifications: missingCertifications as MissingCertificateInfo[],
    mutate,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
