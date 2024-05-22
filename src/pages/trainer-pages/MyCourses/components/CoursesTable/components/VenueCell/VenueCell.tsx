import { TableCell, Typography } from '@mui/material'

import { TableCourse } from '../../types'

export function VenueCell({ course }: { course: TableCourse }) {
  return (
    <TableCell>
      <Typography mb={1}>{course.schedule[0]?.venue?.name}</Typography>
      <Typography variant="body2" data-testid="venue-name">
        {!course.schedule[0]?.venue?.id
          ? 'Online'
          : course.schedule[0]?.venue?.city}
      </Typography>
    </TableCell>
  )
}
