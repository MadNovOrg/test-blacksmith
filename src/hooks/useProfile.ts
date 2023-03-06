import { isPast } from 'date-fns'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

import {
  ArchiveProfileMutation,
  ArchiveProfileMutationVariables,
  GetProfileDetailsQuery,
  GetProfileDetailsQueryVariables,
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION as ARCHIVE_PROFILE_MUTATION } from '@app/queries/profile/archive-profile'
import { QUERY } from '@app/queries/profile/get-profile-details'
import { MUTATION as UPDATE_AVATAR_MUTATION } from '@app/queries/profile/update-profile-avatar'
import { CourseLevel } from '@app/types'
import { getSWRLoadingStatus } from '@app/util'

const isValidCertificate = (certificate: { expiryDate: string }) =>
  !isPast(new Date(certificate.expiryDate))

const requiredCertificateLevel = {
  [CourseLevel.Level_1]: [],
  [CourseLevel.Level_2]: [],
  [CourseLevel.Advanced]: [CourseLevel.Level_2],
  [CourseLevel.BildAct]: [],
  [CourseLevel.IntermediateTrainer]: [CourseLevel.Level_1, CourseLevel.Level_2],
  [CourseLevel.AdvancedTrainer]: [CourseLevel.IntermediateTrainer],
  [CourseLevel.BildActTrainer]: [CourseLevel.BildAct],
}

export type MissingCertificateInfo = {
  courseId: number
  requiredCertificate: CourseLevel[] // ie. Level 1 or Level 2 required
}

export default function useProfile(
  profileId?: string,
  courseId?: string,
  orgId?: string,
  withCourseHistory = false
) {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWR<
    GetProfileDetailsQuery,
    Error,
    [string, GetProfileDetailsQueryVariables] | null
  >(
    profileId
      ? [
          QUERY,
          {
            profileId,
            withGo1Licenses: Boolean(orgId),
            orgId,
            withCourseHistory,
            withCourseTrainerHistory: withCourseHistory,
          },
        ]
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
            requiredCertificateLevel[c.level || CourseLevel.Level_1]
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

  const archive = useCallback(async () => {
    if (!profileId) {
      return
    }
    await fetcher<ArchiveProfileMutation, ArchiveProfileMutationVariables>(
      ARCHIVE_PROFILE_MUTATION,
      { profileId }
    )
  }, [fetcher, profileId])

  return {
    profile: data?.profile,
    certifications: data?.certificates,
    missingCertifications: missingCertifications as MissingCertificateInfo[],
    go1Licenses: data?.profile?.go1Licenses,
    mutate,
    error,
    status: getSWRLoadingStatus(data, error),
    updateAvatar,
    archive,
  }
}
