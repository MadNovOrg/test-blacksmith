import { gql } from 'urql'

import { COURSE_DATES, VENUE } from '../fragments'

export const QUERY = gql`
  ${COURSE_DATES}
  ${VENUE}
  query GetTempProfile {
    tempProfiles: profile_temp(order_by: { createdAt: desc }, limit: 1) {
      course {
        id
        courseCode: course_code
        name
        accreditedBy
        price
        priceCurrency
        dates: schedule_aggregate {
          ...CourseDates
        }
        maxParticipants: max_participants
        participants: participants_aggregate {
          aggregate {
            count
          }
        }
        type
        deliveryType
        level
        reaccreditation
        conversion
        freeSpaces
        expenses {
          id
          data
          trainer {
            id
            fullName
            avatar
            archived
          }
        }
        schedule {
          venue {
            ...Venue
          }
          timeZone
        }
        residingCountry
        includeVAT
      }
      quantity
    }
  }
`
