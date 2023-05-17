import { Merge } from 'ts-essentials'
import { useQuery } from 'urql'

import {
  GetBildStrategiesQuery,
  GetBildStrategiesQueryVariables,
} from '@app/generated/graphql'
import { Strategy } from '@app/pages/trainer-pages/CourseGrading/components/BILDGrading/types'
import { QUERY } from '@app/queries/bild/get-bild-strategies'
import { BildStrategies } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type Strategies = Array<
  Merge<
    GetBildStrategiesQuery['strategies'][0],
    { name: BildStrategies; modules: Strategy }
  >
>

export const useBildStrategies = (shouldFetch = false) => {
  const [{ data, error }] = useQuery<
    GetBildStrategiesQuery,
    GetBildStrategiesQueryVariables
  >({
    query: QUERY,
    pause: !shouldFetch,
  })

  const status = getSWRLoadingStatus(data, error)

  return {
    strategies: (data?.strategies ?? []) as Strategies,
    error,
    status,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
