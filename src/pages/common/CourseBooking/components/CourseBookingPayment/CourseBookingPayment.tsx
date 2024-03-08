import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation } from 'urql'

import {
  Currency,
  StripeCreatePaymentMutation,
  StripeCreatePaymentMutationVariables,
} from '@app/generated/graphql'
import { useOrder } from '@app/hooks/useOrder'
import { stripe, Elements, STRIPE_CREATE_PAYMENT } from '@app/lib/stripe'

import { PaymentForm } from './Form'

export const CourseBookingPayment = () => {
  const { t } = useTranslation()
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isCallback = !!searchParams.get('payment_intent_client_secret')

  const [{ data: orderData, fetching: orderFetching, error: orderError }] =
    useOrder(orderId ?? '')

  const [
    {
      data: createPaymentData,
      fetching: creatingPaymentIntent,
      error: createPaymentIntentError,
    },
    createPaymentIntent,
  ] = useMutation<
    StripeCreatePaymentMutation,
    StripeCreatePaymentMutationVariables
  >(STRIPE_CREATE_PAYMENT)

  const onSuccess = useCallback(() => {
    navigate(`../done?order_id=${orderId}`, { replace: true })
  }, [navigate, orderId])

  useEffect(() => {
    if (isCallback || !orderData?.order) return

    createPaymentIntent({ input: { orderId: orderData.order[0].order?.id } })
  }, [isCallback, orderData?.order, createPaymentIntent])

  useEffect(() => {
    if (isCallback) {
      onSuccess()
    }
  }, [isCallback, onSuccess])

  const {
    clientSecret,
    amount = 0,
    currency = Currency.Gbp,
  } = createPaymentData?.paymentIntent ?? {}

  const isLoading = isCallback || orderFetching || creatingPaymentIntent
  const isError = !isLoading && (orderError || createPaymentIntentError)
  const isOk = Boolean(!isLoading && !isError && clientSecret)

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500">
        {t('pages.book-course.payment-cc-title')}
      </Typography>
      <Typography variant="body1">
        {t('pages.book-course.payment-cc-subtitle')}
      </Typography>

      {isLoading ? (
        <Box py={5}>
          <CircularProgress />
        </Box>
      ) : null}

      {isError ? (
        <Box py={5}>
          <Alert variant="filled" color="error" severity="error">
            {t([
              `pages.book-course.payment-cc-error-${
                !orderData?.order[0]?.order?.id ? 'ORDER_NOT_FOUND' : ''
              }`,
              `pages.book-course.payment-cc-error-${createPaymentIntentError?.message}`,
              'pages.book-course.payment-cc-error-GENERIC_ERROR',
            ])}
          </Alert>
        </Box>
      ) : null}

      {isOk ? (
        <Elements stripe={stripe} options={{ clientSecret }}>
          <PaymentForm amount={amount} currency={currency} />
        </Elements>
      ) : null}
    </Box>
  )
}
