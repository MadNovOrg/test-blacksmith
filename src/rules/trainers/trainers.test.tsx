import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import { isModeratorNeeded, courseLevelsWithModeratorField } from '.'

describe('trainer rules', () => {
  it("indirect course doesn't need a moderator", () => {
    expect(
      isModeratorNeeded({
        courseLevel: Course_Level_Enum.Level_1,
        courseType: Course_Type_Enum.Indirect,
      }),
    ).toBe(false)
  })

  it.each(courseLevelsWithModeratorField)(
    '%s level needs a moderator',
    level => {
      ;[Course_Type_Enum.Closed, Course_Type_Enum.Open].forEach(courseType => {
        expect(
          isModeratorNeeded({
            courseLevel: level,
            courseType: courseType,
          }),
        ).toBe(true)
      })
    },
  )
})
