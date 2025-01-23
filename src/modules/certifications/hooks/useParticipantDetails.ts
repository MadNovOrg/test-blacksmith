import { useQuery, gql } from 'urql'

import {
  GetParticipantGradingDetailsQuery,
  GetParticipantGradingDetailsQueryVariables,
} from '@app/generated/graphql'

export const GET_PARTICIPANT_DETAILS = gql`
  query GetParticipantGradingDetails($ids: [uuid!], $courseId: Int!) {
    participants: course_participant(where: { id: { _in: $ids } }) {
      profile {
        fullName
        avatar
      }
      id
      gradedOn
    }
    course: course_by_pk(id: $courseId) {
      deliveryType
      level
      type
      reaccreditation
      conversion
      go1Integration
    }
  }
`
export const useParticipantDetails = ({
  participants,
  courseId,
}: {
  participants: string[]
  courseId: number
}) => {
  return useQuery<
    GetParticipantGradingDetailsQuery,
    GetParticipantGradingDetailsQueryVariables
  >({
    query: GET_PARTICIPANT_DETAILS,
    variables: { ids: participants, courseId },
    pause: !participants.length,
  })
}
