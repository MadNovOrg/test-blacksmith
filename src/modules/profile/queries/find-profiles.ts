import { gql } from 'graphql-request'

import { PROFILE } from '@app/queries/fragments'

export const FIND_PROFILES = gql`
  ${PROFILE}
  query FindProfiles($where: profile_bool_exp = {}) {
    profiles: profile(where: $where) {
      ...Profile
    }
  }
`
