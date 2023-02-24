import { gql } from 'graphql-request'

export const GET_ORDERS = gql`
  query GetOrders(
    $input: GetOrdersInput = {
      limit: 20
      offset: 0
      orderBy: []
      where: {}
      invoiceStatus: []
    }
  ) {
    getOrders(input: $input) {
      orders {
        createdAt
        currency
        id
        orderDue
        orderTotal
        paymentMethod
        profileId
        quantity
        registrants
        stripePaymentId
        xeroInvoiceNumber
        course
        organization {
          name
          id
        }
        status
      }
      count
    }
  }
`
