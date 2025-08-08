import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { format } from 'date-fns'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'

import { BackButton } from '@app/components/BackButton'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useTableSort } from '@app/hooks/useTableSort'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

import { OrganisationsTabs } from '../../components/OrganisationsTabs/OrganisationsTabs'

import { useMergeOrgsLogs } from './hooks/useMergeOrgsLogs'

export const MergeOrganizationLogs = () => {
  const { t } = useTranslation()

  const [query, setQuery] = useQueryParam('query', withDefault(StringParam, ''))
  const sorting = useTableSort('name', 'asc')

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)

  const { fetching, logs, total } = useMergeOrgsLogs({
    limit: perPage,
    offset: currentPage * perPage,
    search: query,
  })

  const cols = useMemo(
    () => [
      {
        id: 'createdAt',
        label: t('pages.admin.organisations-merge-logs.created-at'),
        sorting: false,
      },
      {
        id: 'primaryOrg',
        label: t('pages.admin.organisations-merge-logs.primary-org'),
        sorting: false,
      },
      {
        id: 'mergedOrgsName',
        label: t('pages.admin.organisations-merge-logs.merged-orgs'),
      },
      {
        id: 'dfeUrn1',
        label: t('pages.admin.organisations-merge-logs.dfe-urn') + ' 1',
        sorting: false,
      },
      {
        id: 'mergedOrgsId',
        label: t('pages.admin.organisations-merge-logs.merged-orgs-id'),
        sorting: false,
      },
      {
        id: 'dfeUrn2',
        label: t('pages.admin.organisations-merge-logs.dfe-urn') + ' 2',
        sorting: false,
      },
      {
        id: 'actionedBy',
        label: t('pages.admin.organisations-merge-logs.actioned-by'),
        sorting: false,
      },
    ],
    [t],
  )

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  return (
    <FullHeightPageLayout>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BackButton
            label={t('pages.admin.back-to-settings')}
            to="/organisations/all"
          />

          <Typography variant="h1" py={2} fontWeight={600}>
            {t('pages.admin.organizations.title')}
          </Typography>
        </Container>
      </Box>

      <OrganisationsTabs activeTab={1} />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" gap={4}>
          <Box width={250}>
            <Typography variant="body2" color="grey.600">
              {total === undefined ? (
                <>&nbsp;</>
              ) : (
                t('x-items', { count: total })
              )}
            </Typography>

            <Stack mt={4}>
              <FilterSearch value={query} onChange={setQuery} />
            </Stack>
          </Box>

          <Box flex={1}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('pages.admin.organisations-merge-logs.info')}
            </Alert>

            <Table data-testid="orgs-table">
              <TableHead
                cols={cols}
                onRequestSort={sorting.onSort}
                order={sorting.dir}
                orderBy={sorting.by}
              />
              <TableBody>
                {fetching && (
                  <TableRow>
                    <TableCell colSpan={cols.length} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}

                <TableNoRows
                  colSpan={cols.length}
                  itemsName={t('pages.admin.organisations-merge-logs.logs')}
                  noRecords={!fetching && !total}
                />

                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.createdAt), 'd MMMM yyyy, h:mm a')}
                    </TableCell>
                    <TableCell>
                      {log.primaryOrganization?.id ? (
                        <Link
                          href={`/organisations/${log.primaryOrganization?.id}`}
                          sx={{ color: 'info.main' }}
                          underline="always"
                        >
                          {log.primaryOrganization?.name || ''}
                        </Link>
                      ) : (
                        log.primaryOrganizationName
                      )}
                    </TableCell>
                    <TableCell>
                      {log.mergedOrganizations
                        .map(o => o.organizationName)
                        .join('\n')}
                    </TableCell>
                    <TableCell>{log.primaryOrganizationUrn || ''}</TableCell>
                    <TableCell>
                      {log.mergedOrganizations.map(o => (
                        <React.Fragment key={o.id}>
                          <Tooltip placement="top" title={o.organizationName}>
                            {o.organizationId}
                          </Tooltip>
                          <br />
                        </React.Fragment>
                      ))}
                    </TableCell>
                    <TableCell>
                      {log.mergedOrganizations.map((o, idx) => (
                        <React.Fragment key={o.id}>
                          {o.dfeUrn}
                          {idx < log.mergedOrganizations.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/profile/${log.actionedById}`}
                        sx={{ color: 'info.main' }}
                        underline="always"
                      >
                        {log.actionedBy.fullName}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {total !== undefined ? (
              <TablePagination
                component="div"
                count={total}
                onPageChange={(_, page) => setCurrentPage(page)}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={currentPage}
                rowsPerPage={perPage}
                rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
              />
            ) : null}
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
