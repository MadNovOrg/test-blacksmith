import { isPast } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'
import { KeyedMutator } from 'swr/dist/types'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/profile/get-profile-certifications'
import { CourseCertificate, CourseLevel, CourseParticipant } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

const isValidCertificate = (certificate: CourseCertificate) =>
  !isPast(new Date(certificate.expiryDate))

const prerequisiteValidations = {
  [CourseLevel.LEVEL_1]: () => true,
  [CourseLevel.LEVEL_2]: () => true,
  [CourseLevel.ADVANCED]: (participations: CourseParticipant[]) =>
    participations.some(p => p.course.level === CourseLevel.LEVEL_2),
  [CourseLevel.BILD_ACT]: () => true,
  [CourseLevel.ADVANCED_TRAINER]: (participations: CourseParticipant[]) =>
    participations.some(
      p => p.course.level === CourseLevel.INTERMEDIATE_TRAINER
    ),
  [CourseLevel.BILD_ACT_TRAINER]: (participations: CourseParticipant[]) =>
    participations.some(p => p.course.level === CourseLevel.BILD_ACT),
  [CourseLevel.INTERMEDIATE_TRAINER]: (participations: CourseParticipant[]) =>
    participations.some(
      p =>
        p.course.level === CourseLevel.LEVEL_2 ||
        p.course.level === CourseLevel.LEVEL_1
    ),
}

export type ReturnType = {
  data?: CourseParticipant[]
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
      const activeCertifications = data.courseParticipants.filter(
        p => p.certificate && isValidCertificate(p.certificate)
      )
      const upcomingCourses = data.courseParticipants.filter(p => !p.grade)
      return !upcomingCourses.every(cp =>
        prerequisiteValidations[cp.course.level](activeCertifications)
      )
    }
    return false
  }, [data])

  return {
    data: data?.courseParticipants,
    missingPrerequisiteCertifications,
    mutate,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
