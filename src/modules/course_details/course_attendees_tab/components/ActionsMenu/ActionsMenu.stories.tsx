import CircleOutlined from '@mui/icons-material/CircleOutlined'
import type { Meta, StoryObj } from '@storybook/react'
import { Chance } from 'chance'

import { buildParticipant } from '@test/mock-data-utils'

import { ActionsMenu } from './ActionsMenu'

import '@app/i18n/config'

const chance = new Chance()

const buildActions = () =>
  new Array(3).fill(0).map(() => ({
    icon: <CircleOutlined color="primary" />,
    label: chance.word(),
    onClick: () => true,
  }))

export default {
  title: 'components/ActionsMenu',
  component: ActionsMenu,
  decorators: [],
} as Meta<typeof ActionsMenu>

type Story = StoryObj<typeof ActionsMenu>

export const Default: Story = {
  args: {
    item: buildParticipant(),
    actions: buildActions(),
    label: 'Action',
  },
}
