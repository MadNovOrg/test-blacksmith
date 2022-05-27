import { gql } from 'graphql-request'

import { Organization } from '@app/types'

import { ORGANIZATION } from '../fragments'

export type ResponseType = { org: Organization }

export type ParamsType = {
  name: string
  attributes: {
    adminEmail: string
  }
}

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation CreateOrg($name: String!, $attributes: jsonb!) {
    org: insert_organization_one(
      object: { name: $name, attributes: $attributes }
    ) {
      ...Organization
    }
  }
`
