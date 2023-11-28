import {
  CourseLevel,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

type ModeratorCriteria = {
  courseType: Course_Type_Enum
  courseLevel: Course_Level_Enum | CourseLevel
  isReaccreditation: boolean
  isConversion?: boolean
}

export function isModeratorNeeded({
  courseLevel,
  courseType,
  isReaccreditation,
  isConversion = false,
}: ModeratorCriteria): boolean {
  if (courseType === Course_Type_Enum.Indirect) return false

  if (
    [
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.BildAdvancedTrainer,
    ].includes(courseLevel as Course_Level_Enum) &&
    !isReaccreditation &&
    !isConversion
  ) {
    return true
  }

  return false
}

export function isModeratorMandatory(criteria: {
  courseType: Course_Type_Enum
  courseLevel: Course_Level_Enum | CourseLevel
  isReaccreditation: boolean
  isConversion?: boolean
}): boolean {
  const needsModerator = isModeratorNeeded(criteria)

  return criteria.courseType == Course_Type_Enum.Open ? false : needsModerator
}
