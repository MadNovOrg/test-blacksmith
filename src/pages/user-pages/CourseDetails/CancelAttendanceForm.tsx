import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CancelMyselfFromCourseMutation,
  CancelMyselfFromCourseMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CancellationTermsTable } from '@app/pages/EditCourse/CancellationTermsTable'
import { CANCEL_MYSELF_FROM_COURSE_MUTATION } from '@app/queries/courses/cancel-myself-from-course'
import { Course, CourseType } from '@app/types'

type CancelAttendanceFormProps = {
  course: Course
  onClose: () => void
  onSubmit: () => void
}

export const CancelAttendanceForm: React.FC<
  React.PropsWithChildren<CancelAttendanceFormProps>
> = ({ course, onClose, onSubmit }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()

  const startDate = course.schedule[0].start

  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onFormSubmit = async () => {
    setLoading(true)

    try {
      await fetcher<
        CancelMyselfFromCourseMutation,
        CancelMyselfFromCourseMutationVariables
      >(CANCEL_MYSELF_FROM_COURSE_MUTATION, {
        courseId: course.id,
      })
      onSubmit()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
        {t('pages.course-details.request-cancellation-modal.warning')}
      </Alert>

      <CancellationTermsTable
        courseStartDate={new Date(startDate)}
        sx={{ mt: 2 }}
      />

      <Box mt={4}>
        <FormControlLabel
          label={t(
            'pages.edit-course.cancellation-modal.cannot-be-undone-confirmation'
          )}
          control={<Checkbox />}
          checked={confirmed}
          onChange={(_, v) => setConfirmed(v)}
          sx={{ userSelect: 'none' }}
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button type="button" variant="text" color="primary" onClick={onClose}>
          {t('pages.edit-course.cancellation-modal.close-modal')}
        </Button>
        <LoadingButton
          loading={loading}
          disabled={course.type === CourseType.OPEN && !confirmed}
          onClick={onFormSubmit}
          type="button"
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
        >
          {t('pages.edit-course.cancellation-modal.cancel-entire-course')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
