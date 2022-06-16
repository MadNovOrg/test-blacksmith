import { gql } from 'graphql-request'

import { PodcastSummary } from '../fragments'

export default gql`
  ${PodcastSummary}
  query Podcast($id: ID!) {
    podcast(id: $id) {
      podcast {
        ...PodcastSummary
      }
    }
    recentPodcasts: podcasts(
      input: { paging: { perPage: 4, page: 1 }, order: { direction: DESC } }
    ) {
      records {
        ...PodcastSummary
      }
    }
  }
`
