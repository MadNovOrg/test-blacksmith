import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import { isModeratorMandatory, isModeratorNeeded } from '.'

test("reaccreditation course doesn't need a moderator", () => {
  expect(
    isModeratorNeeded({
      isReaccreditation: true,
      courseLevel: Course_Level_Enum.Level_1,
      courseType: Course_Type_Enum.Open,
    }),
  ).toBe(false)
})

test("indirect course doesn't need a moderator", () => {
  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.Level_1,
      courseType: Course_Type_Enum.Indirect,
    }),
  ).toBe(false)
})

test('intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course needs a moderator', () => {
  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.IntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.AdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildIntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)

  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildAdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)
})

test('moderator is mandatory for closed intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course', () => {
  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.IntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.AdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildIntermediateTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildAdvancedTrainer,
      courseType: Course_Type_Enum.Closed,
    }),
  ).toBe(true)
})

test('moderator is not mandatory for open intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course', () => {
  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.IntermediateTrainer,
      courseType: Course_Type_Enum.Open,
    }),
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.AdvancedTrainer,
      courseType: Course_Type_Enum.Open,
    }),
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildIntermediateTrainer,
      courseType: Course_Type_Enum.Open,
    }),
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: Course_Level_Enum.BildAdvancedTrainer,
      courseType: Course_Type_Enum.Open,
    }),
  ).toBe(false)
})
