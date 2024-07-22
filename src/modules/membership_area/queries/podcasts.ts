import { gql } from 'graphql-request'

import { PodcastSummary } from '@app/queries/fragments'

export default gql`
  ${PodcastSummary}
  query Podcasts($input: PodcastsInput!) {
    podcasts(input: $input) {
      records {
        ...PodcastSummary
      }
      total
    }
  }
`
