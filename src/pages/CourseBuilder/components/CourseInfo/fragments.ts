import { gql } from 'urql'

export const COURSE_INFO_FRAGMENT = gql`
  fragment CourseInfo on course {
    name
    start
    end
    go1Integration
    organization {
      name
    }
    schedule {
      venue {
        name
        city
      }
    }
    deliveryType
  }
`
