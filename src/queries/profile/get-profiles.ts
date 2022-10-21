import { gql } from 'graphql-request'

export const getProfiles = gql`
  query GetProfiles($limit: Int, $offset: Int, $where: profile_bool_exp) {
    profiles: profile(limit: $limit, offset: $offset, where: $where) {
      id
      fullName
      avatar
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
      course_trainer {
        id
        can_be_moderator
      }
    }
    profile_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
