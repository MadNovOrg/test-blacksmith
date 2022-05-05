import { endOfDay, startOfDay } from 'date-fns'
import { useCallback } from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'

import {
  Props,
  SEARCH_TRAINERS,
  SearchTrainersInput,
  SearchTrainersResp,
} from './helpers'

export const useQueryTrainers = ({
  trainerType,
  courseLevel,
  schedule: { start, end },
}: Props) => {
  const fetcher = useFetcher()

  const courseStart = start ? startOfDay(new Date(start)) : undefined
  const courseEnd = end ? endOfDay(new Date(end)) : undefined

  const search = useCallback(
    async (query: string): Promise<SearchTrainersResp> => {
      try {
        const input = {
          query,
          trainerType,
          courseLevel,
          courseStart,
          courseEnd,
        }

        return fetcher<SearchTrainersResp, SearchTrainersInput>(
          SEARCH_TRAINERS,
          { input }
        )
      } catch (error) {
        console.error('useQueryTrainers', error)
        return { trainers: [] }
      }
    },
    [fetcher, trainerType, courseLevel, courseStart, courseEnd]
  )

  return { search }
}
