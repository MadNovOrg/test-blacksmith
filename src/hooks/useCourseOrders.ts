import { gql, useQuery } from 'urql'

import {
  GetCourseOrdersQuery,
  GetCourseOrdersQueryVariables,
} from '@app/generated/graphql'

export const GET_COURSE_ORDERS = gql`
  query GetCourseOrders($orderId: uuid!) {
    orders: course_order(where: { order_id: { _eq: $orderId } }) {
      quantity
      order {
        id
        registrants
        paymentMethod
        currency
        source
        billingAddress
        billingGivenName
        billingFamilyName
        billingEmail
        billingPhone
        salesRepresentative {
          id
          fullName
          avatar
          archived
        }
        bookingContact
        promoCodes
        xeroInvoiceNumber
        organizationId
        organization {
          name
        }
        user
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
      course {
        id
        course_code
        level
        name
        type
        source
        go1Integration
        max_participants
        start
        end
        freeSpaces
        deliveryType
        bookingContact {
          fullName
          email
          phone
        }
        bookingContactInviteData
        reaccreditation
        residingCountry
      }
    }
  }
`

export default function useCourseOrders({
  orderId,
}: {
  orderId: GetCourseOrdersQueryVariables['orderId']
}) {
  return useQuery<GetCourseOrdersQuery, GetCourseOrdersQueryVariables>({
    query: GET_COURSE_ORDERS,
    variables: { orderId },
  })
}
