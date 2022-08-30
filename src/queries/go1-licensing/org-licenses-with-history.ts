import { gql } from 'graphql-request'

export default gql`
  query OrgLicensesWithHistory($id: uuid!, $limit: Int, $offset: Int) {
    organization_by_pk(id: $id) {
      id
      go1Licenses
      go1LicensesHistory(
        order_by: { captured_at: desc }
        limit: $limit
        offset: $offset
      ) {
        id
        captured_at
        event
        payload
        balance
        change
      }
      go1LicensesHistory_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
