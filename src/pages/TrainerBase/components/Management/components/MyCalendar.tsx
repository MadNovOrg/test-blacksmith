import React, { useMemo } from 'react'
import useSWR from 'swr'

import { Calendar } from '@app/components/Calendar'
import { EventCard } from '@app/components/EventCard'

import {
  QUERY as GetTrainerSchedule,
  ResponseType as GetTrainerScheduleResponseType,
} from '@app/queries/trainer/get-schedule'

type MyCalendarProps = unknown

export const MyCalendar: React.FC<MyCalendarProps> = () => {
  const { data } = useSWR<GetTrainerScheduleResponseType, Error>(
    GetTrainerSchedule
  )

  const schedule = useMemo(() => {
    if (!data) return []

    return data.course.flatMap(c => {
      return c.schedule.map(s => ({
        id: s.id,
        name: s.name,
        start: s.start,
        end: s.end,
        address: s.venue.address,
        attendees: c.participants.aggregate.count,
      }))
    })
  }, [data])

  const ranges = useMemo(
    () =>
      schedule.map(s => ({
        colorClass: 'text-white bg-lime-500',
        start: new Date(s.start),
        end: new Date(s.end),
      })),
    [schedule]
  )

  return (
    <div className="">
      <p className="font-light text-3xl">My Calendar</p>

      <div className="mt-8 flex">
        <div className="flex flex-1">
          <div className="w-full max-w-[500px]">
            <Calendar highlight={ranges} />
          </div>
        </div>
        <div className="flex flex-col w-72 pl-8">
          <p className="text-2xl font-light mb-5">Events this month:</p>
          {schedule.map(s => (
            <div key={s.id} className="border-b border-divider pb-5 mb-5">
              {/* TODO: find out color logic for events */}
              <EventCard startDate={s.start} endDate={s.end} variant="fuschia">
                <p className="text-sm text-gray-400 font-light">
                  {s.address.join(', ')}
                </p>
                <p className="text-sm text-gray-400 font-light">{s.name}</p>
                <p className="text-sm text-gray-400 font-light">
                  {s.attendees} Attendees
                </p>
              </EventCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
