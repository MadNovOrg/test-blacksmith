import { gql } from 'graphql-request'

export default gql`
  query Podcasts($input: PodcastsInput!) {
    podcasts(input: $input) {
      records {
        id
        name
        thumbnail
        publishedDate
        mediaUrl
        author
        description
        episodeNumber
      }
      total
    }
  }
`
