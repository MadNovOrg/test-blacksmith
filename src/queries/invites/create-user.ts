import { gql } from 'graphql-request'

export type ParamsType = {
  input: {
    firstName: string
    lastName: string
    password: string
    phone: string | null
    dob: Date | null
    acceptMarketing: boolean
    acceptTnc: boolean
  }
}

export type ResponseType = {
  createUser: {
    cognitoId: string
    profileId: string
    email: string
  }
}

export const MUTATION = gql`
  mutation CreateUser($input: CreateAppUserInput!) {
    createUser(input: $input) {
      cognitoId
      profileId
      email
    }
  }
`
