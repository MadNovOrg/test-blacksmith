import { gql } from 'graphql-request'

import {
  EbookSummary,
  PodcastSummary,
  PostSummary,
  ResearchSummaryDetails,
  VideoItemSummary,
  WebinarSummary,
} from '@app/queries/fragments'

export default gql`
  ${PostSummary}
  ${VideoItemSummary}
  ${PodcastSummary}
  ${ResearchSummaryDetails}
  ${WebinarSummary}
  ${EbookSummary}

  query MembershipHome {
    podcasts(input: { paging: { perPage: 4, page: 1 } }) {
      records {
        ...PodcastSummary
      }
    }
    content {
      posts(first: 4) {
        nodes {
          ...PostSummary
        }
      }
      videoSeriesItems(first: 4) {
        nodes {
          ...VideoItemSummary
        }
      }
      researchSummaries(first: 4) {
        nodes {
          ...ResearchSummaryDetails
        }
      }
      webinars(first: 4) {
        nodes {
          ...WebinarSummary
        }
      }
      ebooks(first: 4) {
        nodes {
          ...EbookSummary
        }
      }
    }
  }
`
