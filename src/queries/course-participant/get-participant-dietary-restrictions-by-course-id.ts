import { gql } from 'urql'

export const GET_DIETARY_OR_DISABILITIES_DATA = gql`
  query GetCourseParticipantDietOrDisabilitiesData(
    $courseId: Int!
    $withDietaryRestrictions: Boolean = false
    $withTrainerData: Boolean = false
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
    trainerDietaryRestrictions: course_trainer(
      where: {
        course_id: { _eq: $courseId }
        profile: { dietaryRestrictions: { _neq: "null", _nilike: "" } }
      }
    ) @include(if: $withTrainerData) {
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
    trainerDisabilities: course_trainer(
      where: {
        course_id: { _eq: $courseId }
        profile: { disabilities: { _neq: "null", _nilike: "" } }
      }
    ) @include(if: $withTrainerData) {
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
  query GetDietaryAndDisabilitiesCount(
    $courseId: Int!
    $withTrainerData: Boolean = false
  ) {
    participantDietaryRestrictionsCount: course_participant_aggregate(
      where: {
        course_id: { _eq: $courseId }
        profile: { dietaryRestrictions: { _neq: "null", _nilike: "" } }
      }
    ) {
      aggregate {
        count
      }
    }
    trainerDietaryRestrictionsCount: course_trainer_aggregate(
      where: {
        course_id: { _eq: $courseId }
        profile: { dietaryRestrictions: { _neq: "null", _nilike: "" } }
      }
    ) {
      aggregate @include(if: $withTrainerData) {
        count
      }
    }
    participantDisabilitiesCount: course_participant_aggregate(
      where: {
        course_id: { _eq: $courseId }
        profile: { disabilities: { _neq: "null", _nilike: "" } }
      }
    ) {
      aggregate {
        count
      }
    }
    trainerDisabilitiesCount: course_trainer_aggregate(
      where: {
        course_id: { _eq: $courseId }
        profile: { disabilities: { _neq: "null", _nilike: "" } }
      }
    ) {
      aggregate @include(if: $withTrainerData) {
        count
      }
    }
  }
`
