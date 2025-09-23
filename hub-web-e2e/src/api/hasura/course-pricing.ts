import { gql } from 'graphql-request'
import { v4 as uuidv4 } from 'uuid'

import {
  DeleteCoursePricingScheduleMutation,
  DeleteCoursePricingScheduleMutationVariables,
  GetCoursePricingQuery,
  GetCoursePricingQueryVariables,
  InsertCoursePricingScheduleMutation,
  InsertCoursePricingScheduleMutationVariables,
} from '@qa/generated/graphql'

import { getClient } from './client'

export const INSERT_COURSE_PRICING_SCHEDULE = gql`
  mutation insertCoursePricingSchedule(
    $id: uuid!
    $coursePricingId: uuid!
    $priceAmount: numeric!
    $effectiveFrom: date!
    $effectiveTo: date!
    $priceCurrency: String = "GBP"
  ) {
    course_pricing_schedule: insert_course_pricing_schedule_one(
      object: {
        id: $id
        coursePricingId: $coursePricingId
        priceAmount: $priceAmount
        priceCurrency: $priceCurrency
        effectiveFrom: $effectiveFrom
        effectiveTo: $effectiveTo
      }
    ) {
      id
    }
  }
`

export const GET_COURSE_PRICING_SCHEDULE = gql`
  query getCoursePricing(
    $type: course_type_enum!
    $level: course_level_enum!
    $blended: Boolean = false
    $reaccreditation: Boolean = false
    $priceCurrency: String = "GBP"
  ) {
    course_pricing(
      where: {
        type: { _eq: $type }
        level: { _eq: $level }
        blended: { _eq: $blended }
        reaccreditation: { _eq: $reaccreditation }
        priceCurrency: { _eq: $priceCurrency }
      }
    ) {
      id
    }
  }
`

export const DELETE_COURSE_PRICING_SCHEDULE = gql`
  mutation deleteCoursePricingSchedule($id: uuid!) {
    delete_course_pricing_schedule_by_pk(id: $id) {
      id
    }
  }
`

export const getCoursePricing = async (
  input: GetCoursePricingQueryVariables,
) => {
  return await getClient().request<
    GetCoursePricingQuery,
    GetCoursePricingQueryVariables
  >(GET_COURSE_PRICING_SCHEDULE, input)
}

export const insertPricingSchedule = async ({
  effectiveFrom,
  effectiveTo,
  coursePricingId,
}: {
  effectiveFrom: Date
  effectiveTo: Date
  coursePricingId: string
}) => {
  const response = await getClient().request<
    InsertCoursePricingScheduleMutation,
    InsertCoursePricingScheduleMutationVariables
  >(INSERT_COURSE_PRICING_SCHEDULE, {
    id: uuidv4(),
    coursePricingId,
    priceAmount: 100,
    effectiveFrom,
    effectiveTo,
  })

  return response.course_pricing_schedule
}

export const deleteCoursePricingSchedule = async (
  input: DeleteCoursePricingScheduleMutationVariables,
) => {
  return await getClient().request<
    DeleteCoursePricingScheduleMutation,
    DeleteCoursePricingScheduleMutationVariables
  >(DELETE_COURSE_PRICING_SCHEDULE, input)
}
