import InfoIcon from '@mui/icons-material/Info'
import { Alert, Container, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import {
  CancelIndividualFromCourseError,
  CancelIndividualFromCourseMutation,
  CancelIndividualFromCourseMutationVariables,
  CancellationFeeType,
} from '@app/generated/graphql'
import { CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION } from '@app/modules/course_details/course_attendees_tab/queries/cancel-individual-from-course'
import { BlendedLearningStatus, Course, CourseParticipant } from '@app/types'

import { Actions, Title } from '../../components'

export type VariantMinimalProps = {
  course: Course
  participant: CourseParticipant
  onClose: () => void
  onSubmit: () => void
}

export const VariantMinimal: React.FC<VariantMinimalProps> = ({
  participant,
  course,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('pages')

  const [restrictCancel, setRestrictCancel] = useState(
    (course.go1Integration &&
      participant.go1EnrolmentStatus === BlendedLearningStatus.COMPLETED) ||
      Boolean(participant.go1EnrolmentStarted),
  )

  const [{ fetching, error }, cancelIndividualFromCourse] = useMutation<
    CancelIndividualFromCourseMutation,
    CancelIndividualFromCourseMutationVariables
  >(CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION)

  const onFormSubmit = async () => {
    const resp = await cancelIndividualFromCourse({
      courseId: course.id,
      profileId: participant.profile.id,
      reason: 'N/A',
      fee: 0,
      feeType: CancellationFeeType.NoFees,
    })

    if (
      resp.data?.cancelIndividualFromCourse?.error ===
      CancelIndividualFromCourseError.Go1EnrollmentStarted
    ) {
      setRestrictCancel(true)
      return
    }

    onSubmit?.()
    onClose()
  }

  return (
    <Container>
      {restrictCancel ? (
        <Dialog
          open={true}
          onClose={onClose}
          slots={{
            Title: () => (
              <Grid container sx={{ gap: 1 }}>
                <Typography variant="h4" fontWeight={600}>
                  This attendee cannot be cancelled
                </Typography>
              </Grid>
            ),
          }}
          maxWidth={800}
        >
          <Container disableGutters>
            <Alert sx={{ mb: 2 }} severity="warning" variant="outlined">
              The attendee <strong>{participant.profile.fullName}</strong>{' '}
              cannot be cancelled because they have already started the learning
              on Go1.
            </Alert>
            {error && <Alert severity="error">{error.message}</Alert>}
          </Container>
        </Dialog>
      ) : (
        <Dialog
          open={true}
          onClose={onClose}
          slots={{
            Title: () => (
              <Grid container sx={{ gap: 1 }}>
                <InfoIcon color={'info'} />
                <Title
                  fullName={participant.profile.fullName}
                  courseCode={course.course_code}
                />
              </Grid>
            ),
            Actions: () => (
              <Actions
                loading={fetching}
                onClose={onClose}
                onSubmit={() => {
                  onFormSubmit()
                }}
              />
            ),
          }}
          maxWidth={800}
        >
          <Container>
            <Typography sx={{ mb: 2 }} variant="body1" color="grey.600">
              {t(`individual-cancellation-minimal.description`)}
            </Typography>
            {error && <Alert severity="error">{error.message}</Alert>}
          </Container>
        </Dialog>
      )}
    </Container>
  )
}
