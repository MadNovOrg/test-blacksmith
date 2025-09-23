import { gql } from 'graphql-request'

import {
  NotifyCourseEditOutput,
  NotifyCourseInput,
  NotifyCourseTrainerInput,
} from '@app/generated/graphql'

export type ResponseType = NotifyCourseEditOutput

export type ParamsType = {
  oldCourse: NotifyCourseInput
  oldTrainers: NotifyCourseTrainerInput[]
}

export const NOTIFY_COURSE_EDIT = gql`
  mutation NotifyCourseEdit(
    $oldCourse: NotifyCourseInput!
    $oldTrainers: [NotifyCourseTrainerInput]!
  ) {
    notifyCourseEdit(oldCourse: $oldCourse, oldTrainers: $oldTrainers) {
      status
    }
  }
`
