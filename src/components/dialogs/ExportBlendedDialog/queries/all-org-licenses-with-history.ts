import { gql } from 'graphql-request'

export const GET_LICENSES_HISTORY = gql`
  query LicensesHistoryBetweenDates($from: timestamptz!, $to: timestamptz!) {
    go1LicensesHistory: go1_licenses_history(
      order_by: { organization: { name: asc }, captured_at: asc }
      where: {
        _and: [{ captured_at: { _lte: $to } }, { captured_at: { _gte: $from } }]
      }
    ) {
      id
      captured_at
      event
      payload
      balance
      reservedBalance
      change
      organization {
        name
      }
    }
  }
`
