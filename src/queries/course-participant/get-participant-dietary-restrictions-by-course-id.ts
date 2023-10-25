import { gql } from 'urql'

export const GET_DIETARY_OR_DISABILITIES_DATA = gql`
  query GetCourseParticipantDietOrDisabilitiesData(
    $courseId: Int!
    $withDietaryRestrictions: Boolean = false
    $withDisabilities: Boolean = false
  ) {
    dietaryRestrictions: course_participant(
      where: {
        course_id: { _eq: $courseId }
        profile: { dietaryRestrictions: { _neq: "null", _nilike: "" } }
      }
    ) @include(if: $withDietaryRestrictions) {
      profile {
        fullName
        dietaryRestrictions
        email
        id
        organizations {
          organization {
            name
            id
          }
        }
      }
    }
    disabilities: course_participant(
      where: {
        course_id: { _eq: $courseId }
        profile: { disabilities: { _neq: "null", _nilike: "" } }
      }
    ) @include(if: $withDisabilities) {
      profile {
        fullName
        disabilities
        email
        id
        organizations {
          organization {
            name
            id
          }
        }
      }
    }
  }
`

export const GET_DIETARY_AND_DISABILITIES_COUNT = gql`
  query GetDietaryAndDisabilitiesCount($courseId: Int!) {
    dietaryRestrictionsCount: course_participant_aggregate(
      where: {
        course_id: { _eq: $courseId }
        profile: { dietaryRestrictions: { _neq: "null", _nilike: "" } }
      }
    ) {
      aggregate {
        count
      }
    }
    disabilitiesCount: course_participant_aggregate(
      where: {
        course_id: { _eq: $courseId }
        profile: { disabilities: { _neq: "null", _nilike: "" } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
