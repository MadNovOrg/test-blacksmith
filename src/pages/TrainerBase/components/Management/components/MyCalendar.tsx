import React from 'react'
import addDays from 'date-fns/addDays'

import { Calendar } from '@app/components/Calendar'

import { now } from '@app/util'

type MyCalendarProps = unknown

export const MyCalendar: React.FC<MyCalendarProps> = () => {
  return (
    <div className="">
      <p className="font-light text-3xl">My Calendar</p>

      <div className="mt-8 flex">
        <div className="flex grow-[3]">
          <div className="w-full max-w-[500px]">
            <Calendar
              highlight={[
                { color: '', range: [addDays(now(), -11), addDays(now(), 2)] },
                { color: '', range: [addDays(now(), 12), addDays(now(), 15)] },
                { color: '', range: [addDays(now(), 37), addDays(now(), 39)] },
                { color: '', range: [addDays(now(), 64), addDays(now(), 69)] },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col grow"></div>
      </div>
    </div>
  )
}
