import { gql, useQuery } from 'urql'

import { GetOrderQuery, GetOrderQueryVariables } from '@app/generated/graphql'

export const GET_ORDER_QUERY = gql`
  query GetOrder($orderId: uuid!) {
    order: course_order(where: { order_id: { _eq: $orderId } }) {
      quantity
      order {
        id
        profileId
        registrants
        paymentMethod
        orderDue
        orderTotal
        currency
        source
        billingAddress
        billingGivenName
        billingFamilyName
        billingEmail
        billingPhone
        registrants
        salesRepresentative {
          id
          fullName
          avatar
          archived
        }
        bookingContact
        stripePaymentId
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
        start: schedule_aggregate {
          aggregate {
            date: max {
              start
            }
          }
        }
        end: schedule_aggregate {
          aggregate {
            date: max {
              end
            }
          }
        }
        go1Integration
        max_participants
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

export const useOrder = (orderId: string) => {
  return useQuery<GetOrderQuery, GetOrderQueryVariables>({
    query: GET_ORDER_QUERY,
    variables: { orderId },
    requestPolicy: 'cache-and-network',
  })
}
