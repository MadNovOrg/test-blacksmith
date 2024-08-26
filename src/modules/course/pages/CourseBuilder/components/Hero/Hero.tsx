import { Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { gql } from 'urql'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { CourseHeroFragment, Course_Status_Enum } from '@app/generated/graphql'
import { formatDateForDraft } from '@app/util'

import { CourseInfo } from '../CourseInfo/CourseInfo'
import { COURSE_INFO_FRAGMENT } from '../CourseInfo/fragments'

type Props = {
  course: CourseHeroFragment
  showMandatoryNotice?: boolean
  slots?: {
    afterTitle?: React.ReactNode
  }
}

export const Hero: React.FC<Props> = ({
  course,
  showMandatoryNotice,
  slots,
}) => {
  const { t } = useTranslation()

  return (
    <Grid container mt={2} spacing={2}>
      <Grid item xs={12} md={7}>
        <Typography variant="h2">{course.name}</Typography>

        {course.isDraft && (
          <Box sx={{ display: 'flex', alignItems: 'center' }} mt={1}>
            <CourseStatusChip status={Course_Status_Enum.Draft} />

            <Typography variant="body2" data-testid="draft-text" sx={{ ml: 1 }}>
              {t('common.last-modified', {
                date: formatDateForDraft(
                  course.updatedAt || new Date(),
                  t('common.ago'),
                  t,
                ),
              })}
            </Typography>
          </Box>
        )}
        {slots?.afterTitle ? (
          <Typography variant="body2" mt={2} data-testid="course-description">
            {slots.afterTitle}
          </Typography>
        ) : null}
        {showMandatoryNotice ? (
          <Typography variant="body2" mt={1} data-testid="mandatory-notice">
            {t(
              'pages.trainer-base.create-course.new-course.mandatory-modules-notice',
            )}
          </Typography>
        ) : null}
      </Grid>

      <Grid item xs={12} md={5}>
        <CourseInfo data={course} data-testid="course-info" />
      </Grid>
    </Grid>
  )
}

export const COURSE_FRAGMENT = gql`
  ${COURSE_INFO_FRAGMENT}

  fragment CourseHero on course {
    id
    isDraft
    updatedAt
    course_code
    level
    type
    reaccreditation
    conversion

    ...CourseInfo
  }
`
