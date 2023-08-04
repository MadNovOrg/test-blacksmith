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

export const CourseReschedulingTable: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('created_at', 'desc')
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()
  const [query, setQuery] = useState<string>()

  const { logs, count, loading } = useCourseAuditLogs({
    type: Course_Audit_Type_Enum.Reschedule,
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
        id: 'course.old_start_date',
        label: t('pages.audits.old-start-date'),
        sorting: false,
        exportRender: (log: CourseLogType) =>
          new Date(log.payload?.oldStartDate).toString(),
      },
      {
        id: 'course.new_start_date',
        label: t('pages.audits.new-start-date'),
        sorting: false,
        exportRender: (log: CourseLogType) =>
          new Date(log.payload?.newStartDate).toString(),
      },
      {
        id: 'course.old_end_date',
        label: t('pages.audits.old-end-date'),
        sorting: false,
        exportRender: (log: CourseLogType) =>
          new Date(log.payload?.oldEndDate).toString(),
      },
      {
        id: 'course.new_end_date',
        label: t('pages.audits.new-end-date'),
        sorting: false,
        exportRender: (log: CourseLogType) =>
          new Date(log.payload?.newEndDate).toString(),
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

  const onFilterChange = useCallback((e: FilterChangeEvent) => {
    if (e.source === 'search') {
      setQuery(e.value)
    } else {
      setFrom(e.value[0])
      setTo(e.value[1])
    }
  }, [])

  const renderExportData = useMemo(
    () => getExportDataRenderFunction<CourseLogType>(cols, logs),
    [cols, logs]
  )

  return (
    <Box display="flex" gap={4}>
      <AuditFilteringSidebar count={count} onChange={onFilterChange} />

      <Box flex={1}>
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
                prefix={'course-rescheduling-'}
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
                            <Typography variant="body2">
                              {log.course.course_code}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell
                          sx={{
                            textDecoration: 'line-through',
                            color: 'dimGrey.main',
                          }}
                        >
                          {t('dates.defaultShort', {
                            date: new Date(log.payload?.oldStartDate),
                          })}
                        </TableCell>
                        <TableCell>
                          {t('dates.defaultShort', {
                            date: new Date(log.payload?.newStartDate),
                          })}
                        </TableCell>
                        <TableCell
                          sx={{
                            textDecoration: 'line-through',
                            color: 'dimGrey.main',
                          }}
                        >
                          {t('dates.defaultShort', {
                            date: new Date(log.payload?.oldEndDate),
                          })}
                        </TableCell>
                        <TableCell>
                          {t('dates.defaultShort', {
                            date: new Date(log.payload?.newEndDate),
                          })}
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
