import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation setCoursePricingBulk(
    $newPrice: numeric!
    $coursePricingIds: [uuid!]!
    $coursePricingChangelogs: [course_pricing_changelog_insert_input!]!
  ) {
    update_course_pricing(
      where: { id: { _in: $coursePricingIds } }
      _set: { priceAmount: $newPrice }
    ) {
      affected_rows
    }
    course_pricing_changelog: insert_course_pricing_changelog(
      objects: $coursePricingChangelogs
    ) {
      affected_rows
    }
  }
`
