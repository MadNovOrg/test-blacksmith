import { gql } from 'urql'

export const GET_DISTINCT_ORG_RESIDING_COUNTRIES_QUERY = gql`
  query GetDistinctOrgResidingCountries {
    org_distinct_country_codes {
      countrycode
    }
  }
`
