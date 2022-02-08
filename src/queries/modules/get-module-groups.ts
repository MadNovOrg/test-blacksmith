import { gql } from 'graphql-request'

import { ModuleGroup } from '@app/types'

export type ResponseType = { groups: ModuleGroup[] }

export type ParamsType = { level: number }

export const QUERY = gql`
  query ModuleGroups($level: Int!) {
    groups: module_group(where: { level: { _eq: $level } }) {
      id
      name
      level
      modules {
        id
        name
        description
        level
        type: module_category
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`
