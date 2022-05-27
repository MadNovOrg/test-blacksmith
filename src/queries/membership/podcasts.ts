import { gql } from 'graphql-request'

export const QUERY = gql`
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
