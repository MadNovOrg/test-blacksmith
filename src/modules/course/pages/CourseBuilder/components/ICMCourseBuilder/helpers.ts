import {
  Course_Level_Enum,
  Course_Type_Enum,
  ModuleGroupsQuery,
} from '@app/generated/graphql'

export const getMinimumTimeCommitment = ({
  level,
  reaccreditation,
}: {
  level: Course_Level_Enum
  reaccreditation?: boolean | null
}) => {
  // locked modules
  if (level === Course_Level_Enum.AdvancedTrainer && reaccreditation) return 0
  if (level === Course_Level_Enum.FoundationTrainerPlus) return 0
  if (
    (reaccreditation && level !== Course_Level_Enum.AdvancedTrainer) ||
    level === Course_Level_Enum.Advanced ||
    level === Course_Level_Enum.Level_1 ||
    level === Course_Level_Enum.Level_1Bs
  )
    return 6
  if (level === Course_Level_Enum.Level_2) return 12
  return 0
}

export function filterModuleGroups(
  groups: ModuleGroupsQuery['groups'],
  config: { level: Course_Level_Enum; type: Course_Type_Enum }
) {
  return groups
    .filter(group => (group?.duration?.aggregate?.sum?.duration ?? 0) > 0)
    .filter(group => {
      // @todo this really should be just temporary,
      // the business wanted this ASAP and making database schema changes
      // for something that will be removed didn't make sense
      if (
        config.type !== Course_Type_Enum.Open ||
        config.level !== Course_Level_Enum.Level_1
      ) {
        return true
      }

      return ![
        'Small Child and One Person Holds',
        'Separations',
        'Neck Disengagement',
      ].includes(group.name)
    })
}
