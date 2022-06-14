import { gql } from 'graphql-request'

import { WebinarSummary } from '../fragments'

export default gql`
  ${WebinarSummary}

  query Webinar($id: ID!) {
    content {
      webinar(id: $id) {
        ...WebinarSummary
      }

      recentWebinars: webinars(
        where: { notIn: [$id], orderby: { field: DATE, order: DESC } }
        first: 4
      ) {
        nodes {
          ...WebinarSummary
        }
      }
    }
  }
`
