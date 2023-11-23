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
import { Course_Level_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION as ARCHIVE_PROFILE_MUTATION } from '@app/queries/profile/archive-profile'
import { QUERY } from '@app/queries/profile/get-profile-details'
import { MUTATION as UPDATE_AVATAR_MUTATION } from '@app/queries/profile/update-profile-avatar'
import { getSWRLoadingStatus } from '@app/util'

const isValidCertificate = (certificate: { expiryDate: string }) =>
  !isPast(new Date(certificate.expiryDate))

const requiredCertificateLevel = {
  [Course_Level_Enum.Level_1]: [],
  [Course_Level_Enum.Level_2]: [],
  [Course_Level_Enum.ThreeDaySafetyResponseTrainer]: [],
  [Course_Level_Enum.Advanced]: [Course_Level_Enum.Level_2],
  [Course_Level_Enum.BildRegular]: [],
  [Course_Level_Enum.IntermediateTrainer]: [
    Course_Level_Enum.Level_1,
    Course_Level_Enum.Level_2,
  ],
  [Course_Level_Enum.AdvancedTrainer]: [Course_Level_Enum.IntermediateTrainer],
  [Course_Level_Enum.BildIntermediateTrainer]: [Course_Level_Enum.BildRegular],
  [Course_Level_Enum.BildAdvancedTrainer]: [
    Course_Level_Enum.BildRegular,
    Course_Level_Enum.BildIntermediateTrainer,
  ],
}

export type MissingCertificateInfo = {
  courseId: number
  courseCode: string
  requiredCertificate: Course_Level_Enum[] // ie. Level 1 or Level 2 required
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
            requiredCertificateLevel[c.level || Course_Level_Enum.Level_1]
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
                courseCode: c.course_code,
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
    upcomingCourses: data?.upcomingCourses,
  }
}
