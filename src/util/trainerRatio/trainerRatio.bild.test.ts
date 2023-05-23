import { Course_Level_Enum } from '@app/generated/graphql'
import { BildStrategies, CourseLevel } from '@app/types'

import {
  BildRatioCriteria,
  getRequiredAssistantsBild,
  getRequiredLeadsBild,
  toRange,
} from './trainerRatio.bild'

describe('Bild trainer ratios', () => {
  it('requires 1 lead regardless of participants and 1 assist per next 12 participants after 12 participants have been registered', () => {
    const criteria: BildRatioCriteria = {
      isConversion: true,
      numberParticipants: 11,
      level: CourseLevel.BildIntermediateTrainer,
      isReaccreditation: false,
      strategies: [],
    }

    expect(getRequiredLeadsBild(criteria)).toEqual(toRange(1))
    expect(getRequiredAssistantsBild(criteria)).toEqual(toRange(0))

    expect(
      getRequiredLeadsBild({ ...criteria, numberParticipants: 25 })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({ ...criteria, numberParticipants: 25 })
    ).toEqual(toRange(2))
  })

  it(`requires 1 lead and 1 assist per 12 participants given a course is ${Course_Level_Enum.BildIntermediateTrainer} and is not reaccreditation`, () => {
    const criteria: BildRatioCriteria = {
      isConversion: false,
      numberParticipants: 25,
      level: CourseLevel.BildIntermediateTrainer,
      isReaccreditation: false,
      strategies: [],
    }

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))
  })

  it(`requires 1 lead per 12 participants and 1 assist above 12 participants given a course is ${Course_Level_Enum.BildIntermediateTrainer} and is reaccreditation`, () => {
    const criteria: BildRatioCriteria = {
      isConversion: false,
      numberParticipants: 25,
      level: CourseLevel.BildIntermediateTrainer,
      isReaccreditation: true,
      strategies: [],
    }

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(0))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(2))
  })

  it(`requires 1 lead and 1 assist per 12 participants given a course is ${Course_Level_Enum.BildAdvancedTrainer} regardless of reaccreditation`, () => {
    const criteria: BildRatioCriteria = {
      isConversion: false,
      numberParticipants: 25,
      level: CourseLevel.BildAdvancedTrainer,
      isReaccreditation: true,
      strategies: [],
    }

    expect(
      getRequiredLeadsBild({
        ...criteria,
        isReaccreditation: true,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        isReaccreditation: false,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        isReaccreditation: false,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        isReaccreditation: true,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))
  })

  it(`requires 1 lead and 1 assist per 12 participants given a course is ${Course_Level_Enum.BildRegular} and ${BildStrategies.Primary} is the only selected strategy`, () => {
    const criteria: BildRatioCriteria = {
      isConversion: false,
      numberParticipants: 25,
      level: CourseLevel.BildRegular,
      isReaccreditation: false,
      strategies: [BildStrategies.Primary],
    }

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))
  })

  it(`requires 1 lead and 1 assist per 12 participants given a course is ${Course_Level_Enum.BildRegular} and all strategies except ${BildStrategies.RestrictiveTertiaryAdvanced} is selected`, () => {
    const criteria: BildRatioCriteria = {
      isConversion: false,
      numberParticipants: 25,
      level: CourseLevel.BildRegular,
      isReaccreditation: false,
      strategies: [
        BildStrategies.Primary,
        BildStrategies.Secondary,
        BildStrategies.NonRestrictiveTertiary,
        BildStrategies.RestrictiveTertiaryIntermediate,
      ],
    }

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 12,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 36,
      })
    ).toEqual(toRange(3))
  })

  it(`requires 1 lead and 1 assist per 8 participants given a course is ${Course_Level_Enum.BildRegular} and all strategies have been selected`, () => {
    const criteria: BildRatioCriteria = {
      isConversion: false,
      numberParticipants: 25,
      level: CourseLevel.BildRegular,
      isReaccreditation: false,
      strategies: [
        BildStrategies.Primary,
        BildStrategies.Secondary,
        BildStrategies.NonRestrictiveTertiary,
        BildStrategies.RestrictiveTertiaryIntermediate,
        BildStrategies.RestrictiveTertiaryAdvanced,
      ],
    }

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 8,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 8,
      })
    ).toEqual(toRange(1))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 16,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 16,
      })
    ).toEqual(toRange(2))

    expect(
      getRequiredLeadsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(3))

    expect(
      getRequiredAssistantsBild({
        ...criteria,
        numberParticipants: 24,
      })
    ).toEqual(toRange(3))
  })
})
