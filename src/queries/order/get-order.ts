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
      stripePaymentId
      promoCodes
      xeroInvoiceNumber
      organizationId
      organization {
        name
      }
      user
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
        bookingContact {
          fullName
          email
          phone
        }
        bookingContactInviteData
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

export const ORDER_FOR_BOOKING_DONE = gql`
  query GetOrderForBookingDone($orderId: uuid!) {
    order: order_by_pk(id: $orderId) {
      id
      xeroInvoiceNumber
      paymentMethod
    }
  }
`
