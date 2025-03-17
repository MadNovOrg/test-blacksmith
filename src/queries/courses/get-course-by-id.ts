import { gql } from 'graphql-request'

import { Maybe } from '@app/generated/graphql'
import { Course } from '@app/types'

import { COURSE, COURSE_SCHEDULE, ORGANIZATION, VENUE } from '../fragments'

export type ResponseType = { course: Maybe<Course> }

// TODO: Scrap this and use GetCourseByIdQuery and GetCourseByIdQueryVariables
export type ParamsType = {
  id: string
  withArloRefId: boolean
  withFreeCourseCourseMaterials?: boolean
  withInternationalFinance?: boolean
  withOrders?: boolean
  withOrgLicenses?: boolean
  withParticipants?: boolean
  withParticipantsPendingInvitesCount?: boolean
}

export const QUERY = gql`
  ${COURSE}
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetCourseById(
    $id: Int!
    $withArloRefId: Boolean = false
    $withFreeCourseCourseMaterials: Boolean = false
    $withInternationalFinance: Boolean = false
    $withModules: Boolean = false
    $withOrders: Boolean = false
    $withOrgLicenses: Boolean = false
    $withParticipants: Boolean = false
    $withParticipantsPendingInvitesCount: Boolean = false
    $withResourcePacks: Boolean = false
  ) {
    course: course_by_pk(id: $id) {
      ...Course
      isDraft
      # TODO: Delete this after Arlo migration
      arloReferenceId @include(if: $withArloRefId)
      displayOnWebsite
      curriculum
      bildModules {
        id
        modules
      }
      bildStrategies {
        strategyName
      }
      accreditedBy
      conversion
      freeSpaces
      accountCode
      level
      special_instructions
      parking_instructions
      accreditedBy
      price
      exceptionsPending
      renewalCycle
      cancellationRequest {
        id
        reason
      }
      priceCurrency @include(if: $withInternationalFinance)
      includeVAT @include(if: $withInternationalFinance)
      free_course_materials @include(if: $withFreeCourseCourseMaterials)
      resourcePacksType @include(if: $withResourcePacks)
      trainers {
        id
        type
        status
        course_id
        profile {
          id
          givenName
          familyName
          fullName
          avatar
          archived
          levels: certificates {
            courseLevel
            expiryDate
          }
          trainer_role_types {
            trainer_role_type {
              id
              name
            }
          }
        }
      }
      schedule {
        ...CourseSchedule
        virtualAccountId
        timeZone
        venue {
          ...Venue
        }
      }

      coursesReservedLicenses: reservedGo1Licenses
        @include(if: $withOrgLicenses)

      organization {
        ...Organization
        go1Licenses: go1Licenses @include(if: $withOrgLicenses)
        reservedGo1Licenses: reservedGo1Licenses @include(if: $withOrgLicenses)
        mainOrganizationLicenses: main_organisation
          @include(if: $withOrgLicenses) {
          go1Licenses
          reservedGo1Licenses
        }
      }

      bookingContact {
        id
        fullName
        avatar
        archived
        email
        givenName
        familyName
      }
      bookingContactInviteData
      organizationKeyContact {
        id
        fullName
        avatar
        archived
        email
        givenName
        familyName
      }
      organizationKeyContactInviteData
      orders @include(if: $withOrders) {
        order {
          id
          xeroInvoiceNumber
          source
          salesRepresentative {
            id
            fullName
            avatar
            archived
          }
        }
      }
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
      moduleGroupIds: modules {
        module {
          moduleGroup {
            id
          }
        }
      }

      modules(
        order_by: { module: { moduleGroup: { mandatory: desc, name: asc } } }
      ) @include(if: $withModules) {
        id
        covered
        module {
          id
          name
          moduleGroup {
            id
            name
            mandatory
          }
        }
      }

      courseParticipants: participants @include(if: $withParticipants) {
        healthSafetyConsent
        grade
        attended
      }

      certificateCount: participants_aggregate(
        where: { grade: { _in: [PASS, OBSERVE_ONLY, ASSIST_ONLY] } }
      ) {
        aggregate {
          count
        }
      }
      participantSubmittedEvaluationCount: participants_aggregate(
        where: { completed_evaluation: { _eq: true } }
      ) {
        aggregate {
          count
        }
      }
      attendeesCount: participants_aggregate {
        aggregate {
          count
        }
      }
      courseExceptions {
        exception
      }

      participantsPendingInvites: course_invites_aggregate(
        where: { status: { _eq: PENDING } }
      ) @include(if: $withParticipantsPendingInvitesCount) {
        aggregate {
          count
        }
      }
    }
  }
`
