import { gql } from 'graphql-request'

import {
  BildStrategy,
  Course_Level_Enum,
  CourseLevel,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CourseTrainerType, SearchTrainer } from '@app/types'

export type SearchTrainersSchedule = {
  start?: Date | string
  end?: Date | string
}

export type Props = {
  trainerType: CourseTrainerType
  courseLevel: Course_Level_Enum | CourseLevel
  schedule: SearchTrainersSchedule
  bildStrategies?: BildStrategy[]
  courseType: Course_Type_Enum
  query: string
  useAOL?: boolean
}

export type SearchTrainersInput = {
  input: {
    query?: string
    courseLevel?: Course_Level_Enum
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
    translatedGivenName
    translatedFamilyName
    avatar
    email
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
