import { gql } from 'graphql-request'

export const GET_COURSE_PARTICIPANTS_ORGANIZATIONS = gql`
  query GetCourseParticipantsOrganizations(
    $courseId: Int!
    $where: course_participant_bool_exp = {}
    $withTrainerOrganization: Boolean = false
    $trainersWithEvaluations: [uuid!] = []
  ) {
    course_participant(
      where: { _and: [{ course_id: { _eq: $courseId } }, $where] }
    ) {
      profile {
        organizations {
          organization {
            name
          }
        }
      }
    }
    course_trainer(
      where: {
        _and: [
          { course_id: { _eq: $courseId } }
          { profile_id: { _in: $trainersWithEvaluations } }
        ]
      }
    ) @include(if: $withTrainerOrganization) {
      profile {
        organizations {
          organization {
            name
          }
        }
      }
    }
  }
`
