import { gql } from 'graphql-request'

import { CERTIFICATE, PROFILE } from '@app/queries/fragments'

export const QUERY = gql`
  ${PROFILE}
  ${CERTIFICATE}
  query GetProfileDetails(
    $profileId: uuid!
    $withGo1Licenses: Boolean = false
    $orgId: uuid
    $withCourseHistory: Boolean = false
    $withCourseTrainerHistory: Boolean = false
  ) {
    profile: profile_by_pk(id: $profileId) {
      ...Profile

      participantAudits: participant_audits @include(if: $withCourseHistory) {
        id
        course_id
        type
        course {
          name
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
      }

      courseAsTrainer: course_trainer @include(if: $withCourseTrainerHistory) {
        id
        course_id
        type
        course {
          id
          name
          status
          level
          course_code
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
      }

      courses(where: { course: { status: { _eq: CANCELLED } } }) {
        id
        course {
          id
          name
          status
        }
      }

      go1Licenses(where: { orgId: { _eq: $orgId } })
        @include(if: $withGo1Licenses) {
        id
        orgId
        expireDate
        enrolledOn
      }
    }
    certificates: course_certificate(
      where: { profileId: { _eq: $profileId } }
      order_by: { expiryDate: desc }
    ) {
      ...Certificate
      participant {
        grade
      }
    }
    upcomingCourses: course(
      where: {
        participants: {
          _and: [
            { profile_id: { _eq: $profileId } }
            { grade: { _is_null: true } }
          ]
        }
      }
    ) {
      id
      level
      name
      status
    }
  }
`
