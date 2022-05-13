import { gql } from 'graphql-request'

export type ResponseType = { waitlist: { affectedRows: number } }

export type ParamsType = {
  input: {
    email: string
    givenName: string
    familyName: string
    phone: string
    orgName: string
    courseId: number
  }
}

export const MUTATION = gql`
  mutation InsertWaitlist($input: waitlist_insert_input!) {
    waitlist: insert_waitlist(objects: [$input]) {
      affectedRows: affected_rows
    }
  }
`
