import { gql } from 'graphql-request'

import { COURSE } from '@app/queries/fragments'

export const Matcher = /(query GetOrgCourses)/i

export const QUERY = gql`
  ${COURSE}
  query GetOrgCourses(
    $where: organization_bool_exp = {}
    $courseFilter: course_bool_exp = {}
  ) {
    courses: course(
      where: {
        _and: [
          $courseFilter
          { organization: $where }
          { schedule: { start: { _gt: "now()" } } }
        ]
      }
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
