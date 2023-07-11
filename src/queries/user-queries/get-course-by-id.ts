import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE_SCHEDULE, ORGANIZATION, VENUE } from '../fragments'

// TODO: can't share types as user queries select different columns
export type ResponseType = { course: Course }

export type ParamsType = { id: string; withOrders?: boolean }

export const QUERY = gql`
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetUserCourseById($id: Int!, $withOrders: Boolean = false) {
    course: course_by_pk(id: $id) {
      id
      name
      type
      deliveryType
      level
      course_code
      reaccreditation
      min_participants
      max_participants
      special_instructions
      parking_instructions
      level
      notes
      organization {
        id
        name
        members(where: { isAdmin: { _eq: true } }) {
          isAdmin
          profile_id
        }
      }
      trainers {
        id
        type
        profile {
          id
          givenName
          familyName
          fullName
          avatar
          archived
        }
      }
      schedule {
        ...CourseSchedule
        venue {
          ...Venue
        }
      }
      dates: schedule_aggregate {
        aggregate {
          start: min {
            date: start
          }
          end: max {
            date: end
          }
        }
      }
      bookingContact {
        id
      }
      orders @include(if: $withOrders) {
        id
        xeroInvoiceNumber
        source
      }
    }
  }
`
