import { gql } from 'graphql-request'

export default gql`
  query OrgLicensesWithHistory(
    $id: uuid!
    $limit: Int
    $offset: Int
    $withHistory: Boolean = true
    $withMainOrg: Boolean = false
  ) {
    organization_by_pk(id: $id) {
      id
      go1Licenses
      reservedGo1Licenses
      go1LicensesHistory(
        order_by: { captured_at: desc }
        limit: $limit
        offset: $offset
      ) @include(if: $withHistory) {
        id
        captured_at
        event
        payload
        balance
        reservedBalance
        change
      }
      go1LicensesHistory_aggregate @include(if: $withHistory) {
        aggregate {
          count
        }
      }
      main_organisation @include(if: $withMainOrg) {
        id
        go1Licenses
        go1LicensesHistory(
          order_by: { captured_at: desc }
          limit: $limit
          offset: $offset
        ) @include(if: $withHistory) {
          id
          captured_at
          event
          payload
          balance
          reservedBalance
          change
        }
        go1LicensesHistory_aggregate @include(if: $withHistory) {
          aggregate {
            count
          }
        }
        reservedGo1Licenses
      }
    }
  }
`
