import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  format,
  addMonths,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  differenceInCalendarDays,
  startOfMonth,
  isSameMonth,
  addDays,
  isToday,
  isAfter,
  getDate,
  isSameDay,
  isBefore,
  startOfDay,
  startOfToday,
} from 'date-fns'

import { IconButton } from '../IconButton'

type CalendarProps = {
  highlight?: {
    colorClass: string
    start: Date
    end: Date
  }[]
  onDateSelected?: (day: Date) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  highlight = [],
  onDateSelected,
}) => {
  const [selected, setSelected] = useState<Date>(startOfToday())

  const days = useMemo(() => {
    const first = startOfWeek(startOfMonth(selected))
    const last = endOfWeek(endOfMonth(selected))
    const numDays = differenceInCalendarDays(last, first) + 1

    const days = Array.from({ length: numDays }, (_, index) => {
      const date = addDays(first, index)
      const result = highlight.find(({ start, end }) => {
        return (
          startOfDay(start) <= startOfDay(date) &&
          startOfDay(date) <= startOfDay(end)
        )
      })

      return {
        date,
        isToday: isToday(date),
        isCurrentMonth: isSameMonth(date, selected),
        colorClass: result?.colorClass,
        isRangeStart: false,
        isRangeEnd: false,
        isRangeBetween: false,
      }
    })

    highlight.forEach(({ start, end }) => {
      days.forEach(d => {
        if (isSameDay(d.date, start) && isSameDay(d.date, end)) {
          d.isRangeStart = true
          d.isRangeEnd = true
        } else if (isSameDay(d.date, start)) {
          d.isRangeStart = true
        } else if (isSameDay(d.date, end)) {
          d.isRangeEnd = true
        } else if (isAfter(d.date, start) && isBefore(d.date, end)) {
          d.isRangeBetween = true
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
          const inRange =
            day.isRangeStart || day.isRangeBetween || day.isRangeEnd

          return (
            <div
              key={day.date.getTime()}
              className={clsx('flex aspect-square p-2', {
                'pr-0': day.isRangeStart && !day.isRangeEnd,
                'pl-0': !day.isRangeStart && day.isRangeEnd,
                'px-0': day.isRangeBetween,
              })}
            >
              <button
                type="button"
                onClick={() => {
                  setSelected(day.date)
                  if (onDateSelected) {
                    onDateSelected(day.date)
                  }
                }}
                className={clsx(
                  'flex items-center justify-center h-full w-full',
                  'rounded-full text-lg font-light',
                  inRange && day.colorClass,
                  {
                    'bg-gray-50/50': !inRange,
                    'text-white bg-navy-100 font-semibold': day.isToday,
                    'text-gray-900': day.isCurrentMonth && !inRange,
                    'text-gray-200 hover:bg-gray-50':
                      !day.isCurrentMonth && !inRange,
                    'font-semibold': inRange && day.isCurrentMonth,
                    'hover:bg-gray-200': !inRange,
                    'rounded-r-none': day.isRangeStart && !day.isRangeEnd,
                    'rounded-l-none': !day.isRangeStart && day.isRangeEnd,
                    'rounded-none': day.isRangeBetween,
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
