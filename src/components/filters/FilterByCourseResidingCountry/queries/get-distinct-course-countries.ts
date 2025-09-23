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
export const GET_ANZ_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY = gql`
  query GetANZDistinctCourseResidingCountries {
    course(
      distinct_on: residingCountry
      where: {
        _and: {
          residingCountry: {
            _in: [
              "AU"
              "FJ"
              "FM"
              "KI"
              "MH"
              "NR"
              "NZ"
              "PG"
              "PW"
              "SB"
              "TO"
              "TV"
              "VU"
              "WS"
            ]
          }
        }
      }
    ) {
      residingCountry
    }
  }
`
export const GET_ANZ_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY = gql`
  query GetANZDistinctCourseVenueCountries {
    venue(
      distinct_on: countryCode
      where: {
        _and: {
          countryCode: {
            _in: [
              "AU"
              "FJ"
              "FM"
              "KI"
              "MH"
              "NR"
              "NZ"
              "PG"
              "PW"
              "SB"
              "TO"
              "TV"
              "VU"
              "WS"
            ]
          }
          schedule: { course: { residingCountry: { _is_null: true } } }
        }
      }
    ) {
      countryCode
    }
  }
`
