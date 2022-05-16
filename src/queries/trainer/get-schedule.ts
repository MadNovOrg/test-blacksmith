import { gql } from 'graphql-request'

import { TrainerSchedule } from '@app/types'

export type ResponseType = {
  course: {
    id: string
    name: string
    schedule: TrainerSchedule[]
    participants: {
      aggregate: {
        count: number
      }
    }
  }[]
}

// TODO: filter by month to show on calendar
// export type ParamsType = any

export const QUERY = gql`
  query TrainerSchedule {
    course {
      id
      name
      schedule {
        id
        start
        end
        venue {
          city
          addressLineOne
          addressLineTwo
        }
      }
      participants: participants_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
