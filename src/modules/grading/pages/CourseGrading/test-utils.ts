import { build } from '@jackfranklin/test-data-bot'

import {
  Accreditors_Enum,
  CourseGradingDataQuery,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { chance, userEvent, screen, within } from '@test/index'

export const buildGradingCourse = build<
  NonNullable<CourseGradingDataQuery['course']>
>({
  fields: {
    id: chance.integer(),
    name: chance.name(),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Level_1,
    deliveryType: Course_Delivery_Type_Enum.F2F,
    accreditedBy: Accreditors_Enum.Icm,
    curriculum: null,
    participants: [
      {
        id: chance.guid(),
        profile: {
          id: chance.guid(),
          fullName: chance.name({ full: true }),
        },
      },
    ],
    modules: [],
    bildModules: [],
    trainers: [
      { type: Course_Trainer_Type_Enum.Leader, profile_id: chance.guid() },
    ],
  },
})

export async function selectGradingOption(grade: string) {
  await userEvent.click(screen.getByTestId('course-grading-menu-selected'))
  const menu = screen.getByTestId('course-grading-options')
  await userEvent.click(within(menu).getByText(grade))
}
