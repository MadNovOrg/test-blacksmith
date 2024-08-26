import { Course_Level_Enum, ModuleSettingsQuery } from '@app/generated/graphql'
import { Strategies } from '@app/modules/course/hooks/useBildStrategies'
import { BildStrategies, Strategy } from '@app/types'

export function getPreselectedModules({
  allStrategies,
  courseLevel,
  courseStrategies,
}: {
  allStrategies: Strategies

  courseLevel: Course_Level_Enum
  courseStrategies: { strategyName: string }[]
}) {
  const preselectedModules: Record<string, boolean> = {}

  const isTrainerLevelCourse = courseLevel
    ? [
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ].includes(courseLevel)
    : false

  const hasPrimary = courseStrategies.some(s => s.strategyName === 'PRIMARY')
  const hasSecondary = courseStrategies.some(
    s => s.strategyName === 'SECONDARY',
  )

  if (isTrainerLevelCourse) {
    courseStrategies.forEach(courseStrategy => {
      const strategy = allStrategies.find(
        s => s.name === courseStrategy.strategyName,
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
      s => s.strategyName === BildStrategies.Primary,
    ),
    [BildStrategies.Secondary]: courseStrategies.some(
      s => s.strategyName === BildStrategies.Secondary,
    ),
  }
}

function isBILDTrainerCourse(courseLevel: Course_Level_Enum) {
  return [
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ].includes(courseLevel)
}

function transformSelection(selectedModules: Record<string, boolean>) {
  const transformedSelection: Record<string, Strategy> = {}

  Object.keys(selectedModules).forEach(key => {
    if (selectedModules[key]) {
      const [strategyName, ...parts] = key.split('.')

      if (!transformedSelection[strategyName]) {
        transformedSelection[strategyName] = {
          groups: [],
          modules: [],
        }
      }

      if (parts.length === 2) {
        const [groupName, moduleName] = parts

        const existingGroup = transformedSelection[strategyName].groups?.find(
          group => group.name === groupName,
        )

        let group = transformedSelection[strategyName].groups?.find(
          group => group.name === groupName,
        ) ?? {
          name: groupName,
          modules: [],
        }

        if (!existingGroup) {
          transformedSelection[strategyName].groups?.push(group)
        } else {
          group = existingGroup
        }

        group.modules.push({ name: moduleName })
      } else if (parts.length === 1) {
        const [module] = parts

        transformedSelection[strategyName].modules?.push({ name: module })
      }
    }
  })

  return transformedSelection
}

export const transformBILDModules = ({
  modules,
  strategyModules,
}: {
  modules: ModuleSettingsQuery['moduleSettings']
  strategyModules: Record<string, boolean>
}) => {
  const transformedSelection = transformSelection(strategyModules)
  const modulesSelection: Record<string, Strategy> = {}

  modules.forEach(moduleSetting => {
    modulesSelection[
      moduleSetting.module.displayName ?? moduleSetting.module.name
    ] = {
      groups: [],
      modules: moduleSetting.module.lessons.items,
    }
  })

  return { ...transformedSelection, ...modulesSelection }
}
