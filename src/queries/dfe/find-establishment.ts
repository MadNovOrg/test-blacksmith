import { gql } from 'urql'

import { ESTABLISHMENT } from '@app/queries/fragments'

export const QUERY = gql`
  ${ESTABLISHMENT}
  query FindEstablishment($where: dfe_establishment_bool_exp!) {
    establishments: dfe_establishment(where: $where, limit: 10) {
      ...Establishment
    }
    total: dfe_establishment_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
