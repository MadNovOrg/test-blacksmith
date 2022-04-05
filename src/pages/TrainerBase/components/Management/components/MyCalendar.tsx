import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { RangeInput } from '@mui/lab/DateRangePicker/RangeTypes'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker'
import { Typography, Box, TextField } from '@mui/material'
import { styled } from '@mui/system'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'

import { EventCard } from '@app/components/EventCard'
import {
  QUERY as GetTrainerSchedule,
  ResponseType as GetTrainerScheduleResponseType,
} from '@app/queries/trainer/get-schedule'

type MyCalendarProps = unknown

const Calendar = styled(StaticDateRangePicker)({})

export const MyCalendar: React.FC<MyCalendarProps> = () => {
  const [value, setValue] = useState<RangeInput<Date>>([null, null])

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
        city: s.venue.city,
        attendees: c.participants.aggregate.count,
      }))
    })
  }, [data])

  const ranges = useMemo(
    () =>
      schedule.map(s => ({
        start: new Date(s.start),
        end: new Date(s.end),
      })),
    [schedule]
  )

  console.log(ranges) // TODO: revisit this page

  return (
    <Box>
      <Typography variant="h5">My Calendar</Typography>

      <Box display="flex">
        <Box
          display="flex"
          // sx={{ transform: 'scale(1.5)', transformOrigin: 'top left' }}
          width={500}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Calendar
              showDaysOutsideCurrentMonth
              calendars={1}
              displayStaticWrapperAs="desktop"
              value={value}
              onChange={newValue => {
                setValue(newValue as RangeInput<Date>) // TODO: revisit
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Events this month:</Typography>

          <Box mt={4}>
            {schedule.map((s, index) => (
              <Box
                key={s.id}
                mb={2}
                pb={3}
                borderBottom={schedule.length - 1 === index ? 0 : 1}
                borderColor="divider"
              >
                {/* TODO: find out color logic for events */}
                <EventCard startDate={s.start} endDate={s.end}>
                  <Typography variant="body2">{s.city}</Typography>
                  <Typography variant="body2">{s.name}</Typography>
                  <Typography variant="body2">
                    {s.attendees} Attendees
                  </Typography>
                </EventCard>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
