import { extend } from 'lodash-es'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { getRequiredLeads } from '@app/util/trainerRatio/index'
import {
  BildRatioCriteria,
  getRequiredAssistantsBild,
} from '@app/util/trainerRatio/trainerRatio.bild'

describe('getRequiredTrainers BILD', () => {
  it("doesn't require a lead trainer if BILD Open type course", () => {
    expect(getRequiredLeads(Course_Type_Enum.Open, false)).toEqual({
      min: 0,
      max: 1,
    })
  })

  it('assist ratio value for Indirect BILD Certified non reaccreditation course', () => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: true,
      level: Course_Level_Enum.BildRegular,
      numberParticipants: 1,
      type: Course_Type_Enum.Indirect,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 12,
        }),
      ),
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 24,
        }),
      ),
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 13 }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 24 }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })
  })

  it('assist ratio value for Indirect BILD Advanced Trainer course', () => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: true,
      level: Course_Level_Enum.BildAdvancedTrainer,
      numberParticipants: 1,
      type: Course_Type_Enum.Indirect,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 11,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 12,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 13 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 24 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 3,
      max: 3,
    })
  })

  it('assist ratio value for Open Reaccreditation BILD Advanced Trainer course', () => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: true,
      level: Course_Level_Enum.BildAdvancedTrainer,
      numberParticipants: 1,
      type: Course_Type_Enum.Open,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 11,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 12,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 13 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 24 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 3,
      max: 3,
    })
  })

  it('assist ratio value for Open Non-Reaccreditation BILD Advanced Trainer course', () => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: false,
      level: Course_Level_Enum.BildAdvancedTrainer,
      numberParticipants: 1,
      type: Course_Type_Enum.Open,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 11,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 12,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 13 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 24 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 3,
      max: 3,
    })
  })

  it('assist ratio value for Closed Reaccreditation BILD Advanced Trainer course', () => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: true,
      level: Course_Level_Enum.BildAdvancedTrainer,
      numberParticipants: 1,
      type: Course_Type_Enum.Closed,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 23,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 24,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 36 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 37 }),
      ),
    ).toEqual({
      min: 3,
      max: 3,
    })
  })

  it('assist ratio value for Closed Non-Reaccreditation BILD Advanced Trainer course', () => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: false,
      level: Course_Level_Enum.BildAdvancedTrainer,
      numberParticipants: 1,
      type: Course_Type_Enum.Closed,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 23,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 24,
        }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 36 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 37 }),
      ),
    ).toEqual({
      min: 3,
      max: 3,
    })
  })

  test.each([
    Course_Level_Enum.BildRegular,
    Course_Level_Enum.BildIntermediateTrainer,
  ])('assist ratio value for %s course', courseLevel => {
    const criteria: BildRatioCriteria = {
      isReaccreditation: false,
      level: courseLevel,
      numberParticipants: 1,
      type: Course_Type_Enum.Open,
    }

    // Below threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          numberParticipants: 11,
        }),
      ),
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Equal to threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, {
          maxParticipants: 12,
        }),
      ),
    ).toEqual({
      min: 0,
      max: 0,
    })

    // Above threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 13 }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 24 }),
      ),
    ).toEqual({
      min: 1,
      max: 1,
    })

    // Above next increment threshold
    expect(
      getRequiredAssistantsBild(
        extend({}, criteria, { numberParticipants: 25 }),
      ),
    ).toEqual({
      min: 2,
      max: 2,
    })
  })
})
