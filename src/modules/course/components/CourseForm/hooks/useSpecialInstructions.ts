import { useCallback, useMemo } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  Course_Type_Enum,
  Course_Level_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { CourseInput } from '@app/types'

import { getDefaultSpecialInstructions } from '../helpers'

interface UseResetSpecialInstructionsParams {
  conversion: boolean
  courseLevel: Course_Level_Enum
  courseType: Course_Type_Enum
  deliveryType: Course_Delivery_Type_Enum
  isAustralia: boolean
  isCreation?: boolean
  reaccreditation: boolean
  setValue: UseFormSetValue<CourseInput>
}

interface ResetSpecialInstructionsOverrides {
  newCourseType?: Course_Type_Enum
  newCourseLevel?: Course_Level_Enum | ''
  newCourseDeliveryType?: Course_Delivery_Type_Enum
  newCourseReacc?: boolean
  newCourseConversion?: boolean
}

export const useSpecialInstructions = ({
  conversion,
  courseLevel,
  courseType,
  deliveryType,
  isAustralia,
  isCreation = false,
  reaccreditation,
  setValue,
}: UseResetSpecialInstructionsParams) => {
  const { t } = useTranslation()

  const defaultSpecialInstructions = useMemo(() => {
    return getDefaultSpecialInstructions(
      courseType,
      courseLevel,
      deliveryType,
      reaccreditation,
      conversion,
      t,
      isAustralia,
    )
  }, [
    courseType,
    courseLevel,
    deliveryType,
    reaccreditation,
    conversion,
    t,
    isAustralia,
  ])

  const resetSpecialInstructionsToDefault = useCallback(
    (overrides: ResetSpecialInstructionsOverrides = {}) => {
      if (!isCreation) return

      const {
        newCourseType = courseType,
        newCourseLevel = courseLevel,
        newCourseDeliveryType = deliveryType,
        newCourseReacc = reaccreditation,
        newCourseConversion = conversion,
      } = overrides

      const newSpecialInstructions = getDefaultSpecialInstructions(
        newCourseType,
        newCourseLevel,
        newCourseDeliveryType,
        newCourseReacc,
        newCourseConversion,
        t,
        isAustralia,
      )

      setValue('specialInstructions', newSpecialInstructions)
    },
    [
      isCreation,
      courseType,
      courseLevel,
      deliveryType,
      reaccreditation,
      conversion,
      t,
      isAustralia,
      setValue,
    ],
  )

  return { defaultSpecialInstructions, resetSpecialInstructionsToDefault }
}
