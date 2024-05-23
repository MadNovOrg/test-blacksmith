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

  const changeCountryOnCourseLevelChange = useCallback(
    (
      newCourseLevel: string,
      courseResidingCountry: string = Countries_Code.DEFAULT_RESIDING_COUNTRY
    ) => {
      if (wasCountryAlreadyChanged) return courseResidingCountry

      const shouldUseTrainerCountry =
        acl.isTrainer() &&
        isIndirectCourse &&
        newCourseLevel === Course_Level_Enum.Level_1Bs &&
        !!profile?.countryCode

      if (shouldUseTrainerCountry) {
        return profile.countryCode
      }

      if (acl.isTrainer())
        if (
          courseResidingCountry !== Countries_Code.DEFAULT_RESIDING_COUNTRY &&
          newCourseLevel === Course_Level_Enum.Level_1Bs
        )
          return courseResidingCountry

      if (
        newCourseLevel === Course_Level_Enum.FoundationTrainerPlus ||
        (newCourseLevel === Course_Level_Enum.Level_1Bs && !isIndirectCourse)
      )
        return Countries_Code.IRELAND

      return Countries_Code.DEFAULT_RESIDING_COUNTRY
    },
    [wasCountryAlreadyChanged, acl, isIndirectCourse, profile?.countryCode]
  )

  return {
    changeCountryOnCourseLevelChange,
  }
}
