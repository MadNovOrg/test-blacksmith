import { gql } from 'graphql-request'

import { PostSummary } from '../fragments'

export default gql`
  ${PostSummary}

  query Post($id: ID!) {
    content {
      post(id: $id) {
        ...PostSummary
      }
      recentPosts: posts(
        where: { orderby: { field: DATE, order: DESC } }
        first: 4
      ) {
        nodes {
          ...PostSummary
        }
      }
    }
  }
`
