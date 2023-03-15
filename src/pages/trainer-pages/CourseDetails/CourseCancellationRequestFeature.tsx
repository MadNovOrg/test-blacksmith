import Cancel from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Alert, Box, Button, Container, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  DeleteCourseCancellationRequestMutation,
  DeleteCourseCancellationRequestMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CourseCancellationModal } from '@app/pages/EditCourse/CourseCancellationModal'
import { CourseCancellationRequestModal } from '@app/pages/trainer-pages/CourseDetails/CourseCancellationRequestModal'
import { DELETE_COURSE_CANCELLATION_REQUEST_MUTATION } from '@app/queries/courses/delete-course-cancellation-request'
import { Course } from '@app/types'

export type CourseCancellationRequestFeatureProps = {
  course: Course
  open: boolean
  onClose: () => void
  onChange: () => void
}

export const CourseCancellationRequestFeature: React.FC<
  React.PropsWithChildren<CourseCancellationRequestFeatureProps>
> = ({ course, open, onClose, onChange }) => {
  const fetcher = useFetcher()
  const { acl } = useAuth()
  const { t } = useTranslation()

  const [error, setError] = useState('')
  const [showCancellationModal, setShowCancellationModal] = useState(false)

  const deleteCancellationRequest = useCallback(async () => {
    if (course?.cancellationRequest) {
      setError('')
      try {
        await fetcher<
          DeleteCourseCancellationRequestMutation,
          DeleteCourseCancellationRequestMutationVariables
        >(DELETE_COURSE_CANCELLATION_REQUEST_MUTATION, {
          id: course.cancellationRequest.id,
        })
        onChange()
      } catch (e: unknown) {
        setError((e as Error).message)
      }
    }
  }, [course, fetcher, onChange])

  return (
    <Container>
      {course.cancellationRequest ? (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            my: 2,
            alignItems: 'center',
            '&& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="grey.900"
              data-testid="cancellation-alert"
            >
              {t('pages.course-details.cancellation-request-alert')}
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="text"
                startIcon={<Cancel />}
                onClick={deleteCancellationRequest}
              >
                {t('pages.course-details.delete-request')}
              </Button>
              {acl.canCancelCourses() ? (
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => setShowCancellationModal(true)}
                  data-testid="approve-cancellation-button"
                >
                  {t('pages.course-details.approve-cancellation')}
                </Button>
              ) : null}
            </Box>
          </Box>
        </Alert>
      ) : null}
      {error ? (
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            mx: 3,
            mt: 2,
          }}
        >
          {error}
        </Alert>
      ) : null}

      <Dialog
        open={open}
        onClose={onClose}
        title={
          <Typography variant="h3" fontWeight={600}>
            {t('pages.course-details.request-cancellation-modal.title')}
          </Typography>
        }
        maxWidth={600}
      >
        <CourseCancellationRequestModal
          course={course}
          onClose={onClose}
          onSubmit={async () => {
            onChange()
            onClose()
          }}
        />
      </Dialog>

      <Dialog
        open={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        title={
          <Typography variant="h3" fontWeight={600}>
            {t('pages.edit-course.cancellation-modal.title')}
          </Typography>
        }
        maxWidth={600}
      >
        <CourseCancellationModal
          course={course}
          onClose={() => setShowCancellationModal(false)}
          onSubmit={async () => {
            onChange()
            setShowCancellationModal(false)
          }}
        />
      </Dialog>
    </Container>
  )
}
