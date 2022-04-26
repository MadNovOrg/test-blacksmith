import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE_DATES } from '../fragments'

export type ResponseType = {
  tempProfiles: {
    course: Course
    quantity: number
  }[]
}

export const QUERY = gql`
  ${COURSE_DATES}
  query GetTempProfile {
    tempProfiles: profile_temp(order_by: { createdAt: desc }, limit: 1) {
      course {
        id
        name
        dates: schedule_aggregate {
          ...CourseDates
        }
      }
      quantity
    }
  }
`
