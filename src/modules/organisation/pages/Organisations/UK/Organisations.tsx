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
  Checkbox,
} from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { maxBy } from 'lodash-es'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout/FullHeightPageLayout'
import { MergeOrganisations } from '@app/modules/organisation/components/MergeOrganisations'
import { OrganisationsTabs } from '@app/modules/organisation/components/OrganisationsTabs/OrganisationsTabs'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
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
  const location = useLocation()
  const { acl, profile } = useAuth()
  const [showExportModal, setShowExportModal] = useState(false)
  const sorting = useTableSort('name', 'asc')
  const merging = location.pathname.includes('/merge')
  const [organisationsForMerging, setOrganisationsForMerging] = useState<
    GetOrganisationDetailsQuery['orgs'][0][]
  >([])

  const cols = useMemo(
    () => [
      ...(merging
        ? [
            {
              id: 'merge',
              label: '',
              sorting: false,
            },
          ]
        : []),
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
    [merging, t],
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

    if (filterOrgCountries?.length) {
      obj._or = filterOrgCountries.map(countryCode => ({
        address: { _contains: { countryCode: countryCode } },
      }))
    }

    return [obj, isFiltered]
  }, [acl, debouncedQuery, filterOrgCountries, filterSector, profile?.id])

  const { data, fetching } = useOrgV2({
    sorting,
    where,
    limit: perPage,
    offset: perPage * currentPage,
    withMembers: true,
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

  const showRegionCol = useMemo(() => {
    const colRegion = cols.find(({ id }) => id === 'region')
    if (colRegion) {
      return {
        isEmpty: !data?.orgs.some(org => org?.address.region),
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

    if (!merging) return cols.filter(col => col.id !== 'merge')

    return cols
  }, [cols, showRegionCol, merging])

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

  useEffect(() => {
    if (merging) {
      setOrganisationsForMerging([])
    }
  }, [merging])

  return (
    <FullHeightPageLayout>
      <Helmet>
        <title>{t('pages.browser-tab-titles.organisations.title')}</title>
      </Helmet>
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

      <OrganisationsTabs activeTab={0} />

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
              gap={2}
            >
              {acl.isAdmin() && !merging ? (
                <Button
                  variant="contained"
                  data-testid="export-blended-learning-licence-summary"
                  onClick={() => setShowExportModal(true)}
                >
                  {t('pages.admin.organizations.export.blended-learning')}
                </Button>
              ) : null}

              {acl.canCreateOrgs() && !merging ? (
                <Button
                  variant="contained"
                  data-testid="add-new-org-button"
                  onClick={() => navigate('/organisations/new')}
                >
                  {t('pages.admin.organizations.add-new-organization')}
                </Button>
              ) : null}
              <MergeOrganisations selectedOrgs={organisationsForMerging} />
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
                    {merging && (
                      <TableCell>
                        <Checkbox
                          value={org}
                          onClick={() => {
                            if (
                              organisationsForMerging.some(
                                organisationForMerging =>
                                  organisationForMerging.id === org.id,
                              )
                            ) {
                              setOrganisationsForMerging(
                                organisationsForMerging.filter(
                                  mergingOrganisation =>
                                    mergingOrganisation.id !== org.id,
                                ),
                              )
                            } else {
                              setOrganisationsForMerging(prev => [...prev, org])
                            }
                          }}
                          checked={organisationsForMerging.some(
                            organisationForMerging =>
                              organisationForMerging.id === org.id,
                          )}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Link href={`../${org?.id}`} variant="body2">
                        {org?.name}
                      </Link>
                    </TableCell>
                    <TableCell>{org?.address.country}</TableCell>
                    {!showRegionCol.isEmpty ? (
                      <TableCell>{org?.address.region}</TableCell>
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
