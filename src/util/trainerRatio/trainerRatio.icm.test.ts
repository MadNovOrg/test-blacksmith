import { extend } from 'lodash-es'
import { describe } from 'vitest'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import {
  getRequiredAssistants,
  TrainerRatioCriteria,
} from '@app/util/trainerRatio/trainerRatio.icm'

let criteria: TrainerRatioCriteria

// Shared test helpers
const testThresholdScenarios = (
  description: string,
  setup: (criteria: TrainerRatioCriteria) => void,
  thresholds: {
    below: number
    equal: number
    above: number
    nextEqual: number
    nextAbove: number
  },
  expected: {
    below: { min: number; max: number }
    equal: { min: number; max: number }
    above: { min: number; max: number }
    nextEqual: { min: number; max: number }
    nextAbove: { min: number; max: number }
  },
) => {
  it(description, () => {
    setup(criteria)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.below }),
      ),
    ).toEqual(expected.below)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.equal }),
      ),
    ).toEqual(expected.equal)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.above }),
      ),
    ).toEqual(expected.above)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.nextEqual }),
      ),
    ).toEqual(expected.nextEqual)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.nextAbove }),
      ),
    ).toEqual(expected.nextAbove)
  })
}

const testMultipleLevels = (
  levels: Course_Level_Enum[],
  description: string,
  setup: (criteria: TrainerRatioCriteria, level: Course_Level_Enum) => void,
  thresholds: {
    below: number
    equal: number
    above: number
    nextEqual: number
    nextAbove: number
  },
  expected: {
    below: { min: number; max: number }
    equal: { min: number; max: number }
    above: { min: number; max: number }
    nextEqual: { min: number; max: number }
    nextAbove: { min: number; max: number }
  },
) => {
  test.each(levels)(description, level => {
    setup(criteria, level)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.below }),
      ),
    ).toEqual(expected.below)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.equal }),
      ),
    ).toEqual(expected.equal)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.above }),
      ),
    ).toEqual(expected.above)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.nextEqual }),
      ),
    ).toEqual(expected.nextEqual)

    expect(
      getRequiredAssistants(
        extend({}, criteria, { maxParticipants: thresholds.nextAbove }),
      ),
    ).toEqual(expected.nextAbove)
  })
}

describe('getRequiredTrainersV2', () => {
  beforeEach(() => {
    criteria = {
      courseLevel: Course_Level_Enum.Level_1,
      deliveryType: Course_Delivery_Type_Enum.F2F,
      isUKCountry: true,
      maxParticipants: 0,
      reaccreditation: false,
      type: Course_Type_Enum.Open,
      isAustraliaRegion: false,
    }
  })

  // Standard Open Course tests
  testMultipleLevels(
    [
      Course_Level_Enum.Level_1,
      Course_Level_Enum.Level_2,
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.FoundationTrainerPlus,
    ],
    'assist ratio value for %s course',
    (criteria, courseLevel) => {
      criteria.courseLevel = courseLevel
      criteria.type = Course_Type_Enum.Open
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // Indirect course with no reaccreditation and without AOL
  testMultipleLevels(
    [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2],
    'assist ratio value for %s Indirect course with no reaccreditation and without AOL',
    (criteria, courseLevel) => {
      criteria.courseLevel = courseLevel
      criteria.reaccreditation = false
      criteria.type = Course_Type_Enum.Indirect
      criteria.usesAOL = false
    },
    {
      below: 23,
      equal: 24,
      above: 25,
      nextEqual: 36,
      nextAbove: 37,
    },
    {
      below: { min: 1, max: 1 },
      equal: { min: 1, max: 2 },
      above: { min: 2, max: 2 },
      nextEqual: { min: 2, max: 3 },
      nextAbove: { min: 3, max: 3 },
    },
  )

  // Indirect course with AOL and no reaccreditation
  testMultipleLevels(
    [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2],
    'assist ratio value for %s Indirect course with AOL and no reaccreditation',
    (criteria, courseLevel) => {
      criteria.courseLevel = courseLevel
      criteria.reaccreditation = false
      criteria.type = Course_Type_Enum.Indirect
      criteria.usesAOL = true
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // Indirect course with reaccreditation and without AOL
  testMultipleLevels(
    [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2],
    'assist ratio value for %s Indirect course with reaccreditation and without AOL',
    (criteria, courseLevel) => {
      criteria.courseLevel = courseLevel
      criteria.reaccreditation = true
      criteria.type = Course_Type_Enum.Indirect
      criteria.usesAOL = false
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // Open Virtual Level 1 course
  testThresholdScenarios(
    'test assist ratio value for Open Virtual Level 1 course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_1
      criteria.deliveryType = Course_Delivery_Type_Enum.Virtual
      criteria.type = Course_Type_Enum.Open
    },
    {
      below: 23,
      equal: 24,
      above: 25,
      nextEqual: 36,
      nextAbove: 37,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // Advanced course
  testThresholdScenarios(
    'test assist ratio value for Advanced course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Advanced
    },
    {
      below: 7,
      equal: 8,
      above: 9,
      nextEqual: 16,
      nextAbove: 17,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // Advanced Trainer Open courses
  const testAdvancedTrainerOpen = (reaccreditation: boolean) => {
    testThresholdScenarios(
      `test assist ratio value for Advanced Trainer Open ${
        reaccreditation ? 'Reaccreditation' : 'Non-Reaccreditation'
      } course`,
      criteria => {
        criteria.courseLevel = Course_Level_Enum.AdvancedTrainer
        criteria.type = Course_Type_Enum.Open
        criteria.reaccreditation = reaccreditation
      },
      {
        below: 11,
        equal: 12,
        above: 13,
        nextEqual: 24,
        nextAbove: 25,
      },
      {
        below: { min: 1, max: 1 },
        equal: { min: 1, max: 2 },
        above: { min: 2, max: 2 },
        nextEqual: { min: 2, max: 3 },
        nextAbove: { min: 3, max: 3 },
      },
    )
  }
  testAdvancedTrainerOpen(true)
  testAdvancedTrainerOpen(false)

  // Indirect Advanced Modules course
  testThresholdScenarios(
    'test assist ratio value for Indirect Advanced Modules course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Advanced
      criteria.type = Course_Type_Enum.Indirect
    },
    {
      below: 15,
      equal: 16,
      above: 17,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 1, max: 1 },
      equal: { min: 1, max: 2 },
      above: { min: 2, max: 2 },
      nextEqual: { min: 2, max: 3 },
      nextAbove: { min: 3, max: 3 },
    },
  )

  // Advanced Trainer Closed courses
  const testAdvancedTrainerClosed = (reaccreditation: boolean) => {
    testThresholdScenarios(
      `test assist ratio value for Advanced Trainer Closed ${
        reaccreditation ? 'Reaccreditation' : 'Non-Reaccreditation'
      } course`,
      criteria => {
        criteria.courseLevel = Course_Level_Enum.AdvancedTrainer
        criteria.type = Course_Type_Enum.Closed
        criteria.reaccreditation = reaccreditation
      },
      {
        below: 23,
        equal: 24,
        above: 25,
        nextEqual: 36,
        nextAbove: 37,
      },
      {
        below: { min: 1, max: 1 },
        equal: { min: 1, max: 2 },
        above: { min: 2, max: 2 },
        nextEqual: { min: 2, max: 3 },
        nextAbove: { min: 3, max: 3 },
      },
    )
  }
  testAdvancedTrainerClosed(true)
  testAdvancedTrainerClosed(false)

  // Level 1 BS Closed course
  testThresholdScenarios(
    'test assist ratio for Level 1 BS Closed course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_1Bs
      criteria.type = Course_Type_Enum.Closed
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // Level 1 BS Indirect course
  testThresholdScenarios(
    'test assist ratio for Level 1 BS Indirect course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_1Bs
      criteria.type = Course_Type_Enum.Indirect
    },
    {
      below: 17,
      equal: 18,
      above: 19,
      nextEqual: 30,
      nextAbove: 31,
    },
    {
      below: { min: 1, max: 1 },
      equal: { min: 1, max: 2 },
      above: { min: 2, max: 2 },
      nextEqual: { min: 2, max: 3 },
      nextAbove: { min: 3, max: 3 },
    },
  )

  // International Indirect courses
  testMultipleLevels(
    [
      Course_Level_Enum.Level_1,
      Course_Level_Enum.Level_2,
      Course_Level_Enum.Level_1Bs,
    ],
    'assist ratio value for %s international Indirect course',
    (criteria, courseLevel) => {
      criteria.courseLevel = courseLevel
      criteria.type = Course_Type_Enum.Indirect
      criteria.isUKCountry = false
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )
})

describe('getRequiredTrainersV2 ANZ', () => {
  beforeEach(() => {
    criteria = {
      courseLevel: Course_Level_Enum.Level_1,
      deliveryType: Course_Delivery_Type_Enum.F2F,
      isUKCountry: true,
      maxParticipants: 0,
      reaccreditation: false,
      type: Course_Type_Enum.Open,
      isAustraliaRegion: true,
    }
  })

  // ANZ L1 Indirect
  testThresholdScenarios(
    'assist ratio value for L1 Indirect course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_1
      criteria.type = Course_Type_Enum.Indirect
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // ANZ L2 Indirect
  testThresholdScenarios(
    'assist ratio value for L2 Indirect course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_2
      criteria.type = Course_Type_Enum.Indirect
    },
    {
      below: 23,
      equal: 24,
      above: 25,
      nextEqual: 36,
      nextAbove: 37,
    },
    {
      below: { min: 1, max: 1 },
      equal: { min: 1, max: 2 },
      above: { min: 2, max: 2 },
      nextEqual: { min: 2, max: 3 },
      nextAbove: { min: 3, max: 3 },
    },
  )

  // ANZ L1Bs Indirect
  testThresholdScenarios(
    'assist ratio value for L1Bs Indirect course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_1Bs
      criteria.type = Course_Type_Enum.Indirect
    },
    {
      below: 11,
      equal: 12,
      above: 13,
      nextEqual: 24,
      nextAbove: 25,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )

  // ANZ Level 1 Non-Physical Indirect
  testThresholdScenarios(
    'test assist ratio value for Level 1 Non-Physical Indirect course',
    criteria => {
      criteria.courseLevel = Course_Level_Enum.Level_1Np
      criteria.type = Course_Type_Enum.Indirect
      criteria.isUKCountry = false
    },
    {
      below: 23,
      equal: 24,
      above: 25,
      nextEqual: 48,
      nextAbove: 49,
    },
    {
      below: { min: 0, max: 0 },
      equal: { min: 0, max: 1 },
      above: { min: 1, max: 1 },
      nextEqual: { min: 1, max: 2 },
      nextAbove: { min: 2, max: 2 },
    },
  )
})
