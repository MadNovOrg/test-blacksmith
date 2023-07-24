import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import {
  CourseEnquiryForm,
  FormInputs,
} from '@app/components/CourseEnquiryForm'
import { LinkBehavior } from '@app/components/LinkBehavior'
import {
  BookPrivateCourseMutation,
  BookPrivateCourseMutationVariables,
  CourseType,
} from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { gqlRequest } from '@app/lib/gql-request'
import insertBookPrivateCourse from '@app/queries/booking/insert-book-private-course'
import { LoadingStatus } from '@app/util'

import { NotFound } from '../NotFound'

export const BookPrivateCourse = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hasError, setHasError] = useState(false)

  const courseId = searchParams.get('course_id')

  const shouldRenderNotFound = !courseId

  const handleSubmit = async (data: FormInputs) => {
    try {
      setSaving(true)

      const result = await gqlRequest<
        BookPrivateCourseMutation,
        BookPrivateCourseMutationVariables
      >(insertBookPrivateCourse, {
        booking: {
          courseId: Number(courseId) ?? 0,
          givenName: data.firstName,
          familyName: data.lastName,
          email: data.email,
          phone: data.phone,
          orgName: data.orgName,
          sector: data.sector,
          source: data.source,
          message: data.message,
          numParticipants: data.numParticipants,
        },
      })

      if (result.insert_private_course_booking?.affected_rows) {
        setSuccess(true)
      }
    } catch (err) {
      setSuccess(false)
      setHasError(true)
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <AppLayoutMinimal>
        <Box textAlign="center">
          <Typography variant="h3" mb={2}>
            {t('pages.book-private-course.success-title')}
          </Typography>
          <Typography mb={3}>
            {t('pages.book-private-course.success-message')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={LinkBehavior}
            href="/"
          >
            {t('goto-tt')}
          </Button>
        </Box>
      </AppLayoutMinimal>
    )
  }

  return (
    <AppLayoutMinimal width={628}>
      <Typography variant="h3" mb={2} textAlign="center">
        {t('pages.book-private-course.title')}
      </Typography>
      <Typography mb={5} textAlign="center">
        {t('pages.book-private-course.subtitle')}
      </Typography>

      {hasError ? (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {t('pages.book-private-course.error-message')}
        </Alert>
      ) : null}

      {status === LoadingStatus.FETCHING ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : null}
      {shouldRenderNotFound ? (
        <NotFound />
      ) : (
        <CourseEnquiryForm
          onSubmit={handleSubmit}
          saving={saving}
          courseType={CourseType.Closed}
        />
      )}
    </AppLayoutMinimal>
  )
}
