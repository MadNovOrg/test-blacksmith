import { gql } from 'urql'

export const COURSE_INFO_FRAGMENT = gql`
  fragment CourseInfo on course {
    name
    go1Integration
    organization {
      name
    }
    schedule {
      venue {
        name
        city
      }
      timeZone
      start
      end
    }
    deliveryType
  }
`
