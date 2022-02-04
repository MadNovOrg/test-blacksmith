import { gql } from 'graphql-request'

export const getModuleGroups = gql`
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
