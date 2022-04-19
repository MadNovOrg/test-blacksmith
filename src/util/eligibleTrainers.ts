import { CourseLevel, SearchTrainer } from '@app/types'

export type TrainerExtra = Required<
  Pick<SearchTrainer, 'availability' | 'levels'>
>

export function eligibleTrainers(
  courseLevel: CourseLevel,
  trainers: SearchTrainer[],
  getTrainersLevels: Array<TrainerExtra & { profile_id: string }>
) {
  const trainersLevels = getTrainersLevels.reduce<Map<string, TrainerExtra>>(
    (acc, { profile_id, availability, levels }) => {
      return acc.set(profile_id, { availability, levels })
    },
    new Map()
  )

  const eligible = trainers.filter(t => {
    return isEligible(courseLevel, trainersLevels.get(t.id)?.levels)
  })

  return eligible.map(t => ({ ...t, ...trainersLevels.get(t.id) }))
}

function isEligible(
  courseLevel: CourseLevel,
  trainerLevels: CourseLevel[] = [],
  isSeniorOrPrincipal = true // TODO: for next PR
) {
  const activeLevels = new Set(trainerLevels)

  const levelsMap: Record<CourseLevel, () => boolean> = {
    [CourseLevel.LEVEL_1]: () => {
      const allowedLevels = [CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED]
      return allowedLevels.some(l => activeLevels.has(l))
    },

    [CourseLevel.LEVEL_2]: () => {
      const allowedLevels = [CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED]
      return allowedLevels.some(l => activeLevels.has(l))
    },

    [CourseLevel.INTERMEDIATE]: () => {
      const allowedLevels = [CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED]
      return isSeniorOrPrincipal && allowedLevels.some(l => activeLevels.has(l))
    },

    [CourseLevel.ADVANCED]: () => {
      const allowedLevels = [CourseLevel.ADVANCED]
      return isSeniorOrPrincipal && allowedLevels.some(l => activeLevels.has(l))
    },

    [CourseLevel.BILD_ACT]: () => {
      const allowedLevels = [CourseLevel.BILD_ACT]
      return isSeniorOrPrincipal && allowedLevels.some(l => activeLevels.has(l))
    },
  }

  return levelsMap[courseLevel]()
}
