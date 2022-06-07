import { gql } from 'graphql-request'

import { VideoItemSummary } from '../fragments'

export default gql`
  ${VideoItemSummary}

  query VideoItem($id: ID!) {
    content {
      videoSeriesItem(id: $id) {
        ...VideoItemSummary
      }

      recentVideoItems: videoSeriesItems(
        where: { notIn: [$id], orderby: { field: DATE, order: DESC } }
        first: 4
      ) {
        nodes {
          ...VideoItemSummary
        }
      }
    }
  }
`
