import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import format from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import startOfWeek from 'date-fns/startOfWeek'
import endOfMonth from 'date-fns/endOfMonth'
import endOfWeek from 'date-fns/endOfWeek'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import startOfMonth from 'date-fns/startOfMonth'
import { isSameMonth, addDays, isToday, isAfter } from 'date-fns/esm'
import getDate from 'date-fns/getDate'
import isSameDay from 'date-fns/isSameDay'
import isBefore from 'date-fns/isBefore'

import { IconButton } from '../IconButton'

import { now } from '@app/util'

type Range = [Date, Date]

type CalendarProps = {
  highlight?: {
    color: string
    range: Range
  }[]
}

export const Calendar: React.FC<CalendarProps> = ({ highlight = [] }) => {
  const [selected, setSelected] = useState<Date>(now())

  const days = useMemo(() => {
    const first = startOfWeek(startOfMonth(selected))
    const last = endOfWeek(endOfMonth(selected))
    const numDays = differenceInCalendarDays(last, first) + 1

    const days = Array.from({ length: numDays }, (_, index) => {
      const date = addDays(first, index)
      const result = highlight.find(({ range: [r1, r2] }) => {
        return r1 <= date && date <= r2
      })

      return {
        date,
        isSelected: isSameDay(date, selected),
        isToday: isToday(date),
        isCurrentMonth: isSameMonth(date, selected),
        color: result?.color,
        isRangeStart: false,
        isRangeEnd: false,
        inRange: false,
      }
    })

    highlight.forEach(h => {
      const [r1, r2] = h.range

      let rangeFlag = false
      days.forEach(d => {
        if (isSameDay(d.date, r2)) {
          d.isRangeEnd = true
          rangeFlag = false
        } else {
          if (!rangeFlag && isAfter(d.date, r1) && isBefore(d.date, r2)) {
            rangeFlag = true
          }
        }

        if (rangeFlag) {
          d.inRange = true
        }

        if (isSameDay(d.date, r1)) {
          d.isRangeStart = true
          rangeFlag = true
        }
      })
    })

    return days
  }, [selected, highlight])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between">
        <IconButton
          name="arrow-left"
          aria-hidden="true"
          onClick={() => setSelected(addMonths(selected, -1))}
        />
        <h2 className="font-light text-2xl text-gray-900 text-center">
          {format(selected, 'MMMM yyyy')}
        </h2>
        <IconButton
          name="arrow-right"
          aria-hidden="true"
          onClick={() => setSelected(addMonths(selected, 1))}
        />
      </div>

      <div className="mt-10 grid grid-cols-7 text-center font-semibold text-lg">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="mt-2 grid grid-cols-7">
        {days.map(day => {
          const isRange = day.isRangeStart || day.inRange || day.isRangeEnd

          return (
            <div
              key={day.date.getTime()}
              className={clsx('flex aspect-square p-2', {
                'pr-0': day.isRangeStart,
                'pl-0': day.isRangeEnd,
                'px-0': day.inRange,
              })}
            >
              <button
                type="button"
                onClick={() => setSelected(day.date)}
                className={clsx(
                  'flex items-center justify-center h-full w-full',
                  'rounded-full text-lg font-light',
                  'bg-gray-50/50',
                  {
                    'text-white bg-navy-500 font-semibold': day.isToday,
                    'text-gray-900': day.isCurrentMonth,
                    'text-gray-200 hover:bg-gray-50':
                      !day.isCurrentMonth && !isRange,
                    'text-white bg-lime-500': isRange,
                    'font-semibold': isRange && day.isCurrentMonth,
                    'hover:bg-gray-200': !isRange && !day.isSelected,
                    'rounded-r-none': day.isRangeStart,
                    'rounded-l-none': day.isRangeEnd,
                    'rounded-none': day.inRange,
                    'bg-navy-500 text-white font-semibold': day.isSelected,
                  }
                )}
              >
                <time dateTime={day.date.toISOString()}>
                  {getDate(day.date)}
                </time>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
