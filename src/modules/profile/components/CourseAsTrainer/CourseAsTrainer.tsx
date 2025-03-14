import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { GetProfileDetailsQuery } from '@app/generated/graphql'
import { NonNullish } from '@app/types'
import { PROFILE_TABLE_SX } from '@app/util'

import { useSortedCourseAsTrainerData } from '../../hooks/useSortedCourseAsTrainerData'
import { CourseTrainerRow } from '../CourseTrainerRow'

type Props = {
  profile: NonNullish<GetProfileDetailsQuery['profile']>
}

export const CourseAsTrainer: React.FC<React.PropsWithChildren<Props>> = ({
  profile,
}) => {
  const { sortOrder, handleSortToggle, sortedCourses } =
    useSortedCourseAsTrainerData({ profile })
  const { t } = useTranslation()

  return (
    <Table sx={{ mt: 1 }}>
      <TableHead>
        <TableRow sx={PROFILE_TABLE_SX}>
          <TableCell>{t('course-name')}</TableCell>
          <TableCell>{t('training-level')}</TableCell>
          <TableCell>{t('course-status')}</TableCell>
          <TableCell>
            <TableSortLabel
              active
              direction={sortOrder}
              onClick={handleSortToggle}
            >
              {t('date')}
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedCourses.map(row => (
          <CourseTrainerRow
            key={row.id}
            courseCode={row.course.course_code ?? ''}
            courseId={row.course_id}
            courseStartDate={row.course.dates.aggregate?.start?.date ?? ''}
            courseStatus={row.course.status}
            trainingLevel={row.type ?? ''}
          />
        ))}
      </TableBody>
    </Table>
  )
}
