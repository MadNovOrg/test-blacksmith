import { gql } from 'urql'

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
  query TransferEligibleCourses($fromCourseId: Int!) {
    eligibleTransferCourses(fromCourseId: $fromCourseId) {
      id
      courseCode
      startDate
      endDate
      virtualLink
      venue
      venueName
      venueCity
      level
    }
  }
`
export const TRANSFER_PARTICIPANT = gql`
  mutation TransferParticipant($input: TransferInput!) {
    transferParticipant(input: $input) {
      success
      error
    }
  }
`
