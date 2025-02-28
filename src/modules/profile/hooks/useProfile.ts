import { matches } from 'lodash'
import { cond, constant, stubTrue } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  ArchiveProfileMutation,
  ArchiveProfileMutationVariables,
  Course_Level_Enum,
  GetProfileDetailsQuery,
  GetProfileDetailsQueryVariables,
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables,
} from '@app/generated/graphql'
import { isValidCertificate } from '@app/modules/course_details/course_certification_tab/pages/CourseCertification/utils'
import { MUTATION as ARCHIVE_PROFILE_MUTATION } from '@app/modules/profile/queries/archive-profile'
import { QUERY } from '@app/modules/profile/queries/get-profile-details'
import { MUTATION as UPDATE_AVATAR_MUTATION } from '@app/modules/profile/queries/update-profile-avatar'
import { getSWRLoadingStatus } from '@app/util'
type RequiredCertificateCondition = {
  level: Course_Level_Enum
  reaccreditation?: boolean
  isUKCountry: boolean
}

const matchRequiredCertificates = cond<
  RequiredCertificateCondition,
  Course_Level_Enum[]
>([
  [
    matches({
      level: Course_Level_Enum.Advanced,
      isUKCountry: true,
    }),
    constant([Course_Level_Enum.Level_2]),
  ],
  [
    matches({
      level: Course_Level_Enum.AdvancedTrainer,
      reaccreditation: false,
      isUKCountry: true,
    }),
    constant([Course_Level_Enum.IntermediateTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.AdvancedTrainer,
      reaccreditation: true,
      isUKCountry: true,
    }),
    constant([Course_Level_Enum.AdvancedTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.BildAdvancedTrainer,
      reaccreditation: false,
      isUKCountry: true,
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
      isUKCountry: true,
    }),
    constant([Course_Level_Enum.BildAdvancedTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.BildIntermediateTrainer,
      reaccreditation: false,
      isUKCountry: true,
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
      isUKCountry: true,
    }),
    constant([Course_Level_Enum.BildIntermediateTrainer]),
  ],
  [
    matches({
      level: Course_Level_Enum.IntermediateTrainer,
      reaccreditation: false,
      isUKCountry: true,
    }),
    constant([Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]),
  ],
  [
    matches({
      level: Course_Level_Enum.IntermediateTrainer,
      reaccreditation: true,
      isUKCountry: true,
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
  refreshProfileData = false,
  withKnowledgeHubAccess = false,
) {
  const { isUKCountry } = useWorldCountries()
  const [{ data: getProfileResponse, error: getProfileError }, reexecuteQuery] =
    useQuery<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>({
      query: QUERY,
      variables: {
        profileId,
        withGo1Licenses: Boolean(orgId),
        orgId,
        withCourseHistory,
        withCourseTrainerHistory: withCourseHistory,
        withKnowledgeHubAccess: withKnowledgeHubAccess,
      },
    })
  const [, updateAvatarMutation] = useMutation<
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
            isUKCountry: isUKCountry(c.residingCountry),
          })
          if (requiredCertificate.length === 0) {
            return false
          }
          return requiredCertificate.some(requiredLevel =>
            activeCertifications.some(
              activeCert => requiredLevel === activeCert.courseLevel,
            ),
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
  }, [getProfileResponse, courseId, isUKCountry])

  const updateAvatar = useCallback(
    async (avatar: Array<number>) => {
      if (!profileId) {
        return
      }

      return updateAvatarMutation({ avatar: JSON.stringify(avatar) })
    },
    [profileId, updateAvatarMutation],
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
