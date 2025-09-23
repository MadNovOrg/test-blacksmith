import { gql } from 'graphql-request'
import { useQuery } from 'urql'

import {
  GradedParticipantQuery,
  GradedParticipantQueryVariables,
} from '@app/generated/graphql'

export const PARTICIPANT_QUERY = gql`
  query GradedParticipant($id: uuid!) {
    participant: course_participant_by_pk(id: $id) {
      id
      course {
        accreditedBy
        name
      }
      profile {
        fullName
        avatar
      }
      grade
      dateGraded
      gradedOn
      gradingModules {
        id
        completed
        module {
          id
          name
          moduleGroup {
            id
            name
          }
          submodules {
            id
            name
          }
          submodules_aggregate {
            aggregate {
              count
            }
          }
        }
      }
      bildGradingModules {
        id
        modules
      }
      notes {
        moduleGroupId
        note
      }
    }
  }
`

export function useGradedParticipant(id: string) {
  return useQuery<GradedParticipantQuery, GradedParticipantQueryVariables>({
    query: PARTICIPANT_QUERY,
    variables: { id },
  })
}
