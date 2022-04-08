import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'
import { Organization } from '@app/types'

export type ResponseType = {
  orgs: Organization[]
}

export type ParamsType = {
  name?: string
}

export const QUERY = gql`
  ${ORGANIZATION}
  query GetOrganizations($name: String) {
    orgs: organization(where: { name: { _ilike: $name } }) {
      ...Organization
    }
  }
`
