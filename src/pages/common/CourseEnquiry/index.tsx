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
  CourseType,
  InsertCourseEnquiryMutation,
  InsertCourseEnquiryMutationVariables,
} from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { gqlRequest } from '@app/lib/gql-request'
import insertEnquiry from '@app/queries/booking/insert-enquiry'
import { LoadingStatus } from '@app/util'

import { NotFound } from '../NotFound'

export const CourseEnquiry = () => {
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
        InsertCourseEnquiryMutation,
        InsertCourseEnquiryMutationVariables
      >(insertEnquiry, {
        enquiry: {
          courseId: Number(courseId) ?? 0,
          givenName: data.firstName,
          familyName: data.lastName,
          email: data.email,
          interest: data.interest,
          phone: data.phone,
          orgName: data.orgName,
          sector: data.sector,
          source: data.source,
          message: data.message,
        },
      })

      if (result.insert_course_enquiry?.affected_rows) {
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
            {t('pages.enquiry.success-title')}
          </Typography>
          <Typography mb={3}>{t('pages.enquiry.success-message')}</Typography>
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
        {t('pages.enquiry.title')}
      </Typography>
      <Typography mb={5} textAlign="center">
        {t('pages.enquiry.subtitle')}
      </Typography>

      {hasError ? (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {t('pages.enquiry.error-message')}
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
          courseType={CourseType.Open}
        />
      )}
    </AppLayoutMinimal>
  )
}
