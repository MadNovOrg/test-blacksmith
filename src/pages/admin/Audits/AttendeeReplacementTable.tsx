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
import {
  Course_Participant_Audit_Type_Enum,
  GetAttendeeAuditLogsQuery,
} from '@app/generated/graphql'
import useAttendeeAuditLogs from '@app/hooks/useAttendeeAuditLogs'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import {
  AuditFilteringSidebar,
  FilterChangeEvent,
} from '@app/pages/admin/Audits/AuditFilteringSidebar'
import { ExportAuditsButton } from '@app/pages/admin/Audits/ExportAuditsButton'
import { getExportDataRenderFunction } from '@app/pages/admin/Audits/util'

type LogType = GetAttendeeAuditLogsQuery['logs'][0]

export const AttendeeReplacementTable: React.FC = () => {
  const { t } = useTranslation()
  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('created_at', 'desc')
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()
  const [query, setQuery] = useState<string>()

  const { logs, count, loading } = useAttendeeAuditLogs({
    type: Course_Participant_Audit_Type_Enum.Replacement,
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
        exportRender: (log: LogType) =>
          t('dates.withTime', {
            date: log.created_at,
          }),
      },
      {
        id: 'profile.fullName',
        label: t('pages.audits.original-attendee'),
        sorting: true,
        exportRender: (log: LogType) => log.profile.fullName ?? '',
      },
      {
        id: 'profile.email',
        label: t('common.email'),
        sorting: true,
        exportRender: (log: LogType) => log.profile.email ?? '',
      },
      {
        id: 'newAttendeeEmail',
        label: t('pages.audits.new-attendee'),
        sorting: true,
        exportRender: (log: LogType) =>
          `${log.payload?.inviteeFirstName} ${log.payload?.inviteeLastName} \n${log.newAttendeeEmail}` ??
          '',
      },
      {
        id: 'course.course_code',
        label: t('common.course'),
        sorting: true,
        exportRender: (log: LogType) => log.course.course_code ?? '',
      },
      {
        id: 'authorizedBy.fullName',
        label: t('pages.audits.authorised-by'),
        sorting: true,
        exportRender: (log: LogType) => log.authorizedBy.fullName ?? '',
      },
    ],
    [t]
  )

  const renderExportData = useMemo(
    () => getExportDataRenderFunction<LogType>(cols, logs),
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
                prefix={'attendee-replacements-'}
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

                {logs.map(log => (
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
                      {log.profile ? (
                        <ProfileWithAvatar
                          profile={log.profile}
                          typographySx={{
                            textDecoration: 'line-through',
                          }}
                          useLink={true}
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {log.profile.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {log.payload?.inviteeFirstName &&
                      log.payload?.inviteeLastName ? (
                        <Typography>
                          {log.payload?.inviteeFirstName}{' '}
                          {log.payload?.inviteeLastName}
                        </Typography>
                      ) : null}
                      <Typography
                        variant={
                          log.payload?.inviteeFirstName &&
                          log.payload?.inviteeLastName
                            ? 'body2'
                            : 'body1'
                        }
                      >
                        {log.newAttendeeEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/manage-courses/all/${log.course.id}/details`}
                      >
                        {log.course.course_code}
                      </Link>
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
                ))}
              </TableBody>
            </Table>

            <Pagination total={count} />
          </>
        )}
      </Box>
    </Box>
  )
}
