import { gql } from 'graphql-request'

import {
  SendCourseInformationMutation,
  Mutation_RootSendCourseInformationArgs,
} from '@app/generated/graphql'

export type ResponseType = SendCourseInformationMutation

export type ParamsType = Mutation_RootSendCourseInformationArgs

export const MUTATION = gql`
  mutation sendCourseInformation($courseId: Int!, $attendeeIds: [uuid!]!) {
    sendCourseInformation(courseId: $courseId, attendeeIds: $attendeeIds) {
      success
      error
    }
  }
`
