import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import {
  ConfirmCcPaymentMutation,
  ConfirmCcPaymentMutationVariables,
  GetOrderQuery,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  stripe,
  Elements,
  STRIPE_CREATE_PAYMENT,
  StripeCreatePaymentResp,
  CONFIRM_CC_PAYMENT,
} from '@app/lib/stripe'
import { QUERY as GET_ORDER } from '@app/queries/order/get-order'
import { Currency } from '@app/types'

import { PaymentForm } from './Form'

type State = {
  loading: boolean
  error?: Error
  paymentIntent?: StripeCreatePaymentResp['paymentIntent']
}

const getStripe = async () => {
  const s = await stripe
  if (!s) throw Error('Failed to load stripe')
  return s
}

export const CourseBookingPayment = () => {
  const { t } = useTranslation()
  const { orderId } = useParams()
  const fetcher = useFetcher()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [state, _setState] = useState<State>({ loading: true })
  const setState = useCallback(
    (next: Partial<State>) => _setState(prev => ({ ...prev, ...next })),
    []
  )

  const isCallback = !!searchParams.get('payment_intent_client_secret')

  const onSuccess = useCallback(() => {
    navigate(`../done?order_id=${orderId}`, { replace: true })
  }, [navigate, orderId])

  useEffect(() => {
    if (isCallback) return

    const initiatePayment = async () => {
      try {
        setState({ loading: true })
        const { order } = await fetcher<GetOrderQuery>(GET_ORDER, { orderId })
        if (!order || !order.orderTotal) {
          return setState({ loading: false, error: Error('ORDER_INVALID') })
        }

        const vars = { input: { orderId: order.id } }
        const { paymentIntent } = await fetcher<StripeCreatePaymentResp>(
          STRIPE_CREATE_PAYMENT,
          vars
        )

        const s = await getStripe()
        const pi = await s.retrievePaymentIntent(paymentIntent.clientSecret)
        const status = pi.paymentIntent?.status ?? ''
        if (['succeeded'].includes(status)) {
          return onSuccess()
        }

        setState({ loading: false, error: undefined, paymentIntent })
      } catch (error) {
        console.error(error)
        setState({ loading: false, error: Error('FAILED_TO_INITIATE_PAYMENT') })
      }
    }

    initiatePayment()
  }, [isCallback, fetcher, orderId, setState, onSuccess])

  useEffect(() => {
    if (!isCallback) return

    const checkPayment = async () => {
      try {
        const clientSecret = searchParams.get('payment_intent_client_secret')
        if (!clientSecret) throw Error('Bad request')

        const s = await getStripe()
        const pi = await s.retrievePaymentIntent(clientSecret)
        const status = pi.paymentIntent?.status ?? ''
        if (['succeeded'].includes(status)) {
          const { confirmCreditCardPayment } = await fetcher<
            ConfirmCcPaymentMutation,
            ConfirmCcPaymentMutationVariables
          >(CONFIRM_CC_PAYMENT, { orderId })

          if (confirmCreditCardPayment?.confirmed) {
            return onSuccess()
          } else {
            console.error('Failed to confirm cc payment')
            setState({
              loading: false,
              error: Error(confirmCreditCardPayment?.error ?? ''),
            })
          }
        }

        navigate(`../payment/${orderId}`, { replace: true })
      } catch (error) {
        console.error(error)
        setState({ loading: false, error: Error('FAILED_TO_INITIATE_PAYMENT') })
      }
    }

    checkPayment()
  }, [
    isCallback,
    setState,
    onSuccess,
    searchParams,
    navigate,
    orderId,
    fetcher,
  ])

  const {
    clientSecret,
    amount = 0,
    currency = Currency.GBP,
  } = state.paymentIntent ?? {}

  const isLoading = isCallback || state.loading
  const isError = !isLoading && state.error
  const isOk = !isLoading && !isError

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
            {t(
              `pages.book-course.payment-cc-error-${
                state.error?.message ?? 'FAILED_TO_INITIATE_PAYMENT'
              }`
            )}
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
