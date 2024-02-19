import { gql } from 'urql'

export const GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY = gql`
  query GetDistinctCourseResidingCountries {
    course(
      distinct_on: residingCountry
      where: { _and: { residingCountry: { _is_null: false, _neq: "" } } }
    ) {
      residingCountry
    }
  }
`
export const GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY = gql`
  query GetDistinctCourseVenueCountries {
    venue(
      distinct_on: countryCode
      where: {
        _and: {
          countryCode: { _is_null: false, _neq: "" }
          schedule: { course: { residingCountry: { _is_null: true } } }
        }
      }
    ) {
      countryCode
    }
  }
`
