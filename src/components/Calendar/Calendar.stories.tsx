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
          {
            colorClass: 'text-white bg-lime-500',
            start: addDays(now(), -2),
            end: addDays(now(), 2),
          },
          {
            colorClass: 'text-white bg-yellow-500',
            start: addDays(now(), 12),
            end: addDays(now(), 15),
          },
          {
            colorClass: 'text-white bg-teal-500',
            start: addDays(now(), 37),
            end: addDays(now(), 39),
          },
          {
            colorClass: 'text-white bg-purple-500',
            start: addDays(now(), 64),
            end: addDays(now(), 69),
          },
        ]}
      />
    </div>
  )
}

export const Basic = Template.bind({})
