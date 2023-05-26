import { endOfDay, startOfDay } from 'date-fns'
import { useCallback } from 'react'

import {
  SearchTrainersQuery,
  SearchTrainersQueryVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'

import { Props, SEARCH_TRAINERS } from './helpers'

export const useQueryTrainers = ({
  trainerType,
  courseLevel,
  courseType,
  bildStrategies,
  schedule: { start, end },
}: Props) => {
  const fetcher = useFetcher()

  const courseStart = start ? startOfDay(new Date(start)) : undefined
  const courseEnd = end ? endOfDay(new Date(end)) : undefined

  const search = useCallback(
    async (query: string): Promise<SearchTrainersQuery> => {
      try {
        const input = {
          query,
          trainerType,
          courseLevel,
          courseStart,
          courseEnd,
          courseType,
          bildStrategies,
        }

        return fetcher<SearchTrainersQuery, SearchTrainersQueryVariables>(
          SEARCH_TRAINERS,
          { input }
        )
      } catch (error) {
        console.error('useQueryTrainers', error)
        return { trainers: [] }
      }
    },
    [
      trainerType,
      courseLevel,
      courseStart,
      courseEnd,
      courseType,
      bildStrategies,
      fetcher,
    ]
  )

  return { search }
}
