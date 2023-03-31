import { gql } from 'graphql-request'

export const ADMIN_COURSE_QUERY = gql`
  query AdminCourse($id: Int!) {
    course_by_pk(id: $id) {
      id
      accountCode
      aolCostOfCourse
      aolCountry
      aolRegion
      cancellationFeePercent
      cancellationReason
      contactProfileId
      course_code
      createdAt
      createdById
      deliveryType
      description
      end
      freeSlots
      freeSpaces
      go1Integration
      gradingConfirmed
      gradingStarted
      level
      max_participants
      min_participants
      modulesDuration
      name
      notes
      organization_id
      parking_instructions
      reaccreditation
      salesRepresentativeId
      source
      special_instructions
      status
      type
      updatedAt
    }
  }
`

export const TRAINER_COURSE_QUERY = gql`
  query TrainerCourse($id: Int!) {
    course_by_pk(id: $id) {
      id
      accountCode
      aolCostOfCourse
      aolCountry
      aolRegion
      contactProfileId
      course_code
      createdAt
      createdById
      deliveryType
      description
      end
      freeSlots
      freeSpaces
      go1Integration
      gradingConfirmed
      gradingStarted
      level
      max_participants
      min_participants
      modulesDuration
      name
      notes
      organization_id
      parking_instructions
      reaccreditation
      salesRepresentativeId
      source
      special_instructions
      status
      type
      updatedAt
    }
  }
`

export const UNVERIFIED_USER_COURSES_QUERY = gql`
  query UnverifiedUserCourses($ids: [Int!]!) {
    course(where: { id: { _in: $ids } }) {
      reaccreditation
      id
      max_participants
      min_participants
      deliveryType
      level
      status
      type
      description
      name
      createdAt
      updatedAt
      course_code
      end
      start
    }
  }
`
