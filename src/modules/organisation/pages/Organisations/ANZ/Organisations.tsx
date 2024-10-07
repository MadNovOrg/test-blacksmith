import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Chip,
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
import { FilterByOrgResidingCountry } from '@app/components/filters/FilterByOrgResidingCountry'
import { FilterByOrgSector } from '@app/components/filters/FilterByOrgSector'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { useTableSort } from '@app/hooks/useTableSort'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout/FullHeightPageLayout'
import useOrgV2 from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import theme from '@app/theme'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

export const Organizations: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const navigate = useNavigate()
  const { acl, profile } = useAuth()
  const [showExportModal, setShowExportModal] = useState(false)
  const sorting = useTableSort('name', 'asc')

  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({})

  const handleToggle = (orgId: number) => {
    setOpenRows(prev => ({ ...prev, [orgId]: !prev[orgId] }))
  }
  const cols = useMemo(
    () => [
      {
        id: 'org-id',
      },
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
        label: t('pages.admin.organizations.columns.state-territory-region'),
      },
      {
        id: 'sector',
        label: t('pages.admin.organizations.columns.sector'),
        sorting: true,
      },
      {
        id: 'lastActivity',
        label: t('pages.admin.organizations.columns.last-activity'),
      },
      {
        id: 'createdAt',
        label: t('pages.admin.organizations.columns.created-on'),
        sorting: true,
      },
      {
        id: 'affiliatesCount',
        label: t('pages.admin.organizations.columns.affiliates-count'),
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
  const [filterOrgCountries, setFilterOrgCountries] = useState<string[]>([])

  const [where, filtered] = useMemo(() => {
    let isFiltered = false

    const obj: Record<string, object> = {}
    obj.main_organisation_id = { _is_null: true }
    if (filterSector.length) {
      obj.sector = { _in: filterSector }
      isFiltered = true
    }

    if (debouncedQuery.trim().length) {
      obj._or = [
        {
          name: { _ilike: `%${debouncedQuery}%` },
        },
        {
          affiliated_organisations: { name: { _ilike: `%${debouncedQuery}%` } },
        },
      ]

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

    if (filterOrgCountries?.length) {
      obj._or = filterOrgCountries.map(countryCode => ({
        address: { _contains: { countryCode: countryCode } },
      }))
    }

    return [obj, isFiltered]
  }, [acl, debouncedQuery, filterOrgCountries, filterSector, profile?.id])

  const affiliatedOrgWhere = useMemo(() => {
    const obj: Record<string, object> = {}
    if (debouncedQuery.trim().length) {
      obj._or = [
        {
          main_organisation: { name: { _ilike: `%${debouncedQuery.trim()}%` } },
        },
        { name: { _ilike: `%${debouncedQuery.trim()}%` } },
      ]
    }

    return obj
  }, [debouncedQuery])

  const { data, fetching } = useOrgV2({
    sorting,
    where,
    affiliatedOrgWhere,
    limit: perPage,
    offset: perPage * currentPage,
    withMembers: true,
    withAffiliatedOrganisations: true,
    withAffiliatedOrganisationsCount: true,
  })

  const count = data?.orgsCount.aggregate?.count
  const closeExportModal = useCallback(() => {
    setShowExportModal(false)
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

  const affiliatedOrgsLastActivityData = useMemo(() => {
    const lastActivity: { [key: string]: Date | undefined } = {}
    data?.orgs?.forEach(org => {
      org.affiliated_organisations?.forEach(affiliatedOrg => {
        lastActivity[affiliatedOrg.id] = maxBy(
          affiliatedOrg?.members,
          'profile.lastActivity',
        )?.profile.lastActivity
      })
    })
    return lastActivity
  }, [data?.orgs])

  const showRegionCol = useMemo(() => {
    const colRegion = cols.find(({ id }) => id === 'region')
    if (colRegion) {
      return {
        isEmpty:
          !data?.orgs.some(org => org?.address?.region) &&
          !data?.orgs.some(org =>
            org?.affiliated_organisations?.some(
              affiliatedOrg => affiliatedOrg?.address?.region,
            ),
          ),
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

  const allOrganisationsData = useMemo(
    () => [...(data?.orgs ?? [])],
    [data?.orgs],
  )

  const countryFilterCodes = useMemo(() => {
    const countries: string[] = []
    if (!acl.isOrgAdmin()) return countries

    allOrganisationsData.forEach(org => {
      if (
        org.address?.countryCode &&
        !countries.includes(org.address.countryCode)
      ) {
        countries.push(org.address.countryCode)
      }
    })

    return countries
  }, [acl, allOrganisationsData])

  const cellStyle = {
    maxWidth: '130px',
    minWidth: '130px',
    alignContent: 'center',
  }

  const cellSx = { textAlign: 'center' }

  const borderBottomStyle = {
    borderBottom: '0.031rem solid #c9c8c7',
  }

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
                  <FilterByOrgResidingCountry
                    countries={
                      acl.isOrgAdmin() ? countryFilterCodes : undefined
                    }
                    onChange={setFilterOrgCountries}
                  />
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
                  onClick={() => setShowExportModal(true)}
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
                sx={{ '.MuiTableCell-root': { textAlign: 'center' } }}
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
                  <>
                    <TableRow
                      key={org.id}
                      data-testid={`org-row-${org.id}`}
                      style={openRows[org.id] ? {} : borderBottomStyle}
                    >
                      <TableCell style={{ maxWidth: '50px' }}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggle(org.id)}
                          data-testid={`org-row-toggle-${org.id}`}
                        >
                          {openRows[org.id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell style={cellStyle} sx={cellSx}>
                        <Link href={`../${org?.id}`} variant="body2">
                          {org?.name}
                        </Link>
                      </TableCell>
                      <TableCell style={cellStyle} sx={cellSx}>
                        {org?.address.country}
                      </TableCell>
                      {!showRegionCol.isEmpty ? (
                        <TableCell style={cellStyle} sx={cellSx}>
                          {org?.address.region}
                        </TableCell>
                      ) : null}
                      <TableCell style={cellStyle} sx={cellSx}>
                        {t(`common.org-sectors.${org.sector}`)}
                      </TableCell>
                      <TableCell style={cellStyle} sx={cellSx}>
                        {lastActivityData[org?.id]
                          ? t('dates.withTime', {
                              date: lastActivityData[org?.id],
                            })
                          : t('indeterminate')}
                      </TableCell>
                      <TableCell style={cellStyle} sx={cellSx}>
                        {t('dates.withTime', {
                          date: org?.createdAt,
                        })}
                      </TableCell>
                      <TableCell
                        style={cellStyle}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: '7px',
                          textAlign: 'center',
                        }}
                      >
                        <Chip
                          label={t('pages.admin.organizations.affiliates', {
                            filteredCount: org.affiliated_organisations?.length,
                            totalCount:
                              org.affiliated_organisations_aggregate?.aggregate
                                ?.count,
                          })}
                          size="small"
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                    {openRows[org.id] ? (
                      <TableRow style={borderBottomStyle}>
                        <TableCell style={{ padding: 0 }} colSpan={8}>
                          <Collapse
                            in={openRows[org.id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box>
                              {org.affiliated_organisations_aggregate?.aggregate
                                ?.count ? (
                                <Table
                                  size="small"
                                  data-testid={`affiliated-orgs-table-${org.id}`}
                                >
                                  <TableBody>
                                    {org.affiliated_organisations?.map(
                                      affiliatedOrg => (
                                        <TableRow
                                          key={affiliatedOrg.id}
                                          data-testid={`affiliated-org-row-${affiliatedOrg?.id}`}
                                        >
                                          <TableCell
                                            style={{
                                              minWidth: '50px',
                                              maxWidth: '50px',
                                            }}
                                          />
                                          <TableCell
                                            style={cellStyle}
                                            sx={cellSx}
                                          >
                                            <Link
                                              href={`../${affiliatedOrg?.id}`}
                                              variant="body2"
                                            >
                                              {affiliatedOrg?.name}
                                            </Link>
                                          </TableCell>
                                          <TableCell
                                            style={cellStyle}
                                            sx={cellSx}
                                          >
                                            {affiliatedOrg?.address?.country}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              minWidth: '162px',
                                              maxWidth: '162px',
                                            }}
                                            sx={{ textAlign: 'center' }}
                                          >
                                            {affiliatedOrg?.address?.region}
                                          </TableCell>
                                          <TableCell
                                            style={cellStyle}
                                            sx={cellSx}
                                          >
                                            {t(
                                              `common.org-sectors.${affiliatedOrg?.sector}`,
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={cellStyle}
                                            sx={cellSx}
                                          >
                                            {affiliatedOrgsLastActivityData[
                                              org?.id
                                            ]
                                              ? t('dates.withTime', {
                                                  date: affiliatedOrgsLastActivityData[
                                                    org?.id
                                                  ],
                                                })
                                              : t('indeterminate')}
                                          </TableCell>
                                          <TableCell
                                            style={cellStyle}
                                            sx={cellSx}
                                          >
                                            {t('dates.withTime', {
                                              date: affiliatedOrg?.createdAt,
                                            })}
                                          </TableCell>
                                          <TableCell
                                            style={cellStyle}
                                            sx={cellSx}
                                          />
                                        </TableRow>
                                      ),
                                    )}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    height: '64px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    {t(
                                      'pages.admin.organizations.no-affiliated-organizations',
                                    )}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </>
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
