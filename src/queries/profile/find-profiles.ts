import { gql } from 'graphql-request'

import { Profile } from '@app/types'
import { PROFILE } from '@app/queries/fragments'

export type ResponseType = { profiles: Profile[] }

export type ParamsType = {
  where?: object
}

export const QUERY = gql`
  ${PROFILE}
  query FindProfiles($where: profile_bool_exp = {}) {
    profiles: profile(where: $where) {
      ...Profile
    }
  }
`
