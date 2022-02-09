import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import addDays from 'date-fns/addDays'

import { Calendar } from '.'

import { now } from '@app/util'

export default {
  title: 'components/Calendar',
  component: Calendar,
} as ComponentMeta<typeof Calendar>

const Template: ComponentStory<typeof Calendar> = () => {
  return (
    <div className="w-[500px] h-[400px] relative">
      <Calendar
        highlight={[
          { color: '', range: [addDays(now(), -2), addDays(now(), 2)] },
          { color: '', range: [addDays(now(), 12), addDays(now(), 15)] },
          { color: '', range: [addDays(now(), 37), addDays(now(), 39)] },
          { color: '', range: [addDays(now(), 64), addDays(now(), 69)] },
        ]}
      />
    </div>
  )
}

export const Basic = Template.bind({})
