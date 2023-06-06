import { CourseLevel, CourseType } from '@app/types'

import { isModeratorMandatory, isModeratorNeeded } from '.'

test("reaccreditation course doesn't need a moderator", () => {
  expect(
    isModeratorNeeded({
      isReaccreditation: true,
      courseLevel: CourseLevel.Level_1,
      courseType: CourseType.OPEN,
    })
  ).toBe(false)
})

test("indirect course doesn't need a moderator", () => {
  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: CourseLevel.Level_1,
      courseType: CourseType.INDIRECT,
    })
  ).toBe(false)
})

test('intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course needs a moderator', () => {
  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: CourseLevel.IntermediateTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)

  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: CourseLevel.AdvancedTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)

  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: CourseLevel.BildIntermediateTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)

  expect(
    isModeratorNeeded({
      isReaccreditation: false,
      courseLevel: CourseLevel.BildAdvancedTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)
})

test('moderator is mandatory for closed intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course', () => {
  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.IntermediateTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.AdvancedTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.BildIntermediateTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.BildAdvancedTrainer,
      courseType: CourseType.CLOSED,
    })
  ).toBe(true)
})

test('moderator is not mandatory for open intermediate trainer, advanced trainer, Bild intermediate trainer, or Bild advanced trainer course', () => {
  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.IntermediateTrainer,
      courseType: CourseType.OPEN,
    })
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.AdvancedTrainer,
      courseType: CourseType.OPEN,
    })
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.BildIntermediateTrainer,
      courseType: CourseType.OPEN,
    })
  ).toBe(false)

  expect(
    isModeratorMandatory({
      isReaccreditation: false,
      courseLevel: CourseLevel.BildAdvancedTrainer,
      courseType: CourseType.OPEN,
    })
  ).toBe(false)
})
