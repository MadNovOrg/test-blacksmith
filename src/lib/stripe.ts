import { loadStripe } from '@stripe/stripe-js'
import { gql } from 'graphql-request'

import { Currency } from '@app/types'

export * from '@stripe/react-stripe-js'

export const stripe = loadStripe(import.meta.env.VITE_STRIPE_KEY)

export const stripeProcessingFeeRate = {
  flat: 0.2,
  percent: 0.014,
}

export type StripeCreatePaymentInput = {
  input: {
    orderId: string
  }
}

export type StripeCreatePaymentResp = {
  paymentIntent: {
    clientSecret: string
    amount: number
    currency: Currency
  }
}

export const STRIPE_CREATE_PAYMENT = gql`
  mutation StripeCreatePayment($input: StripeCreatePaymentIntentInput!) {
    paymentIntent: stripeCreatePaymentIntent(input: $input) {
      clientSecret
      amount
      currency
    }
  }
`
