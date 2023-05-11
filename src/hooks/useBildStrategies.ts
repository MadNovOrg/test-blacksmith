import useSWR from 'swr'
import { Merge } from 'ts-essentials'

import { GetBildStrategiesQuery } from '@app/generated/graphql'
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
  const { data, error } = useSWR<GetBildStrategiesQuery, Error>(
    shouldFetch ? QUERY : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const status = getSWRLoadingStatus(data, error)

  return {
    strategies: (data?.strategies ?? []) as Strategies,
    error,
    status,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
