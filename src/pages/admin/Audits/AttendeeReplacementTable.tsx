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
import { useQuery } from 'urql'

import { ProfileWithAvatar } from '@app/components/ProfileWithAvatar'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import {
  Course_Participant_Audit_Type_Enum,
  GetUserByMailQuery,
  GetUserByMailQueryVariables,
} from '@app/generated/graphql'
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
import { GET_USER_BY_EMAIL } from '@app/queries/user-queries/get-user-by-email'

export const AttendeeReplacementTable: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
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

  const emails = logs.map(log => log.newAttendeeEmail ?? '').filter(e => e)

  const [{ data: profiles }] = useQuery<
    GetUserByMailQuery,
    GetUserByMailQueryVariables
  >({ query: GET_USER_BY_EMAIL, variables: { email: emails } })

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
        id: 'profile.fullName',
        label: t('pages.audits.original-attendee'),
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
        id: 'newAttendee',
        label: t('pages.audits.new-attendee'),
        sorting: false,
        exportRender: (log: AttendeeLogType) =>
          `${log.payload?.inviteeFirstName} ${log.payload?.inviteeLastName}` ??
          '',
      },
      {
        id: 'newAttendeeEmail',
        label: t('common.email'),
        sorting: true,
        exportRender: (log: AttendeeLogType) => log.newAttendeeEmail ?? '',
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
        id: 'course.course_code',
        label: t('common.course'),
        sorting: true,
        exportRender: (log: AttendeeLogType) => log.course.course_code ?? '',
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
                prefix={'attendee-replacements-'}
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
                    const participant = profiles?.profile.find(
                      el => el.email === log.newAttendeeEmail
                    )
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
                            <>
                              {participant?.id ? (
                                <Link
                                  key={participant?.id}
                                  href={`/profile/${participant?.id}`}
                                >
                                  <Typography>
                                    {log.payload?.inviteeFirstName}{' '}
                                    {log.payload?.inviteeLastName}
                                  </Typography>
                                </Link>
                              ) : (
                                <Typography>
                                  {log.payload?.inviteeFirstName}{' '}
                                  {log.payload?.inviteeLastName}
                                </Typography>
                              )}
                            </>
                          ) : null}
                        </TableCell>
                        <TableCell>
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
                          <Link
                            href={`/manage-courses/all/${log.course.id}/details`}
                          >
                            {log.course.course_code}
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
