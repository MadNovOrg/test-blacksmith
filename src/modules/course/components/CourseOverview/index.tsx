import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Accreditors_Enum } from '@app/generated/graphql'
import { Course } from '@app/types'

import { BILDOverview } from './BILDOverview'
import { ICMOverviewV2 } from './ICMOverviewV2'

type CourseOverviewProps = {
  course: Course
}

export const CourseOverview: React.FC<
  React.PropsWithChildren<CourseOverviewProps>
> = ({ course }: CourseOverviewProps) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="h4" fontWeight={600}>
        {t('pages.course-details.tabs.course-overview.title')}
      </Typography>

      <Typography variant="body1" mb={3} color="grey.600">
        {t('pages.course-details.tabs.course-overview.description')}
      </Typography>

      {course.accreditedBy === Accreditors_Enum.Icm ? (
        <ICMOverviewV2 curriculum={course.curriculum} />
      ) : null}

      {course.accreditedBy === Accreditors_Enum.Bild && (
        <BILDOverview course={course} />
      )}
    </Box>
  )
}
