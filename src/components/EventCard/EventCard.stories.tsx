import { Meta, Story } from '@storybook/react'
import React from 'react'

import { EventCard, EventCardProps } from './EventCard'

export default {
  title: 'components/EventCard',
  component: EventCard,
} as Meta

const Template: Story<EventCardProps> = args => {
  return (
    <div className="flex items-center justify-center p-12">
      <EventCard {...args}>
        Unavailable <br />
        Annual Leave
      </EventCard>
    </div>
  )
}

export const BasicExample = Template.bind({})

BasicExample.args = {
  startDate: new Date(2022, 1, 8),
  endDate: new Date(2022, 1, 9),
}
