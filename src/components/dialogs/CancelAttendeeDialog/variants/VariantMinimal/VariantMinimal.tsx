import InfoIcon from '@mui/icons-material/Info'
import { Alert, Container, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import {
  Title,
  Actions,
} from '@app/components/dialogs/CancelAttendeeDialog/components'
import {
  CancelIndividualFromCourseMutation,
  CancelIndividualFromCourseMutationVariables,
} from '@app/generated/graphql'
import { CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION } from '@app/queries/participants/cancel-individual-from-course'
import { Course, CourseParticipant } from '@app/types'

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

  const [{ fetching, error }, cancelIndividualFromCourse] = useMutation<
    CancelIndividualFromCourseMutation,
    CancelIndividualFromCourseMutationVariables
  >(CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION)

  const onFormSubmit = async () => {
    await cancelIndividualFromCourse({
      courseId: course.id,
      profileId: participant.profile.id,
      reason: 'N/A',
      fee: 0,
    })

    onSubmit?.()
    onClose()
  }

  return (
    <Container>
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
    </Container>
  )
}
