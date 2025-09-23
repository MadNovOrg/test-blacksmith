import { gql } from 'urql'

export default gql`
  mutation ManageOrgResourcePacks($input: ResourcePacksAddInput!) {
    addResourcePacks(input: $input) {
      success
      error
      totalResourcePacks
    }
  }
`
