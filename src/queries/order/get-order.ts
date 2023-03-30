import { gql } from 'urql'

export const QUERY = gql`
  query GetOrder($orderId: uuid!) {
    order: order_by_pk(id: $orderId) {
      id
      courseId
      profileId
      quantity
      registrants
      paymentMethod
      orderDue
      orderTotal
      currency
      stripePaymentId
      promoCodes
      xeroInvoiceNumber
      organizationId
      user
      course {
        id
        course_code
        level
        name
        type
        source
        salesRepresentative {
          fullName
          avatar
          archived
        }
        start
        end
        freeSpaces
      }
      invoice {
        xeroId
        invoiceNumber
        lineItems
        status
        fullyPaidOnDate
        amountDue
        amountPaid
        reference
        currencyCode
        subtotal
        totalTax
        total
        dueDate
        issuedDate
        contact {
          phones
          addresses
          name
          firstName
          lastName
          emailAddress
        }
      }
    }
  }
`
