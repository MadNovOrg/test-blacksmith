import { gql } from 'urql'

export default gql`
  mutation DeleteGo1License($id: uuid!) {
    delete_go1_licenses_by_pk(id: $id) {
      id
    }
  }
`
