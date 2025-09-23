import { gql } from 'graphql-request'

export type ResponseType = { profile: { affectedRows: number } }

export type ParamsType = {
  input: {
    email?: string
    givenName: string
    familyName: string
    acceptTnc: boolean
    phone?: string
    dob: Date | null
    sector?: string
    jobTitle?: string
    organizationId?: string | null
    courseId: number | null
    quantity: number | null
  }
}

export const MUTATION = gql`
  mutation InsertProfileTemp($input: profile_temp_insert_input!) {
    profile: insert_profile_temp(objects: [$input]) {
      affectedRows: affected_rows
    }
  }
`
