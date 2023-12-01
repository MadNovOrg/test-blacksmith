import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation setCoursePricingSchedule(
    $id: uuid!
    $coursePricingId: uuid!
    $oldPrice: numeric!
    $priceAmount: numeric!
    $authorId: uuid!
    $effectiveFrom: date!
    $effectiveTo: date!
  ) {
    update_course_pricing_schedule_by_pk(
      pk_columns: { id: $id }
      _set: {
        priceAmount: $priceAmount
        effectiveFrom: $effectiveFrom
        effectiveTo: $effectiveTo
      }
    ) {
      id
    }
    course_pricing_changelog: insert_course_pricing_changelog_one(
      object: {
        coursePricingScheduleId: $id
        coursePricingId: $coursePricingId
        authorId: $authorId
        oldPrice: $oldPrice
        newPrice: $priceAmount
      }
    ) {
      id
    }
  }
`
