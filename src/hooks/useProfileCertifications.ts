import { isPast } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'
import { KeyedMutator } from 'swr/dist/types'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/profile/get-profile-certifications'
import { CourseCertificate, CourseLevel } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

const isValidCertificate = (certificate: CourseCertificate) =>
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
  courseId: string
  requiredCertificate: CourseLevel[] // ie. Level 1 or Level 2 required
}

export type ReturnType = {
  data?: CourseCertificate[]
  missingCertifications: MissingCertificateInfo[]
  mutate: KeyedMutator<ResponseType>
  error?: Error
  status: LoadingStatus
}

export default function useProfileCertifications(
  profileId?: string,
  courseId?: string
): ReturnType {
  const {
    data: certificatesData,
    error: certificatesError,
    mutate: certificatesMutate,
  } = useSWR<ResponseType, Error, [string, ParamsType] | null>(
    profileId ? [QUERY, { profileId }] : null
  )

  const missingCertifications = useMemo(() => {
    if (certificatesData) {
      const activeCertifications =
        certificatesData.certificates.filter(isValidCertificate)
      let courses = certificatesData.upcomingCourses
      if (courseId) {
        courses = courses.filter(c => c.id === parseInt(courseId))
      }
      return courses
        .map(c => {
          const requiredCertificate = requiredCertificateLevel[c.level]
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
  }, [certificatesData, courseId])

  return {
    data: certificatesData?.certificates,
    missingCertifications: missingCertifications as MissingCertificateInfo[],
    mutate: certificatesMutate,
    error: certificatesError,
    status: getSWRLoadingStatus(certificatesData, certificatesError),
  }
}
