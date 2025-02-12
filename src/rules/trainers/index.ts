import {
  CourseLevel,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

export const courseLevelsWithModeratorField = [
  Course_Level_Enum.IntermediateTrainer,
  Course_Level_Enum.AdvancedTrainer,
  Course_Level_Enum.BildIntermediateTrainer,
  Course_Level_Enum.BildAdvancedTrainer,
  Course_Level_Enum.FoundationTrainer,
  Course_Level_Enum.FoundationTrainerPlus,
]

type ModeratorCriteria = {
  courseLevel: Course_Level_Enum | CourseLevel
  courseType: Course_Type_Enum
  isConversion?: boolean
}

export function isModeratorNeeded({
  courseLevel,
  courseType,
  isConversion = false,
}: ModeratorCriteria): boolean {
  if (courseType === Course_Type_Enum.Indirect) return false

  return (
    courseLevelsWithModeratorField.includes(courseLevel as Course_Level_Enum) &&
    !isConversion
  )
}
