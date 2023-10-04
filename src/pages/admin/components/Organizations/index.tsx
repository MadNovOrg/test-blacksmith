import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { maxBy } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
import { useOrganizations } from '@app/hooks/useOrganizations'
import { useTableSort } from '@app/hooks/useTableSort'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout/FullHeightPageLayout'
import theme from '@app/theme'

type OrganizationsProps = unknown

export const Organizations: React.FC<
  React.PropsWithChildren<OrganizationsProps>
> = () => {
  const { t } = useTranslation()
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
        id: 'trustName',
        label: t('pages.admin.organizations.columns.group'),
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
    [t]
  )
  const [query, setQuery] = useQueryParam('query', withDefault(StringParam, ''))
  const [filterSector, setFilterSector] = useQueryParam(
    'sectors',
    withDefault(ArrayParam, [])
  )

  const [where, filtered] = useMemo(() => {
    let isFiltered = false

    const obj: Record<string, object> = {}

    if (filterSector.length) {
      obj.sector = { _in: filterSector }
      isFiltered = true
    }

    if (query.trim().length) {
      obj.name = { _ilike: `%${query}%` }
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
  }, [acl, filterSector, profile, query])

  const { orgs, loading } = useOrganizations(sorting, where)

  const count = orgs?.length
  const closeExportModal = useCallback(() => {
    setExportShowModal(false)
  }, [])

  const lastActivityData = useMemo(() => {
    const data: { [key: string]: Date | undefined } = {}
    orgs.forEach(org => {
      data[org.id] = maxBy(
        org.members,
        'profile.lastActivity'
      )?.profile.lastActivity
    })
    return data
  }, [orgs])

  return (
    <FullHeightPageLayout>
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
              {loading ? <>&nbsp;</> : t('x-items', { count })}
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
                cols={cols}
                order={sorting.dir}
                orderBy={sorting.by}
                onRequestSort={sorting.onSort}
              />
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={cols.length} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}

                <TableNoRows
                  noRecords={!loading && !count}
                  filtered={filtered}
                  colSpan={cols.length}
                  itemsName={t('organizations').toLowerCase()}
                />

                {orgs.map(org => (
                  <TableRow key={org.id} data-testid={`org-row-${org.id}`}>
                    <TableCell>
                      <Link href={`../${org?.id}`} variant="body2">
                        {org?.name}
                      </Link>
                    </TableCell>
                    <TableCell>{org?.address.country}</TableCell>
                    <TableCell>{org?.region}</TableCell>
                    <TableCell>{org?.sector}</TableCell>
                    <TableCell>
                      {lastActivityData[org?.id]
                        ? t('dates.withTime', {
                            date: lastActivityData[org?.id],
                          })
                        : ''}
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
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}

export default Organizations
