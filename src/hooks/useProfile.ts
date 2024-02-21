import { isPast } from 'date-fns'
import { matches } from 'lodash'
import { cond, constant, stubTrue } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

import {
  ArchiveProfileMutation,
  ArchiveProfileMutationVariables,
  Course_Level_Enum,
  GetProfileDetailsQuery,
  GetProfileDetailsQueryVariables,
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables,
} from '@app/generated/graphql'
import { MUTATION as ARCHIVE_PROFILE_MUTATION } from '@app/queries/profile/archive-profile'
import { QUERY } from '@app/queries/profile/get-profile-details'
import { MUTATION as UPDATE_AVATAR_MUTATION } from '@app/queries/profile/update-profile-avatar'
import { getSWRLoadingStatus } from '@app/util'

const isValidCertificate = (certificate: { expiryDate: string }) =>
  !isPast(new Date(certificate.expiryDate))

type RequiredCertificateCondition = {
  level: Course_Level_Enum
  reaccreditation?: boolean
}

const matchRequiredCertificates = cond<
  RequiredCertificateCondition,
  Course_Level_Enum[]
>([
  [
    matches({
      level: Course_Level_Enum.Advanced,
    }),
    constant([Course_Level_Enum.Level_2]),
  ],
  [
    matches({
      level: Course_Level_Enum.AdvancedTrainer,
      reaccreditation: false,
    }),
    constant([Course_Level_Enum.IntermediateTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.AdvancedTrainer,
      reaccreditation: true,
    }),
    constant([Course_Level_Enum.AdvancedTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.BildAdvancedTrainer,
      reaccreditation: false,
    }),
    constant([
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.BildIntermediateTrainer,
    ]),
  ],
  [
    matches({
      level: Course_Level_Enum.BildAdvancedTrainer,
      reaccreditation: true,
    }),
    constant([Course_Level_Enum.BildAdvancedTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.BildIntermediateTrainer,
      reaccreditation: false,
    }),
    constant([
      Course_Level_Enum.Level_1,
      Course_Level_Enum.Level_2,
      Course_Level_Enum.BildRegular,
    ]),
  ],
  [
    matches({
      level: Course_Level_Enum.BildIntermediateTrainer,
      reaccreditation: true,
    }),
    constant([Course_Level_Enum.BildIntermediateTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.IntermediateTrainer,
      reaccreditation: false,
    }),
    constant([Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]),
  ],
  [
    matches({
      level: Course_Level_Enum.IntermediateTrainer,
      reaccreditation: true,
    }),
    constant([Course_Level_Enum.IntermediateTrainer]),
  ],
  [stubTrue, constant([])],
])

export type MissingCertificateInfo = {
  courseId: number
  courseCode: string
  requiredCertificate: Course_Level_Enum[] // ie. Level 1 or Level 2 required
}

export default function useProfile(
  profileId?: string,
  courseId?: string,
  orgId?: string,
  withCourseHistory = false,
  refreshProfileData = false
) {
  const [{ data: getProfileResponse, error: getProfileError }, reexecuteQuery] =
    useQuery<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>({
      query: QUERY,
      variables: {
        profileId,
        withGo1Licenses: Boolean(orgId),
        orgId,
        withCourseHistory,
        withCourseTrainerHistory: withCourseHistory,
      },
    })
  const [{ data: avatarData }, updateAvatarMutation] = useMutation<
    UpdateAvatarMutation,
    UpdateAvatarMutationVariables
  >(UPDATE_AVATAR_MUTATION)

  const [, archiveProfile] = useMutation<
    ArchiveProfileMutation,
    ArchiveProfileMutationVariables
  >(ARCHIVE_PROFILE_MUTATION)
  const refreshData = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' })
  }, [reexecuteQuery])

  const missingCertifications = useMemo(() => {
    if (getProfileResponse) {
      const activeCertifications =
        getProfileResponse.certificates.filter(isValidCertificate)
      let courses = getProfileResponse.upcomingCourses
      if (courseId) {
        courses = courses.filter(c => c.id === parseInt(courseId))
      }
      return courses
        .map(c => {
          const requiredCertificate = matchRequiredCertificates({
            level: c.level,
            reaccreditation: Boolean(c.reaccreditation),
          })
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
  }, [getProfileResponse, courseId])

  const updateAvatar = useCallback(
    async (avatar: Array<number>) => {
      if (!profileId) {
        return
      }

      updateAvatarMutation({ avatar: JSON.stringify(avatar) })
      return avatarData?.updateAvatar
    },
    [avatarData?.updateAvatar, profileId, updateAvatarMutation]
  )

  const archive = useCallback(async () => {
    if (!profileId) {
      return
    }
    archiveProfile({
      profileId,
    })
  }, [archiveProfile, profileId])

  // forcely re-execute query whenever is necessary inside a component that uses this hook
  useEffect(() => {
    if (refreshProfileData) {
      refreshData()
    }
  }, [refreshData, refreshProfileData])

  return {
    profile: getProfileResponse?.profile,
    certifications: getProfileResponse?.certificates,
    missingCertifications: missingCertifications as MissingCertificateInfo[],
    go1Licenses: getProfileResponse?.profile?.go1Licenses,
    getProfileError,
    status: getSWRLoadingStatus(getProfileResponse, getProfileError),
    updateAvatar,
    archive,
    upcomingCourses: getProfileResponse?.upcomingCourses,
  }
}
