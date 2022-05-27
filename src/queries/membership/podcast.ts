import { gql } from 'graphql-request'

export default gql`
  fragment PodcastSummary on Podcast {
    id
    name
    description
    mediaUrl
    author
    publishedDate
    thumbnail
    episodeNumber
  }

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
