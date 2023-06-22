import { Button, Link, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { RoleName } from '@app/types'

import { buildCourse } from '@test/mock-data-utils'

import { BackButton } from '../BackButton'

import { CourseHeroSummary } from './CourseHeroSummary'

import withAuthContext from '@storybook-decorators/withAuthContext'
import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  title: 'components/CourseHeroSummary',
  component: CourseHeroSummary,
  decorators: [
    withAuthContext({ activeRole: RoleName.USER }),
    withRouterProvider,
  ],
} as Meta<typeof CourseHeroSummary>

type Story = StoryObj<typeof CourseHeroSummary>

export const Default: Story = {
  args: {
    course: buildCourse({}),
  },
}

export const WithBackButton: Story = {
  args: {
    ...Default.args,
    slots: {
      BackButton: () => <BackButton />,
    },
  },
}

export const WithEditButton: Story = {
  args: {
    ...Default.args,
    slots: {
      EditButton: () => <Button>Edit me</Button>,
    },
  },
}

export const WithAdditionalNotes: Story = {
  args: {
    ...Default.args,
    course: buildCourse({
      map: obj => ({
        ...obj,
        notes: 'Additional notes here',
      }),
    }),
  },
}

export const WithSpecialInstructions: Story = {
  args: {
    ...Default.args,
    course: buildCourse({
      map: obj => ({
        ...obj,
        special_instructions: 'Take care 💖',
      }),
    }),
  },
}

export const WithOrderItem: Story = {
  args: {
    ...Default.args,
    slots: {
      OrderItem: () => (
        <Typography>
          Order:{' '}
          <Link href="#" color="Highlight">
            TT-1223333
          </Link>
        </Typography>
      ),
    },
  },
}
