import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material'
import { t } from 'i18next'
import { FC, PropsWithChildren } from 'react'

import {
  Course_Status_Enum,
  GetProfileDetailsQuery,
} from '@app/generated/graphql'

type CoursesTableProps = {
  profile: GetProfileDetailsQuery['profile']
}

export const CoursesTable: FC<PropsWithChildren<CoursesTableProps>> = ({
  profile,
}) => {
  const tableHeadCells = [t('course-name'), t('action'), t('date')]
  return (
    <Table data-testid="course-as-attendee" sx={{ mt: 1 }}>
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
          {tableHeadCells.map(cell => (
            <TableCell key={cell}>{cell}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {profile?.participantAudits?.map(row => {
          return (
            <TableRow
              key={row.id}
              sx={{
                '&&.MuiTableRow-root': {
                  backgroundColor: 'common.white',
                },
              }}
              data-testid={`course-row-${row.course_id}`}
            >
              <TableCell data-testid="course-name">
                <Link href={`/courses/${row.course_id}/details`}>
                  {row.course.name}
                </Link>
              </TableCell>
              <TableCell data-testid="course-action">
                {t(`participant-audit-types.${row.type}`)}
              </TableCell>
              <TableCell data-testid="course-date">
                {t('dates.defaultShort', {
                  date: row.course.dates.aggregate?.end?.date,
                })}
              </TableCell>
            </TableRow>
          )
        })}
        {profile?.courses.map(row => {
          if (row.course.status !== Course_Status_Enum.Cancelled) return

          return (
            <TableRow
              key={row.id}
              sx={{
                '&&.MuiTableRow-root': {
                  backgroundColor: 'common.white',
                },
              }}
            >
              <TableCell>{row.course.name}</TableCell>
              <TableCell>{t(`course-statuses.${row.course.status}`)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          )
        })}

        {(profile?.participantAudits?.length ?? 0) +
          (profile?.courses.length || 0) <
        1 ? (
          <TableRow
            sx={{
              '&&.MuiTableRow-root': {
                backgroundColor: 'common.white',
              },
            }}
          >
            <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
              {t('pages.my-profile.no-course-history')}
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
