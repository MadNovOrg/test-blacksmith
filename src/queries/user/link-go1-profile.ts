import { gql } from 'graphql-request'

export type ResponseType = {
  linkGo1: {
    status: boolean
  }
} // TODO: fix

export type ParamsType = never

export const MUTATION = gql`
  mutation LinkGo1 {
    linkGo1 {
      status
    }
  }
`
