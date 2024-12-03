import { gql } from 'graphql-request'

import {
  Course_Source_Enum,
  Course_Status_Enum,
  Course_Level_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { CourseTrainerType } from '@app/types'

// TODO: Scrap these custom types 🥲 and use UpdateCourseMutation and UpdateCourseMutation variables from graphql.ts
export type ParamsType = {
  courseId: number
  scheduleId: string
  courseInput: {
    status: Course_Status_Enum | null
    exceptionsPending?: boolean
    name: string
    deliveryType: Course_Delivery_Type_Enum
    level?: Course_Level_Enum
    organization_id?: string
    bookingContactProfileId?: string | null
    source?: Course_Source_Enum
    reaccreditation?: boolean
    go1Integration?: boolean
    aolCostOfCourse?: number
    description?: string
    aolCountry?: string
    aolRegion?: string
    min_participants?: number
    max_participants?: number
    freeSpaces?: number
    special_instructions?: string
    parking_instructions?: string
    displayOnWebsite?: boolean
    // TODO: Delete this after arlo migration
    arloReferenceId?: string
  }
  orderInput: {
    salesRepresentativeId: string
    source: Course_Source_Enum
  }
  scheduleInput: {
    start: Date
    end: Date
    venue_id?: string | null
    virtualLink?: string
    virtualAccountId?: string
  }
  trainers: Array<{
    profile_id: string
    type: CourseTrainerType
    course_id: number
  }>
  trainersToDelete: string[]
}

export type ResponseType = {
  updateCourse: {
    id: number
  }
}

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse(
    $courseId: Int!
    $courseInput: course_set_input!
    $exceptions: [course_exception_enum!] = []
    $exceptionsInput: [course_exceptions_insert_input!] = []
    $orderInput: order_set_input!
    $ordersInsertInput: [course_order_insert_input!] = []
    $scheduleId: uuid!
    $scheduleInput: course_schedule_set_input!
    $temporaryOrderInsertInput: [order_temp_insert_input!] = []
    $trainers: [course_trainer_insert_input!]!
    $trainersToDelete: [uuid!]
  ) {
    deleteCourseTrainers: delete_course_trainer(
      where: {
        course_id: { _eq: $courseId }
        profile_id: { _in: $trainersToDelete }
      }
    ) {
      returning {
        id
      }
    }

    deletedExceptions: delete_course_exceptions(
      where: { courseId: { _eq: $courseId }, exception: { _in: $exceptions } }
    ) {
      affectedRows: affected_rows
    }

    insertCourseTrainers: insert_course_trainer(objects: $trainers) {
      returning {
        id
      }
    }

    insertExceptions: insert_course_exceptions(objects: $exceptionsInput) {
      affectedRows: affected_rows
    }

    insertOrders: insert_course_order(objects: $ordersInsertInput) {
      affectedRows: affected_rows
    }

    insertTemporaryOrders: insert_order_temp(
      objects: $temporaryOrderInsertInput
    ) {
      affectedRows: affected_rows
    }

    updateCourse: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: $courseInput
    ) {
      id
      level
    }

    updateOrder: update_order(
      where: { courses: { course_id: { _eq: $courseId } } }
      _set: $orderInput
    ) {
      affectedRows: affected_rows
    }

    updateSchedule: update_course_schedule_by_pk(
      pk_columns: { id: $scheduleId }
      _set: $scheduleInput
    ) {
      id
    }
  }
`

export const INSERT_COURSE_ORDER = gql`
  mutation InsertCourseOrder($orderInput: course_order_insert_input!) {
    insertOrder: insert_course_order_one(object: $orderInput) {
      order_id
    }
  }
`

export const RESERVE_GO1_LICENSES_MUTATION = gql`
  mutation ReserveGo1Licenses(
    $go1LicensesOrgIdManage: uuid!
    $decrementGo1LicensesFromOrganizationPool: Int = 0
    $incrementGo1LicensesFromOrganizationPool: Int = 0
    $reserveGo1LicensesAudit: [go1_licenses_history_insert_input!] = []
  ) {
    decrementGo1Licenses: update_organization(
      where: { id: { _eq: $go1LicensesOrgIdManage } }
      _inc: {
        go1Licenses: $decrementGo1LicensesFromOrganizationPool
        reservedGo1Licenses: $incrementGo1LicensesFromOrganizationPool
      }
    ) {
      affectedRows: affected_rows
      returning {
        id
        go1Licenses
      }
    }

    insertGo1LicensesAudit: insert_go1_licenses_history(
      objects: $reserveGo1LicensesAudit
    ) {
      affected_rows
      returning {
        id
        org_id
        event
      }
    }
  }
`
