import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import { isModeratorMandatory, isModeratorNeeded } from '.'

test("reaccreditation course doesn't need a moderator", () => {
  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.Level_1,
      courseType: Course_Type_Enum.Open,
      forAustralia: false,
      isReaccreditation: true,
    }),
  ).toBe(false)
})

test("indirect course doesn't need a moderator", () => {
  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.Level_1,
      courseType: Course_Type_Enum.Indirect,
      forAustralia: false,
      isReaccreditation: false,
    }),
  ).toBe(false)
})

test('intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course needs a moderator', () => {
  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.IntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
      forAustralia: false,
      isReaccreditation: false,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.AdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
      forAustralia: false,
      isReaccreditation: false,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.BildIntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
      forAustralia: false,
      isReaccreditation: false,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.BildAdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
      forAustralia: false,
      isReaccreditation: false,
    }),
  ).toBe(true)
})

test('Closed Foundation Trainer course needs a moderator for Australia', () => {
  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.FoundationTrainer,
      courseType: Course_Type_Enum.Closed,
      forAustralia: true,
      isReaccreditation: false,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      courseLevel: Course_Level_Enum.FoundationTrainer,
      courseType: Course_Type_Enum.Closed,
      forAustralia: false,
      isReaccreditation: false,
    }),
  ).toBe(false)
})

test('moderator is mandatory for closed intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course', () => {
  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.IntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
      isUK: true,
    }),
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.AdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
      isUK: true,
    }),
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildIntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
      isUK: true,
    }),
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildAdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
      isUK: true,
    }),
  ).toBe(true)
})

test('moderator is not mandatory for open intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course', () => {
  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.IntermediateTrainer,
      courseType: Course_Type_Enum.Open,
      isUK: true,
    }),
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.AdvancedTrainer,
      courseType: Course_Type_Enum.Open,
      isUK: true,
    }),
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildIntermediateTrainer,
      courseType: Course_Type_Enum.Open,
      isUK: true,
    }),
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildAdvancedTrainer,
      courseType: Course_Type_Enum.Open,
      isUK: true,
    }),
  ).toBe(false)
})
