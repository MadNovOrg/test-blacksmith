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
import {
  TransferModeEnum,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'

export const ChooseTransferCourse: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t, _t } = useScopedTranslation('pages.transfer-participant')

  const { courseChosen, mode, cancel } = useTransferParticipantContext()

  const [chosenCourse, setChoosenCourse] = useState<EligibleCourse>()

  const { courses, fetching } = useEligibleCourses()

  const cols = useMemo(
    () => [
      { id: 'radio', label: '', sorting: false },
      { id: 'name', label: t('choose-course.col-name'), sorting: false },
      { id: 'venue', label: t('choose-course.col-venue'), sorting: false },
      {
        id: 'start-date',
        label: t('choose-course.col-start-date'),
        sorting: false,
      },
      {
        id: 'end-date',
        label: t('choose-course.col-end-date'),
        sorting: false,
      },
    ],
    [t]
  )

  const handleCourseChosen = () => {
    if (chosenCourse) {
      courseChosen(chosenCourse)
    }
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('choose-course.title')}
      </Typography>

      {!courses?.length && !fetching ? (
        <Alert severity="info" variant="outlined" icon={<Info />}>
          {t('choose-course.no-courses')}
        </Alert>
      ) : null}

      {courses?.length ? (
        <>
          <Table sx={{ background: 'white' }}>
            <TableHead cols={cols} />
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course?.id} data-index={index}>
                  <TableCell>
                    <Radio
                      checked={chosenCourse?.id === course?.id}
                      onClick={() => setChoosenCourse(course)}
                      value={course?.id}
                      inputProps={{ 'aria-label': String(course?.id) }}
                      data-testid={`change-course-${course?.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{course.courseCode}</Typography>
                  </TableCell>
                  <TableCell>
                    {course.venueName ? (
                      <Typography>{course.venueName}</Typography>
                    ) : null}

                    {course.venueCity ? (
                      <Typography color={theme.palette.dimGrey.main}>
                        {course.venueCity}
                      </Typography>
                    ) : null}

                    {course.virtualLink ? (
                      <Typography color={theme.palette.dimGrey.main}>
                        {t('choose-course.venue-virtual')}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {_t('dates.defaultShort', { date: course.startDate })}
                    </Typography>
                    <Typography color={theme.palette.dimGrey.main}>
                      {_t('dates.time', { date: course.startDate })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {_t('dates.defaultShort', { date: course.endDate })}
                    </Typography>
                    <Typography color={theme.palette.dimGrey.main}>
                      {_t('dates.time', { date: course.endDate })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Box>
              {mode !== TransferModeEnum.ADMIN_TRANSFERS ? (
                <Button onClick={cancel} sx={{ mr: 2 }}>
                  {t('cancel-btn-text')}
                </Button>
              ) : null}
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                disabled={!chosenCourse}
                onClick={() => handleCourseChosen()}
                data-testid="transfer-details"
              >
                {t(`choose-course.next-btn-text_${mode}`)}
              </Button>
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
