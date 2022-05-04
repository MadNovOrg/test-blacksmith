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

const prerequisiteValidations = {
  [CourseLevel.LEVEL_1]: () => true,
  [CourseLevel.LEVEL_2]: () => true,
  [CourseLevel.ADVANCED]: (certificates: CourseCertificate[]) =>
    certificates.some(c => c.courseLevel === CourseLevel.LEVEL_2),
  [CourseLevel.BILD_ACT]: () => true,
  [CourseLevel.ADVANCED_TRAINER]: (certificates: CourseCertificate[]) =>
    certificates.some(c => c.courseLevel === CourseLevel.INTERMEDIATE_TRAINER),
  [CourseLevel.BILD_ACT_TRAINER]: (certificates: CourseCertificate[]) =>
    certificates.some(c => c.courseLevel === CourseLevel.BILD_ACT),
  [CourseLevel.INTERMEDIATE_TRAINER]: (certificates: CourseCertificate[]) =>
    certificates.some(
      p =>
        p.courseLevel === CourseLevel.LEVEL_2 ||
        p.courseLevel === CourseLevel.LEVEL_1
    ),
}

export type ReturnType = {
  data?: CourseCertificate[]
  missingPrerequisiteCertifications: boolean
  mutate: KeyedMutator<ResponseType>
  error?: Error
  status: LoadingStatus
}

export default function useProfileCertifications(
  profileId?: string
): ReturnType {
  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType] | null
  >(
    profileId
      ? [QUERY, { where: { profile: { id: { _eq: profileId } } } }]
      : null
  )

  const missingPrerequisiteCertifications = useMemo(() => {
    if (data) {
      const activeCertifications = data.certificates.filter(isValidCertificate)
      const upcomingCourses = data.certificates.filter(
        c => c.participant && !c.participant.grade
      )
      return !upcomingCourses.every(c =>
        prerequisiteValidations[c.courseLevel](activeCertifications)
      )
    }
    return false
  }, [data])

  return {
    data: data?.certificates,
    missingPrerequisiteCertifications,
    mutate,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
