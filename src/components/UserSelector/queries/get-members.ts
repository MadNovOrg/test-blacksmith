import { gql } from 'graphql-request'

export const GET_ORG_MEMBERS = gql`
  query getOrgMembers($id: [uuid!], $email: String!) {
    members: organization_member(
      where: {
        _and: {
          profile: { email: { _ilike: $email } }
          organization_id: { _in: $id }
        }
      }
    ) {
      profile {
        id
        country
        countryCode
        email
        familyName
        fullName
        givenName
      }
    }
  }
`
