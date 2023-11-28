import { Meta, StoryObj } from '@storybook/react'

import { SearchTrainers } from '@app/components/SearchTrainers/SearchTrainers'
import {
  Course_Level_Enum,
  Course_Type_Enum,
  CourseTrainerType,
} from '@app/generated/graphql'

export default {
  title: 'components/SearchTrainers',
  component: SearchTrainers,
} as Meta<typeof SearchTrainers>

type Story = StoryObj<typeof SearchTrainers>

export const Default: Story = {
  args: {
    trainerType: CourseTrainerType.Assistant,
    courseLevel: Course_Level_Enum.Level_1,
    courseSchedule: {
      start: '2024-01-01',
      end: '2024-01-01',
    },
    courseType: Course_Type_Enum.Open,
  },
}
