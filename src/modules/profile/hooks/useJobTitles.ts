import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  GetJobTitlesQuery,
  GetJobTitlesQueryVariables,
} from '@app/generated/graphql'

import { Query as JobTitlesQuery } from './get-job-titles'

export const useJobTitles = (shard: string) => {
  const response = useQuery<GetJobTitlesQuery, GetJobTitlesQueryVariables>({
    query: JobTitlesQuery,
    requestPolicy: 'cache-and-network',
    variables: {
      shard,
    },
  })

  const positions = useMemo(() => {
    if (response.length && !!response[0]?.data?.jobTitles) {
      const jobTitles = response[0]?.data.jobTitles as { title: string }[]

      return [...jobTitles.map(jt => jt.title), 'Other']
    }

    return ['Other']
  }, [response])

  return positions
}
