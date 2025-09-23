import { useMemo } from 'react'
import { useQuery, gql } from 'urql'

import {
  GetJobTitlesQuery,
  GetJobTitlesQueryVariables,
} from '@app/generated/graphql'

export const Query = gql`
  query GetJobTitles($shard: String!) {
    jobTitles: job_title(
      where: { shard: { _eq: $shard } }
      order_by: { title: asc }
    ) {
      title
    }
  }
`

export const useJobTitles = (shard: string) => {
  const response = useQuery<GetJobTitlesQuery, GetJobTitlesQueryVariables>({
    query: Query,
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
