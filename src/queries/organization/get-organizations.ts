import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'
import { Organization } from '@app/types'

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
