import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import {
  Course_Status_Enum,
  GetProfileDetailsQuery,
} from '@app/generated/graphql'
import { NonNullish } from '@app/types'

type Props = {
  profile: NonNullish<GetProfileDetailsQuery['profile']>
}

export const CourseAsTrainer: React.FC<React.PropsWithChildren<Props>> = ({
  profile,
}) => {
  const { t } = useTranslation()

  return (
    <Table sx={{ mt: 1 }}>
      <TableHead>
        <TableRow
          sx={{
            '&&.MuiTableRow-root': {
              backgroundColor: 'grey.300',
            },
            '&& .MuiTableCell-root': {
              py: 1,
              color: 'grey.700',
              fontWeight: '600',
            },
          }}
        >
          <TableCell>{t('course-name')}</TableCell>
          <TableCell>{t('date')}</TableCell>
          <TableCell>{t('training-level')}</TableCell>
          <TableCell>{t('course-status')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {profile.courseAsTrainer?.map(row => {
          return (
            <TableRow
              key={row.id}
              sx={{
                '&&.MuiTableRow-root': {
                  backgroundColor: 'common.white',
                },
              }}
            >
              <TableCell>
                <Link href={`/courses/${row.course.id}/details`}>
                  {row.course.course_code}
                </Link>
              </TableCell>
              <TableCell>
                {t('dates.defaultShort', {
                  date: row.course.dates.aggregate?.end?.date,
                })}
              </TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>
                <CourseStatusChip
                  status={row.course.status as Course_Status_Enum}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
