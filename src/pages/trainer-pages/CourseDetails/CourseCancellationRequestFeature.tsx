import Cancel from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  DeleteCourseCancellationRequestMutation,
  DeleteCourseCancellationRequestMutationVariables,
} from '@app/generated/graphql'
import { CourseCancellationModal } from '@app/pages/EditCourse/components/CourseCancellationModal'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { acl } = useAuth()
  const { t } = useTranslation()

  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const [{ error }, deleteCourseCancelationRequest] = useMutation<
    DeleteCourseCancellationRequestMutation,
    DeleteCourseCancellationRequestMutationVariables
  >(DELETE_COURSE_CANCELLATION_REQUEST_MUTATION)

  const deleteCancellationRequest = useCallback(async () => {
    if (course?.cancellationRequest) {
      const { data } = await deleteCourseCancelationRequest({
        id: course.cancellationRequest.id,
      })
      if (data) onChange()
    }
  }, [course.cancellationRequest, deleteCourseCancelationRequest, onChange])

  return (
    <Container>
      {course.cancellationRequest ? (
        <Alert
          severity="warning"
          variant="outlined"
          icon={isMobile ? false : <WarningAmberIcon fontSize="inherit" />}
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
            rowGap={2}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Typography
              variant="body2"
              color="grey.900"
              data-testid="cancellation-alert"
            >
              {t('pages.course-details.cancellation-request-alert')}
            </Typography>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              alignItems="center"
              gap={2}
            >
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
          {error.message}
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
