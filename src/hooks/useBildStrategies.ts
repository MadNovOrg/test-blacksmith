import useSWR from 'swr'
import { Merge } from 'ts-essentials'

import { GetBildStrategiesQuery } from '@app/generated/graphql'
import { QUERY } from '@app/queries/bild/get-bild-strategies'
import { BildStrategies } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

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
    strategies: (data?.strategies ?? []) as Array<
      Merge<GetBildStrategiesQuery['strategies'][0], { name: BildStrategies }>
    >,
    error,
    status,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
