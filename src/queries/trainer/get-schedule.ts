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

export type ParamsType = any // TODO: filter by month to show on calendar

export const QUERY = gql`
  query TrainerSchedule {
    course {
      id
      name
      schedule {
        id
        name
        start
        end
        type
        venue {
          address
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
