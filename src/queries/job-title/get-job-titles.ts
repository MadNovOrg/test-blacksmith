import { gql } from 'urql'

export const Query = gql`
  query GetJobTitles {
    jobTitles: job_title(order_by: { title: asc }) {
      title
    }
  }
`
