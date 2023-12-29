import { Course_Level_Enum } from '@app/generated/graphql'
import { Strategies } from '@app/hooks/useBildStrategies'
import { BildStrategies } from '@app/types'

export function getPreselectedModules({
  courseStrategies,
  allStrategies,
  courseLevel,
}: {
  courseStrategies: { strategyName: string }[]
  allStrategies: Strategies
  courseLevel: Course_Level_Enum
}) {
  const isTrainerLevelCourse = courseLevel
    ? [
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ].includes(courseLevel)
    : false

  const preselectedModules: Record<string, boolean> = {}

  const hasPrimary = courseStrategies.some(s => s.strategyName === 'PRIMARY')
  const hasSecondary = courseStrategies.some(
    s => s.strategyName === 'SECONDARY'
  )

  if (isTrainerLevelCourse) {
    courseStrategies.forEach(courseStrategy => {
      const strategy = allStrategies.find(
        s => s.name === courseStrategy.strategyName
      )

      strategy?.modules.modules?.forEach(module => {
        preselectedModules[`${strategy.name}.${module.name}`] = true
      })

      strategy?.modules.groups?.forEach(group => {
        group.modules?.forEach(module => {
          preselectedModules[`${strategy.name}.${group.name}.${module.name}`] =
            true
        })
      })
    })
  } else {
    const primaryStrategy = hasPrimary
      ? allStrategies.find(s => s.name === 'PRIMARY')
      : null
    const secondaryStrategy = hasSecondary
      ? allStrategies.find(s => s.name === 'SECONDARY')
      : null

    if (primaryStrategy) {
      primaryStrategy?.modules.modules?.forEach(module => {
        preselectedModules[`PRIMARY.${module.name}`] = true
      })

      primaryStrategy.modules.groups?.forEach(group => {
        group.modules?.forEach(module => {
          preselectedModules[`PRIMARY.${group.name}.${module.name}`] = true
        })
      })
    }

    if (secondaryStrategy) {
      secondaryStrategy.modules.modules?.forEach(module => {
        preselectedModules[`SECONDARY.${module.name}`] = true
      })

      secondaryStrategy.modules.groups?.forEach(group => {
        group.modules?.forEach(module => {
          preselectedModules[`SECONDARY.${group.name}.${module.name}`] = true
        })
      })
    }
  }

  return preselectedModules
}

export function getDisabledStrategies({
  courseStrategies,
  courseLevel,
}: {
  courseStrategies: { strategyName: string }[]
  courseLevel: Course_Level_Enum
}): Record<string, boolean> {
  if (isBILDTrainerCourse(courseLevel)) {
    const disabledStrategies: Record<string, boolean> = {}

    courseStrategies.forEach(strategy => {
      disabledStrategies[strategy.strategyName] = true
    })

    return disabledStrategies
  }

  return {
    [BildStrategies.Primary]: courseStrategies.some(
      s => s.strategyName === BildStrategies.Primary
    ),
    [BildStrategies.Secondary]: courseStrategies.some(
      s => s.strategyName === BildStrategies.Secondary
    ),
  }
}

function isBILDTrainerCourse(courseLevel: Course_Level_Enum) {
  return [
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ].includes(courseLevel)
}
