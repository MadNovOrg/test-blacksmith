import { gql } from 'urql'

// Ignore historical country United Kingdom (Instead of United Kingdom, we use England, Scotland, Wales, and Northern Ireland)
export const GET_DISTINCT_ORG_RESIDING_COUNTRIES_QUERY = gql`
  query GetDistinctOrgResidingCountries {
    org_distinct_country_codes(where: { countrycode: { _neq: "GB" } }) {
      countrycode
    }
  }
`
