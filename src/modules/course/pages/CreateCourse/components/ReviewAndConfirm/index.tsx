import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Link,
  CircularProgress,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Type_Enum,
  GetOrderReducedQuery,
  GetOrderReducedQueryVariables,
} from '@app/generated/graphql'
import usePollQuery from '@app/hooks/usePollQuery'
import { StepsEnum } from '@app/modules/course/pages/CreateCourse/types'
import { useSaveCourse } from '@app/modules/course/pages/CreateCourse/useSaveCourse'
import { GET_ORDER_REDUCED } from '@app/queries/order/get-order-reduced'
import { LoadingStatus } from '@app/util'

import { useCreateCourse } from '../CreateCourseProvider'

import { PageContent } from './PageContent'

type SavedCourse = {
  id: string
  hasExceptions?: boolean | undefined
  courseCode?: string | undefined
  orderId?: string | undefined
}

export const ReviewAndConfirm = () => {
  const { t } = useTranslation()
  const {
    completeStep,
    courseData,
    expenses,
    setCurrentStepKey,
    trainers,
    setShowDraftConfirmationDialog,
  } = useCreateCourse()
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { addSnackbarMessage } = useSnackbar()

  const { saveCourse, savingStatus } = useSaveCourse()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [savedCourse, setSavedCourseId] = useState<SavedCourse>({
    id: '',
    hasExceptions: false,
    courseCode: '',
    orderId: '',
  })

  const [{ data: orderCompleted }, getOrderReduced] = useQuery<
    GetOrderReducedQuery,
    GetOrderReducedQueryVariables
  >({
    query: GET_ORDER_REDUCED,
    variables: { orderId: savedCourse.orderId },
    pause: !savedCourse.orderId,
  })

  useEffect(() => {
    setCurrentStepKey(StepsEnum.REVIEW_AND_CONFIRM)
  }, [setCurrentStepKey])
  const [startPolling, polling] = usePollQuery(
    () =>
      getOrderReduced({
        requestPolicy: 'network-only',
      }),
    () => !!orderCompleted?.order?.xeroInvoiceNumber,
  )

  useEffect(() => {
    if (
      savedCourse.id &&
      !polling &&
      !orderCompleted?.order?.xeroInvoiceNumber
    ) {
      startPolling()
    }
  }, [startPolling, polling, savedCourse, orderCompleted])

  useEffect(() => {
    if (orderCompleted?.order?.xeroInvoiceNumber && savedCourse.id) {
      completeStep(StepsEnum.REVIEW_AND_CONFIRM)
      addSnackbarMessage('course-created', {
        label: (
          <React.Fragment>
            {t('pages.create-course.submitted-closed', {
              code: savedCourse?.courseCode,
            })}
            {acl.canViewOrders() ? (
              <Link href={`/orders/${savedCourse?.orderId}`}>
                {orderCompleted?.order?.xeroInvoiceNumber ??
                  t('pages.create-course.link-to-order')}
              </Link>
            ) : undefined}
          </React.Fragment>
        ),
      })
      navigate(`/manage-courses/all/${savedCourse.id}/details`)
    }
  }, [
    startPolling,
    polling,
    savedCourse,
    orderCompleted,
    addSnackbarMessage,
    t,
    acl,
    navigate,
    completeStep,
  ])

  const handleSubmit = useCallback(async () => {
    if (!courseData || !trainers || !expenses) {
      return
    }

    try {
      const currentCourse = await saveCourse()

      if (!currentCourse?.id) {
        throw new Error()
      }

      if (currentCourse?.hasExceptions) {
        completeStep(StepsEnum.REVIEW_AND_CONFIRM)
        addSnackbarMessage('course-created', {
          label: t('pages.create-course.submitted-closed-exceptions', {
            code: currentCourse?.courseCode,
          }),
        })
        navigate(`/manage-courses/all/${currentCourse.id}/details`)
      } else {
        setSavedCourseId(currentCourse)
      }
    } catch (err) {
      console.error(err)
      setError(t('pages.create-course.review-and-confirm.unknown-error'))
    }
  }, [
    courseData,
    trainers,
    expenses,
    saveCourse,
    completeStep,
    navigate,
    addSnackbarMessage,
    t,
  ])

  if (polling) {
    return (
      <Stack
        alignItems="center"
        paddingTop={2}
        data-testid="xero-order-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  if (!courseData || !trainers || !expenses) {
    return (
      <Alert
        severity="error"
        variant="outlined"
        data-testid="ReviewAndConfirm-alert"
      >
        {!courseData ? t('pages.create-course.course-not-found') : error}
      </Alert>
    )
  }

  return courseData ? (
    <Stack spacing={5}>
      {error ? (
        <Alert
          severity="error"
          variant="outlined"
          data-testid="ReviewAndConfirm-alert"
        >
          {error}
        </Alert>
      ) : null}

      <PageContent />

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        paddingBottom={5}
        justifyContent="space-between"
        sx={{ marginTop: 4 }}
      >
        <Box mb={2}>
          <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
            {t('pages.create-course.review-and-confirm.back-btn')}
          </Button>
        </Box>

        <Box mb={2}>
          {acl.isTrainer() && courseData.type === Course_Type_Enum.Indirect && (
            <Button
              variant="text"
              sx={{ marginRight: 4 }}
              onClick={() => setShowDraftConfirmationDialog(true)}
              fullWidth={isMobile}
            >
              {t('pages.create-course.save-as-draft')}
            </Button>
          )}

          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            data-testid="ReviewAndConfirm-submit"
            fullWidth={isMobile}
            onClick={handleSubmit}
            loading={savingStatus === LoadingStatus.FETCHING}
          >
            {t('pages.create-course.review-and-confirm.submit-btn')}
          </LoadingButton>
        </Box>
      </Box>
    </Stack>
  ) : null
}
