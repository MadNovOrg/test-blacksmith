import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation CreateUser($input: CreateAppUserInput!) {
    createUser(input: $input) {
      cognitoId
      profileId
      email
    }
  }
`
