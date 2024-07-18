import { LoadingButton } from '@mui/lab'
import { Alert, Box, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Currency } from '@app/generated/graphql'
import { useStripe, useElements, PaymentElement } from '@app/lib/stripe'

type Props = {
  amount: number
  currency: Currency
}

type State = {
  formLoaded: boolean
  submitting: boolean
  error?: Error
}

const initialState = { formLoaded: false, submitting: false, error: undefined }

export const PaymentForm: React.FC<React.PropsWithChildren<Props>> = ({
  amount,
  currency,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useTranslation()

  const [state, _setState] = useState<State>(initialState)
  const setState = useCallback(
    (next: Partial<State>) => _setState(prev => ({ ...prev, ...next })),
    [],
  )

  const submitPayment = useCallback(async () => {
    if (!stripe || !elements) return

    try {
      setState({ submitting: true, error: undefined })

      const confirmParams = { return_url: window.location.href }
      const { error } = await stripe.confirmPayment({ elements, confirmParams })
      setState({ submitting: false })

      if (error && error.type !== 'validation_error') {
        throw Error(error.message)
      }
    } catch (error) {
      setState({ submitting: false, error: error as Error })
    }
  }, [stripe, elements, setState])

  return (
    <Box py={4} maxWidth={400}>
      <PaymentElement
        onReady={() => setState({ formLoaded: true })}
        options={{ readOnly: state.submitting }}
      />

      {state.formLoaded ? (
        <>
          <Box mt={4}>
            {state.error ? (
              <Alert variant="filled" color="error" severity="error">
                {state.error.message}
              </Alert>
            ) : (
              <Typography>
                {t('pages.book-course.payment-cc-chargeInfo')}{' '}
                {t('currency', { amount, currency })}
              </Typography>
            )}
          </Box>

          <LoadingButton
            variant="contained"
            color="primary"
            onClick={submitPayment}
            sx={{ mt: 4 }}
            loading={state.submitting}
          >
            {t('pages.book-course.payment-cc-submit')}
          </LoadingButton>
        </>
      ) : null}
    </Box>
  )
}
