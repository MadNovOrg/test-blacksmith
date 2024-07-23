import { gql } from 'urql'

export const DELETE_COURSE_PRICING = gql`
  mutation deleteCoursePricingSchedule($id: uuid!) {
    delete_course_pricing_schedule_by_pk(id: $id) {
      id
    }
  }
`
export const INSERT_COURSE_PRICING = gql`
  mutation InsertCoursePricingSchedule(
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

export const UPDATE_COURSE_PRICING = gql`
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

export const SET_SINGLE_COURSE_PRICING = gql`
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

export const SET_BULK_COURSE_PRICING = gql`
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

export const GET_PRICING_CHANGELOG = gql`
  query PricingChangelog(
    $where: course_pricing_changelog_bool_exp
    $limit: Int = 5
    $offset: Int = 0
  ) {
    course_pricing_changelog(
      order_by: { createdAt: desc }
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      newPrice
      oldPrice
      createdAt
      author {
        id
        fullName
        avatar
        archived
      }
    }
    course_pricing_changelog_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export const GET_COURSES_WITH_AVAILABLE_PRICING_QUERY = gql`
  query GetCoursesWithPricing(
    $pricingStartBeforeChange: timestamptz!
    $pricingEndBeforeChange: timestamptz!
    $pricingStartAfterChange: timestamptz!
    $pricingEndAfterChange: timestamptz!
    $where: course_bool_exp! = {}
  ) {
    courses: course(
      where: {
        _and: [
          $where
          {
            _or: [
              {
                schedule: {
                  start: {
                    _gte: $pricingStartBeforeChange
                    _lte: $pricingStartAfterChange
                  }
                }
              }
              {
                schedule: {
                  start: {
                    _gte: $pricingEndAfterChange
                    _lte: $pricingEndBeforeChange
                  }
                }
              }
            ]
          }
        ]
      }
    ) {
      id
      course_code
    }
    course_aggregate(
      where: {
        _and: [
          $where
          {
            _or: [
              {
                schedule: {
                  start: {
                    _gte: $pricingStartBeforeChange
                    _lte: $pricingStartAfterChange
                  }
                }
              }
              {
                schedule: {
                  start: {
                    _gte: $pricingEndAfterChange
                    _lte: $pricingEndBeforeChange
                  }
                }
              }
            ]
          }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
