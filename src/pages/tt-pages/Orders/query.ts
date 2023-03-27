import { gql } from 'graphql-request'

export const GET_ORDERS = gql`
  fragment ContactInfo on xero_contact {
    firstName
  }

  fragment InvoiceInfo on xero_invoice {
    status
    dueDate
    reference
    contact {
      ...ContactInfo
    }
  }

  fragment OrderOrganizationInfo on organization {
    id
    name
    address
  }

  fragment OrderInfo on order {
    id
    orderDue
    xeroInvoiceNumber
    paymentMethod
    orderTotal
    currency
    organization {
      ...OrderOrganizationInfo
    }
    invoice {
      ...InvoiceInfo
    }
  }

  query Orders(
    $where: order_bool_exp
    $orderBy: [order_order_by!]
    $offset: Int = 0
    $limit: Int = 12
  ) {
    order(where: $where, order_by: $orderBy, limit: $limit, offset: $offset) {
      ...OrderInfo
    }
    order_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
