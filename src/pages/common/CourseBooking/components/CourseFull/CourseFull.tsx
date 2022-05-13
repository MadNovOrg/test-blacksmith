import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'

type Props = {
  courseId: number
}

export const CourseFull: React.FC<Props> = ({ courseId }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500">
        {t('pages.waitlist.course-full')}
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          component={LinkBehavior}
          href={`/waitlist?course_id=${courseId}`}
        >
          {t('join-waitlist')}
        </Button>
      </Box>
    </Box>
  )
}
