import { gql } from 'graphql-request'

import { CourseLevel, CourseTrainerType, SearchTrainer } from '@app/types'

export type SearchTrainersSchedule = {
  start?: Date | string
  end?: Date | string
}

export type Props = {
  trainerType: CourseTrainerType
  courseLevel: CourseLevel
  schedule: SearchTrainersSchedule
}

export type SearchTrainersInput = {
  input: {
    query?: string
    courseLevel?: CourseLevel
    trainerType?: CourseTrainerType
    courseStart?: Date
    courseEnd?: Date
  }
}

export type SearchTrainersResp = {
  trainers: SearchTrainer[]
}

export const SEARCH_TRAINERS = gql`
  fragment SearchTrainerDetails on SearchTrainer {
    id
    fullName
    avatar
    levels {
      courseLevel
      expiryDate
    }
    availability
    trainer_role_types {
      trainer_role_type {
        name
        id
      }
    }
  }

  query SearchTrainers($input: SearchTrainersInput!) {
    trainers: searchTrainers(input: $input) {
      ...SearchTrainerDetails
    }
  }
`
