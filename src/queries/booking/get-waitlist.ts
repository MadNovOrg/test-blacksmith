import { gql } from 'graphql-request'

import { Waitlist as WaitlistSummary } from '@app/queries/fragments'

export const QUERY = gql`
  ${WaitlistSummary}

  query GetWaitlist(
    $where: waitlist_bool_exp!
    $limit: Int = 20
    $offset: Int = 0
    $orderBy: [waitlist_order_by!]
  ) {
    waitlist(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      ...WaitlistSummary
    }

    waitlistAggregate: waitlist_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
