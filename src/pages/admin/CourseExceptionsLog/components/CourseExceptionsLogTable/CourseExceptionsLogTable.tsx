import { Table } from '@mui/material'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
import { GetCourseAuditLogsQuery } from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'

import { TableBody } from './TableBody'

type Props = {
  loading: boolean
  logs: GetCourseAuditLogsQuery['logs']
  sorting: Sorting
}

export const CourseExceptionsLogTable: FC<Props> = ({
  loading,
  logs,
  sorting,
}) => {
  const { t } = useTranslation()

  const cols = useMemo(
    () => [
      {
        id: 'course.createdAt',
        label: t('pages.admin.course-exceptions-log.table-cols.event-time'),
        sorting: true,
      },
      {
        id: 'trainer_name',
        label: t('pages.admin.course-exceptions-log.table-cols.trainer'),
        sorting: false,
      },
      {
        id: 'organisation_name',
        label: t('pages.admin.course-exceptions-log.table-cols.organisation'),
        sorting: false,
      },
      {
        id: 'course.course_code',
        label: t('pages.admin.course-exceptions-log.table-cols.course-code'),
        sorting: true,
      },
      {
        id: 'reason',
        label: t('pages.admin.course-exceptions-log.table-cols.reason'),
        sorting: false,
      },
      {
        id: 'authorizedBy.fullName',
        label: t('pages.admin.course-exceptions-log.table-cols.authorised-by'),
        sorting: true,
      },
      {
        id: 'created_at',
        label: t('pages.admin.course-exceptions-log.table-cols.authorised-at'),
        sorting: true,
      },
    ],
    [t],
  )

  return (
    <Table
      data-testid="course-exceptions-log-table"
      sx={{ minWidth: { xs: '100%', md: '700px' } }}
    >
      <TableHead
        onRequestSort={sorting.onSort}
        orderBy={sorting.by}
        order={sorting.dir}
        cols={cols}
      />
      <TableBody colSpan={cols.length} logs={logs} loading={loading} />
    </Table>
  )
}
