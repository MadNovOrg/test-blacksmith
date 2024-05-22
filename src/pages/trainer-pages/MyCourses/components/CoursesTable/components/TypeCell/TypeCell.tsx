import { TableCell, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { TableCourse } from '../../types'

export function TypeCell({ course }: { course: TableCourse }) {
  const { t } = useTranslation()

  return (
    <TableCell>
      <Typography
        variant="body2"
        sx={{ color: 'inherit' }}
        gutterBottom={course.go1Integration}
      >
        {t(`course-types.${course.type}`)}
      </Typography>
      {course.go1Integration ? (
        <Typography variant="body2" color="grey.600">
          {t('common.blended-learning')}
        </Typography>
      ) : (
        ''
      )}
    </TableCell>
  )
}
