import { Course_Level_Enum } from '@app/generated/graphql'
import { CourseType } from '@app/types'

type ModeratorCriteria = {
  courseType: CourseType
  courseLevel: Course_Level_Enum
  isReaccreditation: boolean
  isConversion?: boolean
}

export function isModeratorNeeded({
  courseLevel,
  courseType,
  isReaccreditation,
  isConversion = false,
}: ModeratorCriteria): boolean {
  if (courseType === CourseType.INDIRECT) return false

  if (
    [
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.BildAdvancedTrainer,
    ].includes(courseLevel) &&
    !isReaccreditation &&
    !isConversion
  ) {
    return true
  }

  return false
}

export function isModeratorMandatory(criteria: {
  courseType: CourseType
  courseLevel: Course_Level_Enum
  isReaccreditation: boolean
  isConversion?: boolean
}): boolean {
  const needsModerator = isModeratorNeeded(criteria)

  return criteria.courseType == CourseType.OPEN ? false : needsModerator
}
