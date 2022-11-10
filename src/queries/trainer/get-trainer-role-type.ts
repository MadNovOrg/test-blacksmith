import { gql } from 'graphql-request'

export const GetTrainerRoleTypes = gql`
  query GetTrainerRoleTypes {
    trainer_role_type {
      id
      name
    }
  }
`
