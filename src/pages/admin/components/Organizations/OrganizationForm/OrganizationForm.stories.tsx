import type { Meta, StoryObj } from '@storybook/react'

import { OrganizationForm } from './OrganizationForm'

import '@app/i18n/config'

export default {
  title: 'components/CancelAttendeeDialog/Title',
  component: OrganizationForm,
  decorators: [],
} as Meta<typeof OrganizationForm>

type Story = StoryObj<typeof OrganizationForm>

export const Default: Story = {
  args: {
    isEditMode: false,
    onSubmit: data => console.log(data),
    setXeroId: () => null,
    error: undefined,
    loading: false,
    editOrgData: {},
  },
}
