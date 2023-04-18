import { Course_Level_Enum } from '@app/generated/graphql'

export const getMinimumTimeCommitment = ({
  level,
  reaccreditation,
}: {
  level: Course_Level_Enum
  reaccreditation?: boolean | null
}) => {
  if (
    reaccreditation ||
    level === Course_Level_Enum.Level_1 ||
    level === Course_Level_Enum.Level_2
  )
    return 6
  if (level === Course_Level_Enum.Advanced) return 12
  return 0
}
