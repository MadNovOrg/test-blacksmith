import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
      const courseId = await saveCourse()
      completeStep(StepsEnum.REVIEW_AND_CONFIRM)
      navigate(
        `/registration?course_id=${courseId}&quantity=${courseData.maxParticipants}`
      )
    } catch (err) {
      console.error(err)
      setError(t('pages.create-course.review-and-confirm.unknown-error'))
    }
  }, [
    completeStep,
    courseData,
    expenses,
    navigate,
    saveCourse,
    setError,
    t,
    trainers,
  ])

  if (error || !courseData || !trainers || !expenses) {
    return (
      <Alert
        severity="error"
        variant="filled"
        data-testid="ReviewAndConfirm-alert"
      >
        {error || t('pages.create-course.assign-trainers.course-not-found')}
      </Alert>
    )
  }

  return courseData ? (
    <Stack spacing={5}>
      <PageContent />

      <Box
        display="flex"
        paddingBottom={5}
        justifyContent="space-between"
        sx={{ marginTop: 4 }}
      >
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
          {t('pages.create-course.review-and-confirm.back-btn')}
        </Button>

        <Box>
          <Button variant="text" sx={{ marginRight: 4 }} onClick={saveDraft}>
            {t('pages.create-course.save-as-draft')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            data-testid="ReviewAndConfirm-submit"
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
