import { gql } from 'urql'

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
