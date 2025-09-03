import { Table } from '@mui/material'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
import {
  Course_Audit_Type_Enum,
  GetCourseAuditLogsQuery,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'

import { TabsValues } from '../CourseExceptionsLogTabs'
import { TableBody } from '../TableBody'

type Props = {
  loading: boolean
  logs: GetCourseAuditLogsQuery['logs']
  sorting: Sorting
  activeTab: TabsValues
}

export const CourseExceptionsLogTable: FC<Props> = ({
  loading,
  logs,
  sorting,
  activeTab,
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
        id: 'exception-reason',
        label: t(
          'pages.admin.course-exceptions-log.table-cols.exception-reason',
        ),
        sorting: false,
      },
      {
        id: 'reason',
        label:
          activeTab === Course_Audit_Type_Enum.Approved
            ? t('pages.admin.course-exceptions-log.table-cols.approval-reason')
            : t(
                'pages.admin.course-exceptions-log.table-cols.rejection-reason',
              ),
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
    [t, activeTab],
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
