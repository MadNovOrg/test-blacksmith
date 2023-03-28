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
import { Course_Participant_Audit_Type_Enum } from '@app/generated/graphql'
import useAttendeeAuditLogs from '@app/hooks/useAttendeeAuditLogs'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import {
  AuditFilteringSidebar,
  FilterChangeEvent,
} from '@app/pages/admin/Audits/AuditFilteringSidebar'
import { ExportAuditsButton } from '@app/pages/admin/Audits/ExportAuditsButton'
import {
  AttendeeLogType,
  getAttendeeInvoice,
  getExportDataRenderFunction,
} from '@app/pages/admin/Audits/util'

export const AttendeeTransferTable: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('created_at', 'desc')
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()
  const [query, setQuery] = useState<string>()

  const { logs, count, loading } = useAttendeeAuditLogs({
    type: Course_Participant_Audit_Type_Enum.Transfer,
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
        exportRender: (log: AttendeeLogType) =>
          t('dates.withTime', {
            date: log.created_at,
          }),
      },
      {
        id: 'fromCourse.course_code',
        label: t('pages.audits.original-course'),
        sorting: true,
        exportRender: (log: AttendeeLogType) =>
          log.fromCourse ? log.payload.fromCourse.courseCode ?? '' : '',
      },
      {
        id: 'toCourse.course_code',
        label: t('pages.audits.new-course'),
        sorting: true,
        exportRender: (log: AttendeeLogType) =>
          log.toCourse ? log.payload.toCourse.courseCode ?? '' : '',
      },
      {
        id: 'profile.fullName',
        label: t('common.attendee'),
        sorting: true,
        exportRender: (log: AttendeeLogType) => log.profile.fullName ?? '',
      },
      {
        id: 'profile.email',
        label: t('common.email'),
        sorting: true,
        exportRender: (log: AttendeeLogType) => log.profile.email ?? '',
      },
      {
        id: 'organization',
        label: t('common.organization'),
        sorting: false,
        exportRender: (log: AttendeeLogType) =>
          log.profile.organizations.reduce(
            (acc, orgMember) => `${acc}, ${orgMember.organization.name}`,
            ''
          ),
      },
      {
        id: 'invoice_no',
        label: t('common.invoice-no'),
        sorting: false,
        exportRender: (log: AttendeeLogType) =>
          getAttendeeInvoice(log)?.xeroInvoiceNumber ?? '',
      },
      {
        id: 'authorizedBy.fullName',
        label: t('pages.audits.authorised-by'),
        sorting: true,
        exportRender: (log: AttendeeLogType) => log.authorizedBy.fullName ?? '',
      },
    ],
    [t]
  )

  const renderExportData = useMemo(
    () => getExportDataRenderFunction<AttendeeLogType>(cols, logs),
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
          <>
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
              <ExportAuditsButton
                renderData={renderExportData}
                prefix={'attendee-transfers-'}
              />
            </Box>
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
                  const invoice = getAttendeeInvoice(log)
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
                          href={`/manage-courses/all/${log.payload.fromCourse.id}/details`}
                        >
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {log.payload.fromCourse.courseCode ?? ''}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/manage-courses/all/${log.payload.toCourse.id}/details`}
                        >
                          <Typography variant="body2">
                            {log.payload.toCourse.courseCode ?? ''}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {log.profile ? (
                          <ProfileWithAvatar
                            profile={log.profile}
                            useLink={true}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.profile.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={1}>
                          {log.profile.organizations.map(orgMember => (
                            <Link
                              key={orgMember.organization.id}
                              href={`/organisations/${orgMember.organization.id}`}
                            >
                              {orgMember.organization.name}
                            </Link>
                          ))}
                        </Box>
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

            <Pagination total={count} />
          </>
        )}
      </Box>
    </Box>
  )
}
