import { gql } from 'graphql-request'

import {
  CERTIFICATE,
  CERTIFICATE_CHANGELOG,
  PROFILE,
} from '@app/queries/fragments'

export const QUERY = gql`
  ${PROFILE}
  ${CERTIFICATE}
  ${CERTIFICATE_CHANGELOG}
  query GetProfileDetails(
    $profileId: uuid!
    $withGo1Licenses: Boolean = false
    $orgId: uuid
    $withCourseHistory: Boolean = false
    $withCourseTrainerHistory: Boolean = false
    $withKnowledgeHubAccess: Boolean = false
  ) {
    profile: profile_by_pk(id: $profileId) {
      ...Profile

      canAccessKnowledgeHub @include(if: $withKnowledgeHubAccess)

      participantAudits: participant_audits(
        where: { type: { _nin: [ATTENDED, NOT_ATTENDED] } }
      ) @include(if: $withCourseHistory) {
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

      courses {
        id
        attended
        course {
          id
          name
          status
          start: schedule_aggregate {
            aggregate {
              date: max {
                start
              }
            }
          }
          end: schedule_aggregate {
            aggregate {
              date: max {
                end
              }
            }
          }
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
      where: {
        _and: [
          { profileId: { _eq: $profileId } }
          {
            _or: [
              { participant: { completed_evaluation: { _eq: true } } }
              { legacyCourseCode: { _is_null: false, _neq: "" } }
            ]
          }
        ]
      }
      order_by: { expiryDate: desc }
    ) {
      ...Certificate
      participant {
        grade
        certificateChanges(order_by: { createdAt: desc }) {
          ...CertificateChangelog
        }
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
      course_code
      name
      status
      reaccreditation
    }
  }
`
