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
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import { LoadingStatus } from '@app/util'

import { StepsEnum } from '../../types'
import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'

import { PageContent } from './PageContent'

export const ReviewAndConfirm = () => {
  const { t } = useTranslation()
  const {
    completeStep,
    courseData,
    expenses,
    saveDraft,
    setCurrentStepKey,
    trainers,
  } = useCreateCourse()
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { addSnackbarMessage } = useSnackbar()

  const { saveCourse, savingStatus } = useSaveCourse()
  const navigate = useNavigate()

  const [error, setError] = useState('')

  useEffect(() => {
    setCurrentStepKey(StepsEnum.REVIEW_AND_CONFIRM)
  }, [setCurrentStepKey])

  const handleSubmit = useCallback(async () => {
    if (!courseData || !trainers || !expenses) {
      return
    }

    try {
      const savedCourse = await saveCourse()

      if (!savedCourse?.id) {
        throw new Error()
      }
      completeStep(StepsEnum.REVIEW_AND_CONFIRM)

      if (savedCourse?.hasExceptions) {
        addSnackbarMessage('course-created', {
          label: t('pages.create-course.submitted-closed-exceptions', {
            code: savedCourse?.courseCode,
          }),
        })
      } else {
        addSnackbarMessage('course-created', {
          label: (
            <React.Fragment>
              {t('pages.create-course.submitted-closed', {
                code: savedCourse?.courseCode,
              })}
              {acl.canViewOrders() ? (
                <Link href={`/orders/${savedCourse?.orderId}`}>
                  {t('pages.create-course.link-to-order')}
                </Link>
              ) : undefined}
            </React.Fragment>
          ),
        })
      }

      navigate(`/manage-courses/all/${savedCourse.id}/details`)
    } catch (err) {
      console.error(err)
      setError(t('pages.create-course.review-and-confirm.unknown-error'))
    }
  }, [
    addSnackbarMessage,
    completeStep,
    courseData,
    expenses,
    navigate,
    saveCourse,
    acl,
    t,
    trainers,
  ])

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
          <Button
            variant="text"
            sx={{ marginRight: 4 }}
            onClick={saveDraft}
            fullWidth={isMobile}
          >
            {t('pages.create-course.save-as-draft')}
          </Button>

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
