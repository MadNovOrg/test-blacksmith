import {
  Box,
  CircularProgress,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProfileWithAvatar } from '@app/components/ProfileWithAvatar'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { Course_Audit_Type_Enum } from '@app/generated/graphql'
import useCourseAuditLogs from '@app/hooks/useCourseAuditLogs'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import {
  AuditFilteringSidebar,
  FilterChangeEvent,
} from '@app/pages/admin/Audits/AuditFilteringSidebar'
import { ExportAuditsButton } from '@app/pages/admin/Audits/ExportAuditsButton'
import {
  CourseLogType,
  getCourseInvoice,
  getExportDataRenderFunction,
} from '@app/pages/admin/Audits/util'

export const CourseCancellationTable: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('created_at', 'desc')
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()
  const [query, setQuery] = useState<string>()

  const { logs, count, loading } = useCourseAuditLogs({
    type: Course_Audit_Type_Enum.Cancellation,
    filter: {
      from,
      to,
      query,
    },
    sort,
    offset,
    limit,
  })

  const cols = useMemo(
    () => [
      {
        id: 'created_at',
        label: t('pages.audits.event-time'),
        sorting: true,
        exportRender: (log: CourseLogType) =>
          t('dates.withTime', {
            date: log.created_at,
          }),
      },
      {
        id: 'course.course_code',
        label: t('pages.audits.course'),
        sorting: true,
        exportRender: (log: CourseLogType) => log.course.course_code ?? '',
      },
      {
        id: 'invoice_no',
        label: t('common.invoice-no'),
        sorting: false,
        exportRender: (log: CourseLogType) =>
          getCourseInvoice(log)?.xeroInvoiceNumber ?? '',
      },
      {
        id: 'authorizedBy.fullName',
        label: t('pages.audits.authorised-by'),
        sorting: true,
        exportRender: (log: CourseLogType) => log.authorizedBy.fullName ?? '',
      },
    ],
    [t]
  )

  const renderExportData = useMemo(
    () => getExportDataRenderFunction<CourseLogType>(cols, logs),
    [cols, logs]
  )

  const onFilterChange = useCallback((e: FilterChangeEvent) => {
    if (e.source === 'search') {
      setQuery(e.value)
    } else {
      setFrom(e.value[0])
      setTo(e.value[1])
    }
  }, [])

  return (
    <Box display="flex" gap={4}>
      <AuditFilteringSidebar count={count} onChange={onFilterChange} />

      <Box flex={1} sx={{ width: '100%', overflowX: 'auto' }}>
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="logs-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
              <ExportAuditsButton
                renderData={renderExportData}
                prefix={'course-cancellations-'}
              />
            </Box>
            <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table data-testid="logs-table">
                <TableHead
                  cols={cols}
                  orderBy={sort.by}
                  order={sort.dir}
                  onRequestSort={sort.onSort}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={cols.length}>
                        <Stack direction="row" alignItems="center">
                          <CircularProgress size={20} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : null}

                  <TableNoRows
                    noRecords={!loading && logs.length === 0}
                    filtered={false}
                    itemsName={t('common.records').toLowerCase()}
                    colSpan={cols.length}
                  />

                  {logs.map(log => {
                    const invoice = getCourseInvoice(log)
                    return (
                      <TableRow
                        key={log.id}
                        data-testid={`audit-log-entry-${log.id}`}
                      >
                        <TableCell>
                          {t('dates.withTime', {
                            date: log.created_at,
                          })}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/manage-courses/all/${log.course.id}/details`}
                          >
                            <Typography
                              data-testid="audit-log-entry-course-code"
                              variant="body2"
                            >
                              {log.course.course_code}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          {invoice ? (
                            <Link href={`/orders/${invoice.id}`}>
                              <Typography variant="body2">
                                {invoice.xeroInvoiceNumber}
                              </Typography>
                            </Link>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {log.authorizedBy ? (
                            <ProfileWithAvatar
                              profile={log.authorizedBy}
                              useLink={true}
                            />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
            <Pagination total={count} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
