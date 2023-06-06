import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation setCoursePricing(
    $id: uuid!
    $oldPrice: numeric!
    $priceAmount: numeric!
    $authorId: uuid!
  ) {
    update_course_pricing_by_pk(
      pk_columns: { id: $id }
      _set: { priceAmount: $priceAmount }
    ) {
      id
    }
    course_pricing_changelog: insert_course_pricing_changelog_one(
      object: {
        coursePricingId: $id
        authorId: $authorId
        oldPrice: $oldPrice
        newPrice: $priceAmount
      }
    ) {
      id
    }
  }
`
