import { gql } from 'urql'

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

export const JOIN_WAITLIST = gql`
  mutation JoinWaitlist($input: JoinWaitlistInput!) {
    joinWaitlist(input: $input) {
      success
    }
  }
`
