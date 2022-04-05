import { gql } from 'graphql-request'

import { Organization } from '@app/types'
import { ORGANIZATION } from '@app/queries/fragments'

export type ResponseType = {
  orgs: Organization[]
}

export const QUERY = gql`
  ${ORGANIZATION}
  query GetOrganizations {
    orgs: organization {
      ...Organization
    }
  }
`
