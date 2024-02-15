import { loadStripe } from '@stripe/stripe-js'
import { gql } from 'graphql-request'

export * from '@stripe/react-stripe-js'

export const stripe = loadStripe(import.meta.env.VITE_STRIPE_KEY)

export const stripeProcessingFeeRate = {
  flat: 0.2,
  percent: 0.014,
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
