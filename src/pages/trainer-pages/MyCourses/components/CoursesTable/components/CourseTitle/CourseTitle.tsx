import { Typography } from '@mui/material'

export function CourseTitle({
  name,
  code,
}: {
  name: string
  code: string | null | undefined
}) {
  return (
    <>
      <Typography mb={1} data-testid="course-title">
        {name}
      </Typography>
      <Typography variant="body2" data-testid="course-code">
        {code}
      </Typography>
    </>
  )
}
