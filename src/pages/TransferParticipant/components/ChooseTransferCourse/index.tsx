import ArrowForward from '@mui/icons-material/ArrowForward'
import Info from '@mui/icons-material/Info'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useMemo, useState } from 'react'

import { TableHead } from '@app/components/Table/TableHead'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'

import { useEligibleCourses } from '../../hooks/useEligibleCourses'
import { EligibleCourse } from '../../types'
import { useTransferParticipantContext } from '../TransferParticipantProvider'

export const ChooseTransferCourse: React.FC = () => {
  const { t, _t } = useScopedTranslation(
    'pages.transfer-participant.choose-course'
  )

  const { courseChoosen } = useTransferParticipantContext()

  const [choosenCourse, setChoosenCourse] = useState<EligibleCourse>()

  const { courses, fetching } = useEligibleCourses()

  const cols = useMemo(
    () => [
      { id: 'radio', label: '', sorting: false },
      { id: 'name', label: t('col-name'), sorting: false },
      { id: 'venue', label: t('col-venue'), sorting: false },
      { id: 'start-date', label: t('col-start-date'), sorting: false },
      {
        id: 'end-date',
        label: t('col-end-date'),
        sorting: false,
      },
    ],
    [t]
  )

  const handleCourseChoosen = () => {
    if (choosenCourse) {
      courseChoosen(choosenCourse)
    }
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('title')}
      </Typography>

      {!courses?.eligibleCourses.length && !fetching ? (
        <Alert severity="info" variant="outlined" icon={<Info />}>
          {t('no-courses')}
        </Alert>
      ) : null}

      {courses?.eligibleCourses?.length ? (
        <>
          <Table>
            <TableHead
              cols={cols}
              sx={{
                '.MuiTableRow-root': {
                  backgroundColor: 'grey.300',
                },
              }}
            />
            <TableBody>
              {courses.eligibleCourses.map((course, index) => (
                <TableRow key={course.id} data-index={index}>
                  <TableCell>
                    <Radio
                      checked={choosenCourse?.id === course.id}
                      onClick={() => setChoosenCourse(course)}
                      value={course.id}
                      inputProps={{ 'aria-label': String(course.id) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{course.level}</Typography>
                    <Typography color={theme.palette.dimGrey.main}>
                      {course.course_code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {course.schedule[0].venue ? (
                      <>
                        <Typography>
                          {course.schedule[0].venue?.name}
                        </Typography>
                        <Typography color={theme.palette.dimGrey.main}>
                          {course.schedule[0].venue?.city}
                        </Typography>
                      </>
                    ) : null}

                    {course.schedule[0].virtualLink ? (
                      <Typography color={theme.palette.dimGrey.main}>
                        {t('venue-virtual')}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {_t('dates.short', { date: course.schedule[0].start })}
                    </Typography>
                    <Typography color={theme.palette.dimGrey.main}>
                      {_t('dates.time', { date: course.schedule[0].start })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {_t('dates.short', { date: course.schedule[0].end })}
                    </Typography>
                    <Typography color={theme.palette.dimGrey.main}>
                      {_t('dates.time', { date: course.schedule[0].end })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={!choosenCourse}
              onClick={() => handleCourseChoosen()}
            >
              {t('next-btn-text')}
            </Button>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
