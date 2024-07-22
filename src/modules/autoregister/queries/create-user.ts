import { gql } from 'graphql-request'

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateAppUserInput!) {
    createUser(input: $input) {
      cognitoId
      profileId
      email
    }
  }
`
