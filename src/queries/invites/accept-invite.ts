import { gql } from 'graphql-request'

export type ParamsType = { courseId: string; email: string }

export const MUTATION = gql`
  mutation AcceptInvite {
    acceptInvite {
      status
    }
  }
`
