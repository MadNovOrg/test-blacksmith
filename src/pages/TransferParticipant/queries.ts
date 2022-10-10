import { gql } from 'graphql-request'

export const PARTICIPANT_TRANSFER = gql`
  query ParticipantTransfer($id: uuid!) {
    participant: course_participant_by_pk(id: $id) {
      id
      profile {
        fullName
        avatar
      }
    }
  }
`

export const TRANSFER_PARTICIPANT_DETAILS = gql`
  query TransferParticipantDetails($courseId: Int!, $participantId: uuid!) {
    course: course_by_pk(id: $courseId) {
      id
      level
      type
      status
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
    }

    participant: course_participant_by_pk(id: $participantId) {
      id
      profile {
        fullName
        avatar
      }
    }
  }
`

export const TRANSFER_ELIGIBLE_COURSES = gql`
  query TransferEligibleCourses(
    $level: course_level_enum
    $startDate: timestamptz
  ) {
    eligibleCourses: course(
      where: {
        level: { _eq: $level }
        schedule: { start: { _gt: $startDate } }
        status: { _in: [CONFIRM_MODULES, SCHEDULED, DRAFT] }
      }
    ) {
      id
      level
      course_code
      schedule {
        start
        end
        virtualLink
        venue {
          name
          addressLineOne
          addressLineTwo
          city
          postCode
        }
      }
    }
  }
`
