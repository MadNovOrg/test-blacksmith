import { gql } from 'graphql-request'

export const GET_TRAINERS = gql`
  query ($limit: Int = 20, $offset: Int = 0, $where: profile_bool_exp) {
    trainers: profile(limit: $limit, offset: $offset, where: $where) {
      id
      fullName
    }
  }
`

export const GET_TRAINERS_LEVELS = gql`
  query (
    $ids: [uuid!]!
    $trainerType: CourseTrainerType!
    $courseLevel: CourseLevel!
    $courseStart: date!
    $courseEnd: date!
  ) {
    getTrainersLevels(
      input: {
        ids: $ids
        trainerType: $trainerType
        courseLevel: $courseLevel
        courseStart: $courseStart
        courseEnd: $courseEnd
      }
    ) {
      profile_id
      availability
      levels
    }
  }
`
