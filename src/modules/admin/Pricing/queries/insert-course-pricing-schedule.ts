import { gql } from 'graphql-request'

export const INSERT_MUTATION = gql`
  mutation insertCoursePricingSchedule(
    $id: uuid!
    $coursePricingId: uuid!
    $priceAmount: numeric!
    $authorId: uuid!
    $effectiveFrom: date!
    $effectiveTo: date!
  ) {
    course_pricing_schedule: insert_course_pricing_schedule_one(
      object: {
        id: $id
        coursePricingId: $coursePricingId
        priceAmount: $priceAmount
        priceCurrency: "GBP"
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
        oldPrice: $priceAmount
        newPrice: $priceAmount
      }
    ) {
      id
    }
  }
`
