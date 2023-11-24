import { gql } from 'graphql-request'

export const getProfiles = gql`
  query GetProfiles(
    $limit: Int
    $offset: Int
    $orderBy: [profile_order_by!]
    $where: profile_bool_exp
  ) {
    profiles: profile(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $orderBy
    ) {
      id
      fullName
      avatar
      archived
      email
      organizations {
        organization {
          id
          name
        }
      }
      roles {
        role {
          id
          name
        }
      }
      trainer_role_types {
        trainer_role_type {
          name
          id
        }
      }
    }
    profile_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
