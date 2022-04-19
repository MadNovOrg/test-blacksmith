import { endOfDay, startOfDay } from 'date-fns'
import { useCallback } from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  RoleName,
  SearchTrainer,
  CourseTrainerType,
  CourseLevel,
} from '@app/types'
import { eligibleTrainers } from '@app/util'

import { GET_TRAINERS, GET_TRAINERS_LEVELS } from './helpers'
import { SearchTrainersSchedule, GetTrainersLevelsResp } from './types'

type Props = {
  trainerType: CourseTrainerType
  courseLevel: CourseLevel
  schedule: SearchTrainersSchedule
}

export const useQueryTrainers = ({
  trainerType,
  courseLevel,
  schedule: { start, end },
}: Props) => {
  const fetcher = useFetcher()

  const courseStart = start ? startOfDay(new Date(start)) : null
  const courseEnd = end ? endOfDay(new Date(end)) : null

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

        const { getTrainersLevels } = await fetcher<GetTrainersLevelsResp>(
          GET_TRAINERS_LEVELS,
          {
            ids: trainers.map(t => t.id),
            trainerType,
            courseLevel,
            courseStart,
            courseEnd,
          }
        )

        return {
          trainers: eligibleTrainers(courseLevel, trainers, getTrainersLevels),
        }
      } catch (error) {
        console.error('useQueryTrainers', error)
        return { trainers: [] }
      }
    },
    [fetcher, trainerType, courseLevel, courseStart, courseEnd]
  )

  return { search }
}
