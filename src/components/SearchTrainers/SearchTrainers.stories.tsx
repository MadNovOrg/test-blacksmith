import { Meta, StoryObj } from '@storybook/react'

import { SearchTrainers } from '@app/components/SearchTrainers/SearchTrainers'
import { CourseLevel, CourseTrainerType } from '@app/generated/graphql'
import { CourseType } from '@app/types'

export default {
  title: 'components/SearchTrainers',
  component: SearchTrainers,
} as Meta<typeof SearchTrainers>

type Story = StoryObj<typeof SearchTrainers>

export const Default: Story = {
  args: {
    trainerType: CourseTrainerType.Assistant,
    courseLevel: CourseLevel.Level_1,
    courseSchedule: {
      start: '2024-01-01',
      end: '2024-01-01',
    },
    courseType: CourseType.OPEN,
  },
}
