import { isPast } from 'date-fns'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

import {
  GetProfileDetailsQuery,
  GetProfileDetailsQueryVariables,
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY } from '@app/queries/profile/get-profile-details'
import { MUTATION as UPDATE_AVATAR_MUTATION } from '@app/queries/profile/update-profile-avatar'
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

export default function useProfile(
  profileId?: string,
  courseId?: string,
  orgId?: string
) {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWR<
    GetProfileDetailsQuery,
    Error,
    [string, GetProfileDetailsQueryVariables] | null
  >(
    profileId
      ? [QUERY, { profileId, withGo1Licenses: Boolean(orgId), orgId }]
      : null
  )

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

  const updateAvatar = useCallback(
    async (avatar: Array<number>) => {
      if (!profileId) {
        return
      }

      const response = await fetcher<
        UpdateAvatarMutation,
        UpdateAvatarMutationVariables
      >(UPDATE_AVATAR_MUTATION, { avatar: JSON.stringify(avatar) })
      return response.updateAvatar
    },
    [fetcher, profileId]
  )

  return {
    profile: data?.profile,
    certifications: data?.certificates,
    missingCertifications: missingCertifications as MissingCertificateInfo[],
    go1Licenses: data?.profile?.go1Licenses,
    mutate,
    error,
    status: getSWRLoadingStatus(data, error),
    updateAvatar,
  }
}
