import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation deleteCoursePricingSchedule($id: uuid!) {
    delete_course_pricing_schedule_by_pk(id: $id) {
      id
    }
  }
`
