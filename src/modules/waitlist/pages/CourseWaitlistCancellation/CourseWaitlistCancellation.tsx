import { Box, Typography, Link, Alert, CircularProgress } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { CancelMyselfFromCourseWaitlistError } from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'

import { useCancelMyselfFromCourseWaitlist } from '../../hooks/useCancelMyselfFromCourseWaitlist/useCancelMyselfFromCourseWaitlist'

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const infoEmailAddress = acl.isUK()
    ? import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS
    : import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS_ANZ
  return (
    <AppLayoutMinimal
      width={628}
      contentBoxStyles={{ p: 3 }}
      footer={
        <Box mt={4}>
          <Link
            href={`mailto:${infoEmailAddress}`}
            target="_blank"
            rel="noopener"
            fontWeight={600}
            color="primary"
          >
            {t('need-help')}? {t('contact-us')}
          </Link>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h3"
          fontWeight="600"
          color="secondary"
          gutterBottom
        >
          {t('waitlist-cancellation-title')}
        </Typography>
        {children}
      </Box>
    </AppLayoutMinimal>
  )
}

const Message: React.FC<
  React.PropsWithChildren<{
    errorMessage?: CancelMyselfFromCourseWaitlistError | string
  }>
> = ({ errorMessage }) => {
  const { t } = useTranslation()

  return (
    <Alert
      variant="outlined"
      severity={errorMessage ? 'warning' : 'success'}
      sx={{ mt: 2, minWidth: '100%' }}
    >
      <Typography variant="body1" textAlign="left" color="grey.700">
        {t(errorMessage ?? 'waitlist-cancellation-success')}
      </Typography>
    </Alert>
  )
}

export const CourseWaitlistCancellation: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('course_id')
  const cancellationSecret = searchParams.get('s')

  const [{ data, error }, cancelMyselfFromCourseWaitlist] =
    useCancelMyselfFromCourseWaitlist()

  const apiError = data?.cancelMyselfFromCourseWaitlist?.error

  useEffect(() => {
    if (!courseId || !cancellationSecret) {
      return
    }

    if (!data) {
      cancelMyselfFromCourseWaitlist({
        courseId: +courseId,
        cancellationSecret,
      })
    }
  }, [cancelMyselfFromCourseWaitlist, courseId, cancellationSecret, data])

  const errorMessage = useMemo(() => {
    if (!courseId || !cancellationSecret) {
      return 'errors.generic.malformed-query-params'
    }

    if (error) {
      return 'errors.generic.unknown-error-please-retry'
    }

    if (apiError) {
      return `waitlist-cancellation-error-${apiError}`
    }
  }, [apiError, cancellationSecret, courseId, error])

  return (
    <Wrapper>
      {!data && !errorMessage ? (
        <CircularProgress
          color="primary"
          data-testId="course-waitlist-cancellation-loading"
        />
      ) : (
        <Message errorMessage={errorMessage} />
      )}
    </Wrapper>
  )
}
