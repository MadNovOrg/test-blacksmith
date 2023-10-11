import { gql } from 'graphql-request'

import { COURSE } from '@app/queries/fragments'

export const Matcher = /(query GetUpcomingCourses)/i

export const QUERY = gql`
  ${COURSE}
  query GetUpcomingCourses(
    $courseFilter: course_bool_exp = {}
    $limit: Int = null
  ) {
    courses: course(
      where: {
        _and: [$courseFilter, { schedule: { start: { _gt: "now()" } } }]
      }
      order_by: { start: asc }
      limit: $limit
    ) {
      ...Course
      schedules: schedule {
        start
        end
        virtualLink
        venue {
          name
          addressLineOne
          addressLineTwo
          city
          postCode
          country
          geoCoordinates
        }
      }
      participantsCount: participants_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
