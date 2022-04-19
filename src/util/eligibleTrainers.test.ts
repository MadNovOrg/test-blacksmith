import { CourseLevel, SearchTrainerAvailability } from '@app/types'

import { buildProfile } from '@test/mock-data-utils'

import { eligibleTrainers } from './eligibleTrainers'

describe('eligibleTrainers', () => {
  it('returns empty array when no trainers have valid level', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id),
      makeTrainerLevel(trainers[1].id),
      makeTrainerLevel(trainers[2].id),
    ]

    const eligible = eligibleTrainers(CourseLevel.LEVEL_1, trainers, levels)

    expect(eligible).toStrictEqual([])
  })

  it('L1 & L2: allows INTERMEDIATE trainers', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id, [CourseLevel.INTERMEDIATE]), // expected valid
      makeTrainerLevel(trainers[1].id, [CourseLevel.LEVEL_1]),
      makeTrainerLevel(trainers[2].id, [CourseLevel.LEVEL_2]),
    ]

    const L1_eligible = eligibleTrainers(CourseLevel.LEVEL_1, trainers, levels)
    expect(L1_eligible).toHaveLength(1)
    expect(L1_eligible[0].id).toBe(trainers[0].id)
    expect(L1_eligible[0].levels).toStrictEqual([CourseLevel.INTERMEDIATE])

    const L2_eligible = eligibleTrainers(CourseLevel.LEVEL_2, trainers, levels)
    expect(L2_eligible).toHaveLength(1)
    expect(L2_eligible[0].id).toBe(trainers[0].id)
    expect(L2_eligible[0].levels).toStrictEqual([CourseLevel.INTERMEDIATE])
  })

  it('L1 & L2: allows ADVANCED trainers', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id, [CourseLevel.LEVEL_1]),
      makeTrainerLevel(trainers[1].id, [CourseLevel.ADVANCED]), // expected valid
      makeTrainerLevel(trainers[2].id, [CourseLevel.LEVEL_2]),
    ]

    const L1_eligible = eligibleTrainers(CourseLevel.LEVEL_1, trainers, levels)
    expect(L1_eligible).toHaveLength(1)
    expect(L1_eligible[0].id).toBe(trainers[1].id)
    expect(L1_eligible[0].levels).toStrictEqual([CourseLevel.ADVANCED])

    const L2_eligible = eligibleTrainers(CourseLevel.LEVEL_2, trainers, levels)
    expect(L2_eligible).toHaveLength(1)
    expect(L2_eligible[0].id).toBe(trainers[1].id)
    expect(L2_eligible[0].levels).toStrictEqual([CourseLevel.ADVANCED])
  })

  it('INTERMEDIATE: allows INTERMEDIATE trainers', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id, [CourseLevel.LEVEL_1]),
      makeTrainerLevel(trainers[1].id, [CourseLevel.LEVEL_2]),
      makeTrainerLevel(trainers[2].id, [CourseLevel.INTERMEDIATE]), // expected valid
    ]

    const courseLevel = CourseLevel.INTERMEDIATE
    const eligible = eligibleTrainers(courseLevel, trainers, levels)

    expect(eligible).toHaveLength(1)
    expect(eligible[0].id).toBe(trainers[2].id)
    expect(eligible[0].levels).toStrictEqual([CourseLevel.INTERMEDIATE])
  })

  it('INTERMEDIATE: allows ADVANCED trainers', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id, [CourseLevel.ADVANCED]), // expected valid
      makeTrainerLevel(trainers[1].id, [CourseLevel.LEVEL_2]),
      makeTrainerLevel(trainers[2].id, [CourseLevel.LEVEL_1]),
    ]

    const courseLevel = CourseLevel.INTERMEDIATE
    const eligible = eligibleTrainers(courseLevel, trainers, levels)

    expect(eligible).toHaveLength(1)
    expect(eligible[0].id).toBe(trainers[0].id)
    expect(eligible[0].levels).toStrictEqual([CourseLevel.ADVANCED])
  })

  it('ADVANCED: allows ADVANCED trainers', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id, [CourseLevel.ADVANCED]), // expected valid
      makeTrainerLevel(trainers[1].id, [CourseLevel.INTERMEDIATE]),
      makeTrainerLevel(trainers[2].id, [CourseLevel.LEVEL_2]),
    ]

    const courseLevel = CourseLevel.ADVANCED
    const eligible = eligibleTrainers(courseLevel, trainers, levels)

    expect(eligible).toHaveLength(1)
    expect(eligible[0].id).toBe(trainers[0].id)
    expect(eligible[0].levels).toStrictEqual([CourseLevel.ADVANCED])
  })

  it('BILD: allows BILD trainers', async () => {
    const trainers = [buildProfile(), buildProfile(), buildProfile()]
    const levels = [
      makeTrainerLevel(trainers[0].id, [CourseLevel.ADVANCED]),
      makeTrainerLevel(trainers[1].id, [CourseLevel.INTERMEDIATE]),
      makeTrainerLevel(trainers[2].id, [CourseLevel.BILD_ACT]), // expected valid
    ]

    const courseLevel = CourseLevel.BILD_ACT
    const eligible = eligibleTrainers(courseLevel, trainers, levels)

    expect(eligible).toHaveLength(1)
    expect(eligible[0].id).toBe(trainers[2].id)
    expect(eligible[0].levels).toStrictEqual([CourseLevel.BILD_ACT])
  })
})

/**
 * Helpers
 */

function makeTrainerLevel(profile_id: string, levels: CourseLevel[] = []) {
  return {
    profile_id,
    availability: SearchTrainerAvailability.AVAILABLE,
    levels,
  }
}
