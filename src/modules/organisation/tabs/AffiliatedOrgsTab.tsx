import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { Organization } from '@app/generated/graphql'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

import useAffiliatedOrganisations from '../hooks/useAffiliatedOrganisations'
import useOrgV2 from '../hooks/useOrgV2'
import { useUnlinkAffiliatedOrganisation } from '../hooks/useUnlinkAffiliatedOrganisation'

import { ManageAffiliatedOrgsMenu } from './components/ManageAffiliatedOrgsMenu'

type AffiliatedOrgsTabParams = {
  orgId: string
}

export const AffiliatedOrgsTab: React.FC<
  React.PropsWithChildren<AffiliatedOrgsTabParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)

  const navigate = useNavigate()

  const { data, fetching, error } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    withMainOrganisation: true,
    withAffiliatedOrganisationsCount: true,
  })

  const { data: affiliatedOrgs } = useAffiliatedOrganisations(
    orgId,
    perPage,
    currentPage * perPage,
  )

  const org = data?.orgs.length ? data.orgs[0] : null

  const count = org?.affiliated_organisations_aggregate?.aggregate?.count
  const [, unlinkAffiliatedOrganisation] = useUnlinkAffiliatedOrganisation()

  const cols = useMemo(() => {
    const _t = (col: string) =>
      t(`pages.org-details.tabs.affiliated-orgs.cols-${col}`)

    const madatoryCols = [
      {
        id: 'name',
        label: _t('name'),
      },
      {
        id: 'country',
        label: _t('country'),
      },
      {
        id: 'region',
        label: _t('region-state-territory'),
      },
      {
        id: 'sector',
        label: _t('sector'),
      },
      {
        id: 'lastActivity',
        label: _t('last-activity'),
      },
      {
        id: 'createdAt',
        label: _t('created-on'),
      },
    ]

    const actionCols = [
      {
        id: 'actions',
        label: _t('actions'),
      },
    ]
    return [
      ...madatoryCols,
      ...(acl.canLinkToMainOrg() ? actionCols : []),
    ] as Col[]
  }, [acl, t])

  const handleUnlinkOrganisation = useCallback(
    (orgId: string) => {
      unlinkAffiliatedOrganisation({
        affiliatedOrgId: orgId,
      })
    },
    [unlinkAffiliatedOrganisation],
  )

  const showRegionCol = useMemo(() => {
    const colRegion = cols.find(({ id }) => id === 'region')
    if (colRegion) {
      return {
        isEmpty: !affiliatedOrgs?.organizations?.some(
          org => org?.address.region,
        ),
        id: colRegion.id,
      }
    }

    return {
      isEmpty: false,
    }
  }, [affiliatedOrgs?.organizations, cols])

  const filterCols = useMemo(() => {
    const { isEmpty: isEmptyRegionCol, id: regionColId } = showRegionCol

    if (isEmptyRegionCol) {
      return cols.filter(col => col.id != regionColId)
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
  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1" mb={2}>
          {t('pages.org-details.tabs.affiliated-orgs.title')}
        </Typography>
        {acl.canLinkToMainOrg() ? (
          <Button
            variant="contained"
            size="large"
            sx={{
              width: '250px',
            }}
            onClick={() => navigate(`/organisations/${orgId}/invite`)}
            data-testid="add-an-affiliate"
          >
            {t('pages.org-details.tabs.affiliated-orgs.add-an-affiliate')}
          </Button>
        ) : null}
      </Box>

      {fetching ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-details-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {!fetching && !error && org ? (
        <Box sx={{ mt: '20px' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table data-testid="affiliated-organisations">
              <TableHead cols={filterCols} />
              <TableBody>
                <TableNoRows
                  noRecords={
                    !fetching && !affiliatedOrgs?.organizations?.length
                  }
                  itemsName={t('common.affiliated-orgs').toLocaleLowerCase()}
                  colSpan={cols.length}
                />

                {affiliatedOrgs?.organizations?.map(affiliatedOrg => (
                  <TableRow
                    key={`affiliated-org-${affiliatedOrg.id}`}
                    data-testid={`affiliated-org-${affiliatedOrg.id}`}
                  >
                    <TableCell>{affiliatedOrg.name}</TableCell>
                    <TableCell>{affiliatedOrg.address?.country}</TableCell>
                    {!showRegionCol.isEmpty ? (
                      <TableCell>{affiliatedOrg.address?.region}</TableCell>
                    ) : null}
                    <TableCell>
                      {t(`common.org-sectors.${affiliatedOrg.sector}`)}
                    </TableCell>
                    <TableCell>
                      {t('dates.withTime', {
                        date: affiliatedOrg.updatedAt,
                      })}
                    </TableCell>
                    <TableCell>
                      {t('dates.withTime', {
                        date: affiliatedOrg.createdAt,
                      })}
                    </TableCell>
                    {acl.canLinkToMainOrg() ? (
                      <TableCell>
                        <ManageAffiliatedOrgsMenu
                          affiliatedOrg={
                            affiliatedOrg as Organization['affiliated_organisations'][0]
                          }
                          onUnlinkClick={item =>
                            handleUnlinkOrganisation(item.id)
                          }
                        />
                      </TableCell>
                    ) : null}
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
          </TableContainer>
        </Box>
      ) : null}
    </Box>
  )
}
