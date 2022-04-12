import { endOfDay, startOfDay } from 'date-fns'
import { useCallback } from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'
import { RoleName } from '@app/types'

import { setAvailability, GET_TRAINERS, GET_TRAINERS_SCHEDULE } from './helpers'
import {
  SearchTrainer,
  SearchTrainerBookings,
  SearchTrainersSchedule,
} from './types'

type Props = {
  schedule: SearchTrainersSchedule
}

export const useQueryTrainers = ({ schedule }: Props) => {
  const fetcher = useFetcher()

  const search = useCallback(
    async (query: string): Promise<{ trainers: SearchTrainer[] }> => {
      try {
        const like = { _ilike: `${query}%` }
        const where = {
          roles: { role: { name: { _eq: RoleName.TRAINER } } },
          _or: [{ givenName: like }, { familyName: like }],
        }

        const { trainers } = await fetcher<{ trainers: SearchTrainer[] }>(
          GET_TRAINERS,
          { where }
        )

        if (schedule?.start && schedule?.end) {
          const { schedules } = await fetcher<{
            schedules: SearchTrainerBookings[]
          }>(GET_TRAINERS_SCHEDULE, {
            trainerIds: trainers.map(t => t.id),
            start: startOfDay(new Date(schedule.start)),
            end: endOfDay(new Date(schedule.end)),
          })
          setAvailability(trainers, schedules)
        } else {
          setAvailability(trainers, [])
        }

        return { trainers }
      } catch (error) {
        console.error('useQueryTrainers', error)
        return { trainers: [] }
      }
    },
    [fetcher, schedule]
  )

  return { search }
}
