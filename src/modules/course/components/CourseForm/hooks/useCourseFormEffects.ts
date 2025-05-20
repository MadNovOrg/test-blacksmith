import { useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { useAuth } from '@app/context/auth'
import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { CourseInput } from '@app/types'

import { Countries_Code } from '../helpers'

export const useCourseFormEffects = () => {
  const {
    control,
    formState: { dirtyFields },
  } = useFormContext<CourseInput>()
  const courseType = useWatch({ control, name: 'type' })
  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const { acl, profile } = useAuth()

  const wasCountryAlreadyChanged = !!dirtyFields.residingCountry

  const defaultResidingCountry = useCallback(() => {
    if (acl.isAustralia()) return Countries_Code.AUSTRALIA
    return Countries_Code.DEFAULT_RESIDING_COUNTRY
  }, [acl])

  const changeCountryOnCourseLevelChange = useCallback(
    (
      newCourseLevel: string,
      courseResidingCountry: string = defaultResidingCountry(),
    ) => {
      if (wasCountryAlreadyChanged) return courseResidingCountry

      const shouldUseTrainerCountry =
        acl.isUK() &&
        acl.isTrainer() &&
        isIndirectCourse &&
        !!profile?.countryCode

      if (shouldUseTrainerCountry) {
        return profile.countryCode
      }

      if (acl.isTrainer())
        if (
          courseResidingCountry !== defaultResidingCountry() &&
          newCourseLevel === Course_Level_Enum.Level_1Bs
        )
          return courseResidingCountry

      if (
        acl.isUK() &&
        newCourseLevel === Course_Level_Enum.FoundationTrainerPlus &&
        !isIndirectCourse
      )
        return Countries_Code.DEFAULT_RESIDING_COUNTRY
      if (
        acl.isUK() &&
        ((newCourseLevel === Course_Level_Enum.FoundationTrainerPlus &&
          isIndirectCourse) ||
          (newCourseLevel === Course_Level_Enum.Level_1Bs && !isIndirectCourse))
      )
        return Countries_Code.IRELAND

      return courseResidingCountry
    },
    [
      wasCountryAlreadyChanged,
      acl,
      isIndirectCourse,
      profile?.countryCode,
      defaultResidingCountry,
    ],
  )

  return {
    changeCountryOnCourseLevelChange,
  }
}
