import {
  Box,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
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

export const AttendeeCancellationTable: React.FC = () => {
  const { t } = useTranslation()
  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('created_at', 'desc')
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()
  const [query, setQuery] = useState<string>()

  const { logs, count, loading } = useAttendeeAuditLogs({
    type: Course_Participant_Audit_Type_Enum.Cancellation,
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
      { id: 'created_at', label: t('pages.audits.event-time'), sorting: true },
      {
        id: 'profile.fullName',
        label: t('common.attendee'),
        sorting: true,
      },
      {
        id: 'profile.email',
        label: t('pages.audits.attendee-email'),
        sorting: true,
      },
      { id: 'course.course_code', label: t('common.course'), sorting: true },
      {
        id: 'authorizedBy.fullName',
        label: t('pages.audits.authorised-by'),
        sorting: true,
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
                        <ProfileWithAvatar profile={log.profile} />
                      ) : null}
                    </TableCell>
                    <TableCell>{log.profile.email}</TableCell>
                    <TableCell>{log.course.course_code}</TableCell>
                    <TableCell>
                      {log.authorizedBy ? (
                        <ProfileWithAvatar profile={log.authorizedBy} />
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
