import { Alert, Box, Container, Link, Stack, Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  GetOrderQuery,
  GetOrderQueryVariables,
  Payment_Methods_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY as GET_ORDER_QUERY } from '@app/queries/order/get-order'
import {
  MUTATION as DELETE_TEMP_PROFILE,
  ResponseType as DeleteTempProfileResponseType,
  ParamsType as DeleteTempProfileParamsType,
} from '@app/queries/profile/delete-temp-profile'

const completedSteps = ['details', 'review', 'payment']

export const CourseBookingDone: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const fetcher = useFetcher()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id') as string

  useEffect(() => {
    if (!profile) return

    fetcher<DeleteTempProfileResponseType, DeleteTempProfileParamsType>(
      DELETE_TEMP_PROFILE,
      { email: profile.email }
    )
  }, [fetcher, profile])

  const [{ data, error }] = useQuery<GetOrderQuery, GetOrderQueryVariables>({
    query: GET_ORDER_QUERY,
    variables: { orderId },
    pause: !orderId,
  })
  const order = data?.order
  const noOrder = order === null || error

  const steps = useMemo(() => {
    if (!order) return []

    return [
      {
        key: 'details',
        label: t('pages.book-course.step-1'),
      },
      {
        key: 'review',
        label: t('pages.book-course.step-2'),
      },
      order.paymentMethod === Payment_Methods_Enum.Cc
        ? { key: 'payment', label: t('pages.book-course.step-3') }
        : null,
    ].filter(Boolean)
  }, [t, order])

  return (
    <Box bgcolor="grey.100" height="100%">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box flex={1} display="flex">
          <Box width={300} display="flex" flexDirection="column" pr={4}>
            <Sticky top={20}>
              {steps.length ? (
                <Box mb={7}>
                  <Typography variant="h2" mb={2}>
                    {t('pages.book-course.title')}
                  </Typography>
                </Box>
              ) : null}

              <StepsNavigation
                completedSteps={completedSteps}
                currentStepKey={null}
                steps={steps}
                data-testid="create-course-nav"
              />
            </Sticky>
          </Box>

          <Box flex={1}>
            <Box>
              <Stack flex={1} alignItems="center" textAlign="center">
                {noOrder ? (
                  <Alert color="error" severity="error" sx={{ mb: 4 }}>
                    {t('errors.loading-order')}
                  </Alert>
                ) : (
                  <Alert variant="outlined" color="success" sx={{ mb: 4 }}>
                    {t('pages.book-course.order-success-info')}
                    <Link href={`/orders/${order?.id}`}>
                      {order?.xeroInvoiceNumber}
                    </Link>
                  </Alert>
                )}

                {noOrder ? null : (
                  <Typography variant="subtitle1">
                    {t('pages.book-course.order-success-msg')}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
