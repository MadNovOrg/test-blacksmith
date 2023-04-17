import { Course_Level_Enum } from '@app/generated/graphql'

export const getMinimumTimeCommitment = (courseLevel: Course_Level_Enum) => {
  if (
    courseLevel === Course_Level_Enum.Level_1 ||
    courseLevel === Course_Level_Enum.Level_2
  )
    return 6
  if (courseLevel === Course_Level_Enum.Advanced) return 12
  return 0
}
