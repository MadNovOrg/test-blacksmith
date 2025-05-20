import { gql } from 'graphql-request'

export type ParamsType = {
  where?: object
}

export const QUERY = gql`
  query GetNotDetailedProfile($where: profile_bool_exp = {}) {
    profiles: profile(where: $where) {
      id
      countryCode
      email
      familyName
      fullName
      givenName
    }
  }
`
