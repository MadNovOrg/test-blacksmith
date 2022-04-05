import { gql } from 'graphql-request'

import { PROFILE } from '@app/queries/fragments'
import { Profile } from '@app/types'

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
