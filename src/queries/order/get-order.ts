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
      profile {
        fullName
        email
        phone
      }
      course {
        id
        course_code
        level
        name
        type
        salesRepresentative {
          fullName
        }
        start
        end
      }
    }
  }
`
