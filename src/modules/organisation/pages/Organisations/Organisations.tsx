import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { maxBy } from 'lodash-es'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import {
  ArrayParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { BackButton } from '@app/components/BackButton'
import { ExportBlendedDialog } from '@app/components/dialogs'
import { FilterByOrgSector } from '@app/components/filters/FilterByOrgSector'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { useTableSort } from '@app/hooks/useTableSort'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout/FullHeightPageLayout'
import theme from '@app/theme'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

import useOrgV2 from '../../hooks/useOrgV2'

type OrganizationsProps = unknown

export const Organizations: React.FC<
  React.PropsWithChildren<OrganizationsProps>
> = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const navigate = useNavigate()
  const { acl, profile } = useAuth()
  const [showExportModal, setExportShowModal] = useState(false)
  const sorting = useTableSort('name', 'asc')
  const cols = useMemo(
    () => [
      {
        id: 'name',
        label: t('pages.admin.organizations.columns.name'),
        sorting: true,
      },
      {
        id: 'country',
        label: t('pages.admin.organizations.columns.country'),
      },
      {
        id: 'region',
        label: t('pages.admin.organizations.columns.region'),
        sorting: true,
      },
      {
        id: 'sector',
        label: t('pages.admin.organizations.columns.sector'),
        sorting: true,
      },
      {
        id: 'lastActivity',
        label: t('pages.admin.organizations.columns.last-activity'),
        sorting: true,
      },
      {
        id: 'createdAt',
        label: t('pages.admin.organizations.columns.created-on'),
        sorting: true,
      },
    ],
    [t],
  )
  const [query, setQuery] = useQueryParam('query', withDefault(StringParam, ''))
  const [debouncedQuery] = useDebounce(query, 300)
  const [filterSector, setFilterSector] = useQueryParam(
    'sectors',
    withDefault(ArrayParam, []),
  )

  const [where, filtered] = useMemo(() => {
    let isFiltered = false

    const obj: Record<string, object> = {}

    if (filterSector.length) {
      obj.sector = { _in: filterSector }
      isFiltered = true
    }

    if (debouncedQuery.trim().length) {
      obj.name = { _ilike: `%${debouncedQuery}%` }
      isFiltered = true
    }

    if (!acl.canViewAllOrganizations()) {
      obj.members = {
        _and: [
          {
            profile_id: {
              _eq: profile?.id,
            },
          },
          { isAdmin: { _eq: true } },
        ],
      }
    }

    return [obj, isFiltered]
  }, [acl, debouncedQuery, filterSector, profile?.id])

  const { data, fetching } = useOrgV2({
    sorting,
    where,
    limit: perPage,
    offset: perPage * currentPage,
    withMembers: true,
  })

  const count = data?.orgsCount.aggregate?.count
  const closeExportModal = useCallback(() => {
    setExportShowModal(false)
  }, [])

  const lastActivityData = useMemo(() => {
    const lastActivity: { [key: string]: Date | undefined } = {}
    data?.orgs?.forEach(org => {
      lastActivity[org.id] = maxBy(
        org.members,
        'profile.lastActivity',
      )?.profile.lastActivity
    })
    return lastActivity
  }, [data?.orgs])

  const showRegionCol = useMemo(() => {
    const colRegion = cols.find(({ id }) => id === 'region')
    if (colRegion) {
      return {
        isEmpty: !data?.orgs.some(org => org?.region),
        id: colRegion.id,
      }
    }

    return {
      isEmpty: false,
    }
  }, [cols, data?.orgs])

  const filterCols = useMemo(() => {
    const { isEmpty: isEmptyRegionCol, id: gerionColId } = showRegionCol

    if (isEmptyRegionCol) {
      return cols.filter(col => col.id != gerionColId)
    }

    return cols
  }, [cols, showRegionCol])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  const allOrganisationsData = [...(data?.orgs ?? [])]

  return (
    <FullHeightPageLayout>
      <Helmet>
        <title>{t('pages.browser-tab-titles.organisations.title')}</title>
      </Helmet>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BackButton label={t('pages.admin.back-to-settings')} />

          <Typography variant="h1" py={2} fontWeight={600}>
            {t('pages.admin.organizations.title')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" gap={4}>
          <Box width={250}>
            <Typography variant="body2" color="grey.600">
              {fetching ? <>&nbsp;</> : t('x-items', { count })}
            </Typography>

            <Stack gap={4} mt={4}>
              <FilterSearch value={query} onChange={setQuery} />

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {t('filter-by')}
                </Typography>

                <Stack gap={1}>
                  <FilterByOrgSector onChange={setFilterSector} />
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box flex={1}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              mb={2}
            >
              {acl.isTTAdmin() ? (
                <Button
                  variant="contained"
                  data-testid="export-blended-learning-licence-summary"
                  onClick={() => setExportShowModal(true)}
                  sx={{ marginRight: '1em' }}
                >
                  {t('pages.admin.organizations.export.blended-learning')}
                </Button>
              ) : null}

              {acl.canCreateOrgs() ? (
                <Button
                  variant="contained"
                  data-testid="add-new-org-button"
                  onClick={() => navigate('/organisations/new')}
                >
                  {t('pages.admin.organizations.add-new-organization')}
                </Button>
              ) : null}
            </Box>
            <ExportBlendedDialog
              isOpen={showExportModal}
              closeModal={closeExportModal}
            />

            <Table data-testid="orgs-table">
              <TableHead
                cols={filterCols}
                order={sorting.dir}
                orderBy={sorting.by}
                onRequestSort={sorting.onSort}
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
                  noRecords={!fetching && !count}
                  filtered={filtered}
                  colSpan={cols.length}
                  itemsName={t('organizations').toLowerCase()}
                />

                {allOrganisationsData.map(org => (
                  <TableRow key={org.id} data-testid={`org-row-${org.id}`}>
                    <TableCell>
                      <Link href={`../${org?.id}`} variant="body2">
                        {org?.name}
                      </Link>
                    </TableCell>
                    <TableCell>{org?.address.country}</TableCell>
                    {!showRegionCol.isEmpty ? (
                      <TableCell>{org?.region}</TableCell>
                    ) : null}
                    <TableCell>
                      {t(`common.org-sectors.${org.sector}`)}
                    </TableCell>
                    <TableCell>
                      {lastActivityData[org?.id]
                        ? t('dates.withTime', {
                            date: lastActivityData[org?.id],
                          })
                        : t('indeterminate')}
                    </TableCell>
                    <TableCell>
                      {t('dates.withTime', {
                        date: org?.createdAt,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {count ? (
              <TablePagination
                component="div"
                count={count}
                page={currentPage}
                onPageChange={(_, page) => setCurrentPage(page)}
                onRowsPerPageChange={handleRowsPerPageChange}
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

export default Organizations
