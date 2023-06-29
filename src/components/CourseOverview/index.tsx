import { Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Accreditors_Enum } from '@app/generated/graphql'
import { Course } from '@app/types'

import { BILDOverview } from './BILDOverview'
import { ICMOverview } from './ICMOverview'

type CourseOverviewProps = {
  course: Course
}

export const CourseOverview: React.FC<
  React.PropsWithChildren<CourseOverviewProps>
> = ({ course }: CourseOverviewProps) => {
  const { t } = useTranslation()

  return (
    <Container
      maxWidth="md"
      sx={{
        ml: 0,
      }}
    >
      <Typography variant="h1" fontWeight={600}>
        {t('pages.course-details.tabs.course-overview.title')}
      </Typography>

      <Typography variant="body1" mb={3} color="grey.600">
        {t('pages.course-details.tabs.course-overview.description')}
      </Typography>

      {course.accreditedBy === Accreditors_Enum.Icm && (
        <ICMOverview course={course} />
      )}

      {course.accreditedBy === Accreditors_Enum.Bild && (
        <BILDOverview course={course} />
      )}
    </Container>
  )
}
