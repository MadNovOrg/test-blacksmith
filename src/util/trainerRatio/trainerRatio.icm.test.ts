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

describe('getRequiredTrainersV2', () => {
  let criteria: TrainerRatioCriteria

  beforeEach(() => {
    criteria = {
      courseLevel: Course_Level_Enum.Level_1,
      deliveryType: Course_Delivery_Type_Enum.F2F,
      maxParticipants: 0,
      reaccreditation: false,
      type: Course_Type_Enum.Open,
    }
  })

  test.each([
    Course_Level_Enum.Level_1,
    Course_Level_Enum.Level_2,
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.ThreeDaySafetyResponseTrainer,
  ])('assist ratio value for %s course', courseLevel => {
    criteria.courseLevel = courseLevel
    criteria.type = Course_Type_Enum.Open

    // Below threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 11,
        })
      )
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Equal to threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 12,
        })
      )
    ).toEqual({
      min: 0,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 13 }))
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
    ).toEqual({
      min: 1,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
    ).toEqual({
      min: 2,
      max: 2,
    })
  })

  test.each([Course_Level_Enum.Level_1, Course_Level_Enum.Level_2])(
    'assist ratio value for %s Indirect course with no reaccreditation and without AOL',
    courseLevel => {
      criteria.courseLevel = courseLevel
      criteria.reaccreditation = false
      criteria.type = Course_Type_Enum.Indirect
      criteria.usesAOL = false

      // Below threshold
      expect(
        getRequiredAssistants(
          extend({}, criteria, {
            maxParticipants: 23,
          })
        )
      ).toEqual({
        min: 1,
        max: 1,
      })

      // Equal to threshold
      expect(
        getRequiredAssistants(
          extend({}, criteria, {
            maxParticipants: 24,
          })
        )
      ).toEqual({
        min: 1,
        max: 2,
      })

      // Above threshold
      expect(
        getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
      ).toEqual({
        min: 2,
        max: 2,
      })

      // Next increment threshold
      expect(
        getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
      ).toEqual({
        min: 2,
        max: 3,
      })

      // Above next increment threshold
      expect(
        getRequiredAssistants(extend({}, criteria, { maxParticipants: 37 }))
      ).toEqual({
        min: 3,
        max: 3,
      })
    }
  )

  it('test assist ratio value for Open Virtual Level 1 course', () => {
    criteria.courseLevel = Course_Level_Enum.Level_1
    criteria.deliveryType = Course_Delivery_Type_Enum.Virtual
    criteria.type = Course_Type_Enum.Open

    // Below threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 23,
        })
      )
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Equal to threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 24,
        })
      )
    ).toEqual({
      min: 0,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
    ).toEqual({
      min: 1,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 37 }))
    ).toEqual({
      min: 2,
      max: 2,
    })
  })

  it('test assist ratio value for Advanced course', () => {
    criteria.courseLevel = Course_Level_Enum.Advanced

    // Below threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 7,
        })
      )
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Equal to threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 8,
        })
      )
    ).toEqual({
      min: 0,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 9 }))
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 16 }))
    ).toEqual({
      min: 1,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 17 }))
    ).toEqual({
      min: 2,
      max: 2,
    })
  })

  it('test assist ratio value for Advanced Trainer course', () => {
    criteria.courseLevel = Course_Level_Enum.AdvancedTrainer

    // Below threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 11,
        })
      )
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Equal to threshold
    expect(
      getRequiredAssistants(
        extend({}, criteria, {
          maxParticipants: 12,
        })
      )
    ).toEqual({
      min: 1,
      max: 2,
    })

    // Above threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 13 }))
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
    ).toEqual({
      min: 2,
      max: 3,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
    ).toEqual({
      min: 3,
      max: 3,
    })
  })
})
