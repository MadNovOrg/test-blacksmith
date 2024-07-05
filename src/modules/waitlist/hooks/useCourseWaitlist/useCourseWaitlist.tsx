import { gql, useQuery } from 'urql'

import {
  WaitlistCourseQuery,
  WaitlistCourseQueryVariables,
} from '@app/generated/graphql'

export const WAITLIST_COURSE = gql`
  query WaitlistCourse($id: Int!) {
    courses: course(
      limit: 1
      where: {
        id: { _eq: $id }
        type: { _eq: OPEN }
        status: {
          _in: [
            CONFIRM_MODULES
            SCHEDULED
            TRAINER_MISSING
            TRAINER_PENDING
            TRAINER_DECLINED
          ]
        }
      }
    ) {
      id
      name
      deliveryType
      schedule {
        end
        start
        venue {
          name
          addressLineOne
          addressLineTwo
          city
          postCode
        }
      }
    }
  }
`

export const useCourseWaitlist = ({ courseId }: { courseId: number }) => {
  return useQuery<WaitlistCourseQuery, WaitlistCourseQueryVariables>({
    query: WAITLIST_COURSE,
    variables: { id: courseId },
  })
}
