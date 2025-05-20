import { useCallback } from 'react'
import { useMutation } from 'urql'
import { Maybe } from 'yup'

import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
} from '@app/generated/graphql'
import { UPDATE_PROFILE_MUTATION } from '@app/modules/profile/queries/update-profile'
import { Course, CourseInput } from '@app/types'

export const useUpdateContactResidingCountry = ({
  courseData,
  initialCourseData,
}: {
  courseData: Pick<
    CourseInput,
    'bookingContact' | 'organizationKeyContact'
  > | null
  initialCourseData: Maybe<Course> | undefined
}) => {
  const [, updateProfile] = useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(UPDATE_PROFILE_MUTATION)

  const editContactResidingCountry = useCallback(async () => {
    if (!courseData || !initialCourseData) return

    if (
      courseData.bookingContact?.profileId &&
      courseData.bookingContact?.residingCountryCode &&
      !initialCourseData.bookingContact?.countryCode
    ) {
      await updateProfile({
        input: {
          profileId: courseData.bookingContact?.profileId,
          country: courseData.bookingContact.residingCountry,
          countryCode: courseData.bookingContact?.residingCountryCode,
        },
      })
    }

    if (
      courseData.organizationKeyContact?.profileId &&
      courseData.organizationKeyContact?.residingCountryCode &&
      !initialCourseData.organizationKeyContact?.countryCode
    ) {
      await updateProfile({
        input: {
          profileId: courseData.organizationKeyContact?.profileId,
          country: courseData.organizationKeyContact.residingCountry,
          countryCode: courseData.organizationKeyContact?.residingCountryCode,
        },
      })
    }
  }, [courseData, initialCourseData, updateProfile])

  return { editContactResidingCountry }
}
