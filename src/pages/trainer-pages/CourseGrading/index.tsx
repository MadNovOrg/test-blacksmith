import { Alert, CircularProgress, Container, Stack } from '@mui/material'
import { t } from 'i18next'
import { useParams } from 'react-router-dom'

import { Accreditors_Enum } from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'
import { LoadingStatus } from '@app/util'

import { BILDGrading } from './components/BILDGrading'
import { ICMGrading } from './components/ICMGrading'
import useCourseGradingData from './useCourseGradingData'

export const CourseGrading = () => {
  const { id: courseId } = useParams()

  const { data: course, status } = useCourseGradingData(Number(courseId) ?? '')

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ padding: theme.spacing(2, 0, 4, 0) }}>
        {status === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {status === LoadingStatus.ERROR ? (
          <Alert severity="error">
            {t('pages.course-grading-details.course-error-alert-text')}
          </Alert>
        ) : null}

        {course?.accreditedBy === Accreditors_Enum.Icm ? (
          <ICMGrading course={course} />
        ) : null}

        {course?.accreditedBy === Accreditors_Enum.Bild ? (
          <BILDGrading course={course} />
        ) : null}
      </Container>
    </FullHeightPageLayout>
  )
}
